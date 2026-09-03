import { describe, expect, it } from "vitest";
import {
  MOMO_TILL_BODY_ANIM_REPEAT,
  MOMO_TILL_DIRT_FRAME_COUNT,
  MOMO_TILL_FEET_Y,
  MOMO_TILL_FRAME,
  MOMO_TILL_FRAME_COUNT,
  MOMO_TILL_FRAME_RATE,
  MOMO_TILL_HOE_FRAME_MAP,
  MOMO_TILL_HOE_HEAD_LOCAL,
  MOMO_TILL_IMPACT_FRAME_INDEX,
  MOMO_TILL_ORIGIN,
} from "./momoTillVisualConfig";
import {
  hoeFrameForBodyFrame,
  hoeWorldPosition,
  impactWorldPosition,
  mirroredOffsetX,
  plotCenterWorld,
  shouldSpawnTillImpact,
  plotWorkFeetWorld,
  slimeGroundWorld,
  tillRecoverHopGrounds,
  tillStrikeFeetWorld,
  visualSideFromFacing,
} from "./tillPresentation";
import { SLIME_HOP_DURATION_MS, WORK_DURATION_MS } from "@/src/simulation/constants";
import { tileToAnchor } from "@/src/world/constants";
import { slimeView } from "../slimeView";
import { createSlimeState, SLIME_IDS, SLIME_SPAWNS } from "@/src/simulation/entities/SlimeState";
import type { Task } from "@/src/simulation/entities/Task";

describe("hoe frame map", () => {
  it("is an identity map for all 7 body frames", () => {
    expect(MOMO_TILL_HOE_FRAME_MAP).toHaveLength(MOMO_TILL_FRAME_COUNT);
    expect(MOMO_TILL_FRAME_RATE).toBe(8);
    expect(MOMO_TILL_ORIGIN).toEqual({
      x: 0.5,
      y: MOMO_TILL_FEET_Y / MOMO_TILL_FRAME.height,
    });
    expect(MOMO_TILL_FEET_Y).toBe(57);
    expect(MOMO_TILL_ORIGIN.y).toBeLessThan(1);
    for (let i = 0; i < MOMO_TILL_FRAME_COUNT; i += 1) {
      expect(MOMO_TILL_HOE_FRAME_MAP[i]).toBe(i);
      expect(hoeFrameForBodyFrame(i)).toBe(i);
    }
  });
});

describe("flip offsets", () => {
  it("leaves west offsets unchanged and mirrors east x", () => {
    expect(visualSideFromFacing(1)).toBe("west");
    expect(visualSideFromFacing(-1)).toBe("east");
    expect(mirroredOffsetX(6, 1)).toBe(6);
    expect(mirroredOffsetX(6, -1)).toBe(-6);
    expect(mirroredOffsetX(-3, 1)).toBe(-3);
    expect(mirroredOffsetX(-3, -1)).toBe(3);
    const west = hoeWorldPosition(100, 200, 0, 1);
    const east = hoeWorldPosition(100, 200, 0, -1);
    expect(west).toEqual({ x: 100, y: 200 });
    expect(east).toEqual({ x: 100, y: 200 });
  });
});

describe("till dirt at hoe head", () => {
  it("spawns on the blade and mirrors east without moving the body", () => {
    expect(impactWorldPosition(100, 200, 1)).toEqual({
      x: 100 + MOMO_TILL_HOE_HEAD_LOCAL.x,
      y: 200 + MOMO_TILL_HOE_HEAD_LOCAL.y,
    });
    expect(impactWorldPosition(100, 200, -1)).toEqual({
      x: 100 - MOMO_TILL_HOE_HEAD_LOCAL.x,
      y: 200 + MOMO_TILL_HOE_HEAD_LOCAL.y,
    });
    expect(hoeWorldPosition(100, 200, 5, 1)).toEqual({ x: 100, y: 200 });
  });
});

describe("till strike on plot center", () => {
  const plot = { x: 2, y: 12 };
  const east = { x: 3, y: 12 };
  const west = { x: 1, y: 12 };
  const center = plotCenterWorld(plot);

  it("places the west-facing blade on the plot center from the east stance", () => {
    const feet = tillStrikeFeetWorld(plot, east);
    expect(feet).toBeDefined();
    expect(impactWorldPosition(feet!.x, feet!.y, 1)).toEqual(center);
  });

  it("places the east-facing blade on the plot center from the west stance", () => {
    const feet = tillStrikeFeetWorld(plot, west);
    expect(feet).toBeDefined();
    expect(impactWorldPosition(feet!.x, feet!.y, -1)).toEqual(center);
  });

  it("walks the last hop onto that strike pose", () => {
    const def = SLIME_SPAWNS.find((entry) => entry.id === SLIME_IDS.MOMO);
    if (!def) {
      throw new Error("Momo spawn missing");
    }
    const momo = createSlimeState(def, 0);
    momo.state = "working";
    momo.tileX = east.x;
    momo.tileY = east.y;
    momo.faceTile = plot;
    const tillTask: Task = {
      id: "till_center",
      type: "till_soil",
      target: plot,
      nodeId: "farm_2_12",
      workTile: east,
      state: "in_progress",
      assignedSlimeId: SLIME_IDS.MOMO,
    };
    const view = slimeView(momo, 0, 0, undefined, 0, tillTask);
    expect(impactWorldPosition(view.groundX, view.groundY, view.facing)).toEqual(center);
    expect(slimeGroundWorld(tillTask, east.x, east.y)).toEqual(tillStrikeFeetWorld(plot, east));
    const plantOnPlot: Task = { ...tillTask, type: "plant_crop", workTile: plot };
    expect(slimeGroundWorld(plantOnPlot, plot.x, plot.y)).toEqual(plotWorkFeetWorld(plot));
    expect(slimeGroundWorld(plantOnPlot, east.x, east.y)).toEqual(tileToAnchor(east.x, east.y));
  });

  it("walks from the strike pose to tile feet instead of teleporting", () => {
    const def = SLIME_SPAWNS.find((entry) => entry.id === SLIME_IDS.MOMO);
    if (!def) {
      throw new Error("Momo spawn missing");
    }
    const momo = createSlimeState(def, 0);
    momo.tileX = east.x;
    momo.tileY = east.y;
    momo.faceTile = plot;
    const tillTask: Task = {
      id: "till_center",
      type: "till_soil",
      target: plot,
      nodeId: "farm_2_12",
      workTile: east,
      state: "in_progress",
      assignedSlimeId: SLIME_IDS.MOMO,
    };
    momo.state = "working";
    const working = slimeView(momo, 0, 0, undefined, 0, tillTask);
    const recover = tillRecoverHopGrounds(plot, east);
    expect(recover).toBeDefined();
    expect(working.groundX).toBe(recover!.from.x);
    expect(working.groundY).toBe(recover!.from.y);

    momo.state = "idle";
    momo.tillRecoverPlot = plot;
    momo.hopFrom = east;
    momo.hopTo = east;
    momo.hopElapsedMs = 0;
    const start = slimeView(momo, 0, 0);
    expect(start.groundX).toBe(working.groundX);
    expect(start.groundY).toBe(working.groundY);
    expect(start.anim).toBe("hop");

    momo.hopElapsedMs = SLIME_HOP_DURATION_MS;
    const end = slimeView(momo, 0, 0);
    expect(end.groundX).toBe(recover!.to.x);
    expect(end.groundY).toBe(recover!.to.y);
  });
});

describe("plant and harvest on plot center", () => {
  const plot = { x: 2, y: 12 };
  const center = plotCenterWorld(plot);

  function plotTask(type: "plant_crop" | "harvest_crop"): Task {
    return {
      id: `${type}_center`,
      type,
      target: plot,
      nodeId: "farm_2_12",
      workTile: plot,
      state: "in_progress",
      assignedSlimeId: SLIME_IDS.MOMO,
    };
  }

  function momoOnPlot(): ReturnType<typeof createSlimeState> {
    const def = SLIME_SPAWNS.find((entry) => entry.id === SLIME_IDS.MOMO);
    if (!def) {
      throw new Error("Momo spawn missing");
    }
    const momo = createSlimeState(def, 0);
    momo.tileX = plot.x;
    momo.tileY = plot.y;
    return momo;
  }

  it("lands the last hop on the plot center for plant and harvest", () => {
    const feet = plotWorkFeetWorld(plot);
    expect(feet).toEqual({ x: center.x, y: center.y });
    expect(slimeGroundWorld(plotTask("plant_crop"), plot.x, plot.y)).toEqual(feet);
    expect(slimeGroundWorld(plotTask("harvest_crop"), plot.x, plot.y)).toEqual(feet);
    expect(slimeGroundWorld(plotTask("plant_crop"), plot.x + 1, plot.y)).toEqual(
      tileToAnchor(plot.x + 1, plot.y),
    );

    const momo = momoOnPlot();
    momo.state = "working";
    const plant = slimeView(momo, 0, 0, undefined, 0, plotTask("plant_crop"));
    expect(plant.groundX).toBe(feet.x);
    expect(plant.groundY).toBe(feet.y);
    const harvest = slimeView(momo, 0, 0, undefined, 0, plotTask("harvest_crop"));
    expect(harvest.groundX).toBe(feet.x);
    expect(harvest.groundY).toBe(feet.y);
  });

  it("walks from the plot-center pose to tile feet instead of teleporting", () => {
    const momo = momoOnPlot();
    const plantTask = plotTask("plant_crop");
    momo.state = "working";
    const working = slimeView(momo, 0, 0, undefined, 0, plantTask);
    const recover = tillRecoverHopGrounds(plot, plot);
    expect(recover).toBeDefined();
    expect(working.groundX).toBe(recover!.from.x);
    expect(working.groundY).toBe(recover!.from.y);
    expect(recover!.to).toEqual(tileToAnchor(plot.x, plot.y));

    momo.state = "idle";
    momo.tillRecoverPlot = plot;
    momo.hopFrom = plot;
    momo.hopTo = plot;
    momo.hopElapsedMs = 0;
    const start = slimeView(momo, 0, 0);
    expect(start.groundX).toBe(working.groundX);
    expect(start.groundY).toBe(working.groundY);
    expect(start.anim).toBe("hop");

    momo.hopElapsedMs = SLIME_HOP_DURATION_MS;
    const end = slimeView(momo, 0, 0);
    expect(end.groundX).toBe(recover!.to.x);
    expect(end.groundY).toBe(recover!.to.y);
  });

  it("starts harvest carry from the plot-center pose", () => {
    const momo = momoOnPlot();
    const harvestTask = plotTask("harvest_crop");
    momo.state = "working";
    const working = slimeView(momo, 0, 0, undefined, 0, harvestTask);
    const next = { x: plot.x + 1, y: plot.y };
    momo.state = "carrying_to_storage";
    momo.hopFrom = plot;
    momo.hopTo = next;
    momo.hopElapsedMs = 0;
    const start = slimeView(momo, 0, 0, undefined, 0, harvestTask);
    expect(start.groundX).toBe(working.groundX);
    expect(start.groundY).toBe(working.groundY);
    momo.hopElapsedMs = SLIME_HOP_DURATION_MS;
    const end = slimeView(momo, 0, 0, undefined, 0, harvestTask);
    expect(end.groundX).toBe(tileToAnchor(next.x, next.y).x);
    expect(end.groundY).toBe(tileToAnchor(next.x, next.y).y);
  });
});

describe("till impact edge", () => {
  const impact = MOMO_TILL_IMPACT_FRAME_INDEX;
  const frameMs = 1000 / MOMO_TILL_FRAME_RATE;

  it("plays one swing; dirt ends when work completes so the tile can change then", () => {
    expect(MOMO_TILL_BODY_ANIM_REPEAT).toBe(0);
    expect(impact * frameMs + MOMO_TILL_DIRT_FRAME_COUNT * frameMs).toBe(WORK_DURATION_MS);
  });

  it("spawns once on enter, not while held, once more after wrap, and never after work ends", () => {
    expect(impact).toBe(5);
    expect(shouldSpawnTillImpact(impact - 1, impact, true)).toBe(true);
    expect(shouldSpawnTillImpact(impact, impact, true)).toBe(false);
    expect(shouldSpawnTillImpact(MOMO_TILL_FRAME_COUNT - 1, 0, true)).toBe(false);
    expect(shouldSpawnTillImpact(impact - 1, impact, true)).toBe(true);
    expect(shouldSpawnTillImpact(impact - 1, impact, false)).toBe(false);
    expect(shouldSpawnTillImpact(null, impact, false)).toBe(false);
  });
});

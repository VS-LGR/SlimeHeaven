import { describe, expect, it } from "vitest";
import { Simulation } from "../Simulation";
import { SLIME_IDS } from "../entities/SlimeState";
import {
  isSleepMinute,
  RESIDENT_SLEEP_SCHEDULES,
  sleepScheduleFor,
} from "../data/sleepRoutines";
import { minutesFromTimeOfDay } from "../timeConfig";
import { isJobAssignable } from "./slimeAvailability";
import { formatRoutineBlockLabel, HOME_RETRY_TICKS } from "./SleepRoutineSystem";
import { createGatherTask, assignAvailableTasks } from "./JobSystem";
import { GATHER_AMOUNT } from "../constants";
import { inviteVisitor, spawnLilyVisitor } from "./VisitorSystem";
import { commitUntilWaiting, spawnShallow, villageSim } from "./fishingTestUtils";
import { SATIETY_DECAY_PER_TICK } from "../needsConfig";
import { placeConstructionSite } from "./BuildingSystem";
import { STARTING_HOMES } from "../data/startingHomes";
import { designateFarmTile } from "./FarmSystem";

function tickUntil(
  sim: Simulation,
  predicate: () => boolean,
  maxTicks = 80,
): void {
  for (let i = 0; i < maxTicks; i += 1) {
    if (predicate()) {
      return;
    }
    sim.tick();
  }
}

describe("sleep schedules 05.5D", () => {
  it("authors wake and bedtime per resident type, not instance ids", () => {
    expect(sleepScheduleFor("momo")).toEqual(RESIDENT_SLEEP_SCHEDULES.momo);
    expect(sleepScheduleFor("tito")).toEqual(RESIDENT_SLEEP_SCHEDULES.tito);
    expect(sleepScheduleFor("pingo")).toEqual(RESIDENT_SLEEP_SCHEDULES.pingo);
    expect(sleepScheduleFor("lily")).toBeUndefined();
    expect(RESIDENT_SLEEP_SCHEDULES.momo?.wakeMinute).toBe(minutesFromTimeOfDay(5, 30));
    expect(RESIDENT_SLEEP_SCHEDULES.momo?.bedtimeMinute).toBe(minutesFromTimeOfDay(21, 30));
    expect(RESIDENT_SLEEP_SCHEDULES.tito?.wakeMinute).toBe(minutesFromTimeOfDay(7, 0));
    expect(RESIDENT_SLEEP_SCHEDULES.tito?.bedtimeMinute).toBe(minutesFromTimeOfDay(23, 0));
    expect(RESIDENT_SLEEP_SCHEDULES.pingo?.wakeMinute).toBe(minutesFromTimeOfDay(11, 0));
    expect(RESIDENT_SLEEP_SCHEDULES.pingo?.bedtimeMinute).toBe(minutesFromTimeOfDay(3, 0));
  });

  it("handles Momo/Tito midnight wrap and Pingo's same-day sleep window", () => {
    const momo = sleepScheduleFor("momo")!;
    expect(isSleepMinute(minutesFromTimeOfDay(21, 30), momo)).toBe(true);
    expect(isSleepMinute(minutesFromTimeOfDay(0, 0), momo)).toBe(true);
    expect(isSleepMinute(minutesFromTimeOfDay(5, 29), momo)).toBe(true);
    expect(isSleepMinute(minutesFromTimeOfDay(5, 30), momo)).toBe(false);
    expect(isSleepMinute(minutesFromTimeOfDay(12, 0), momo)).toBe(false);

    const pingo = sleepScheduleFor("pingo")!;
    expect(isSleepMinute(minutesFromTimeOfDay(3, 0), pingo)).toBe(true);
    expect(isSleepMinute(minutesFromTimeOfDay(10, 59), pingo)).toBe(true);
    expect(isSleepMinute(minutesFromTimeOfDay(11, 0), pingo)).toBe(false);
    expect(isSleepMinute(minutesFromTimeOfDay(2, 59), pingo)).toBe(false);
    expect(isSleepMinute(minutesFromTimeOfDay(23, 0), pingo)).toBe(false);
  });

  it("keeps different residents awake at the same clock time", () => {
    const sim = new Simulation();
    sim.setClock({ hour: 22, minute: 0 });
    const momo = sim.state.slimes[SLIME_IDS.MOMO];
    const tito = sim.state.slimes[SLIME_IDS.TITO];
    const pingo = sim.state.slimes[SLIME_IDS.PINGO];
    expect(isJobAssignable(sim.state, momo)).toBe(false);
    expect(isJobAssignable(sim.state, tito)).toBe(true);
    expect(isJobAssignable(sim.state, pingo)).toBe(true);
    expect(["returning_home", "sleeping", "home_blocked"]).toContain(momo.routinePhase);
    expect(tito.routinePhase).toBe("awake");
    expect(pingo.routinePhase).toBe("awake");
  });

  it("keeps Pingo active after Momo and Tito are in their sleep window", () => {
    const sim = new Simulation();
    sim.setClock({ hour: 0, minute: 0 });
    expect(isJobAssignable(sim.state, sim.state.slimes[SLIME_IDS.MOMO])).toBe(false);
    expect(isJobAssignable(sim.state, sim.state.slimes[SLIME_IDS.TITO])).toBe(false);
    expect(isJobAssignable(sim.state, sim.state.slimes[SLIME_IDS.PINGO])).toBe(true);
  });
});

describe("sleep lifecycle 05.5D", () => {
  it("sleeps only after arriving at the home entrance", () => {
    const sim = new Simulation();
    sim.setClock({ hour: 22, minute: 0 });
    const momo = sim.state.slimes[SLIME_IDS.MOMO];
    expect(momo.state).not.toBe("sleeping");
    expect(momo.routinePhase).toBe("returning_home");
    tickUntil(sim, () => momo.state === "sleeping");
    expect(momo.state).toBe("sleeping");
    const home = STARTING_HOMES.find((entry) => entry.residentTypeId === "momo")!;
    expect(momo.tileX).toBe(home.origin.x);
    expect(momo.tileY).toBe(home.origin.y + 2);
  });

  it("rejects new jobs at bedtime and interrupts gather without crediting stock", () => {
    const sim = new Simulation();
    sim.setClock({ hour: 12, minute: 0 });
    const tito = sim.state.slimes[SLIME_IDS.TITO];
    const task = createGatherTask(sim.state, "gather_wood");
    assignAvailableTasks(sim.state);
    expect(task?.assignedSlimeId).toBe(SLIME_IDS.TITO);
    tito.state = "working";
    tito.workElapsedMs = 100;
    const wood = sim.state.resources.wood;
    sim.setClock({ hour: 23, minute: 0 });
    expect(isJobAssignable(sim.state, tito)).toBe(false);
    expect(task?.state === "cancelled" || task?.assignedSlimeId !== SLIME_IDS.TITO).toBe(true);
    expect(sim.state.resources.wood).toBe(wood);
    expect(tito.carriedResource).toBeUndefined();
    expect(["returning_home", "sleeping", "home_blocked"]).toContain(tito.routinePhase);
  });

  it("delivers cargo before sleeping and does not drop or double-credit it", () => {
    const sim = new Simulation();
    sim.setClock({ hour: 12, minute: 0 });
    const tito = sim.state.slimes[SLIME_IDS.TITO];
    tito.carriedResource = { wood: GATHER_AMOUNT };
    tito.state = "carrying_to_storage";
    tito.tileX = sim.state.storage.x;
    tito.tileY = sim.state.storage.y;
    tito.path = [];
    const wood = sim.state.resources.wood;
    sim.setClock({ hour: 23, minute: 0 });
    expect(tito.carriedResource).toEqual({ wood: GATHER_AMOUNT });
    sim.tick();
    expect(sim.state.resources.wood).toBe(wood + GATHER_AMOUNT);
    expect(tito.carriedResource).toBeUndefined();
    expect(["returning_home", "sleeping", "home_blocked"]).toContain(tito.routinePhase);
  });

  it("keeps construction progress and committed cost when the builder goes to bed", () => {
    const sim = new Simulation();
    sim.setClock({ hour: 12, minute: 0 });
    delete sim.state.buildings.home_tito;
    sim.state.resources.wood = 20;
    sim.state.resources.stone = 20;
    const site = placeConstructionSite(sim.state, "brown_house", { x: 7, y: 11 });
    expect(site).not.toBeNull();
    if (!site) {
      throw new Error("Expected a Tito construction site.");
    }
    const costWood = sim.state.resources.wood;
    const costStone = sim.state.resources.stone;
    site.assignedSlimeId = SLIME_IDS.TITO;
    site.status = "building";
    site.workCompletedMs = 1200;
    const tito = sim.state.slimes[SLIME_IDS.TITO];
    tito.currentTaskId = site.id;
    const constructTask = Object.values(sim.state.tasks).find((task) => task.constructionSiteId === site.id);
    if (constructTask) {
      tito.currentTaskId = constructTask.id;
      constructTask.assignedSlimeId = SLIME_IDS.TITO;
      constructTask.state = "in_progress";
      tito.state = "working";
    }
    sim.setClock({ hour: 23, minute: 0 });
    expect(site.workCompletedMs).toBe(1200);
    expect(sim.state.resources.wood).toBe(costWood);
    expect(sim.state.resources.stone).toBe(costStone);
    expect(site.assignedSlimeId).not.toBe(SLIME_IDS.TITO);
  });

  it("cancels an active fishing session without awarding a catch", () => {
    const sim = villageSim();
    const { activity } = spawnShallow(sim.state);
    commitUntilWaiting(sim, activity);
    const pingo = sim.state.slimes[SLIME_IDS.PINGO];
    expect(pingo.state).toBe("fishing_wait");
    const catches = sim.state.fishInventory.blue_darter;
    sim.setClock({ hour: 4, minute: 0 });
    expect(pingo.state === "fishing_wait" || pingo.state === "fishing_bite").toBe(false);
    expect(sim.state.fishInventory.blue_darter).toBe(catches);
    expect(sim.state.fishingAccessPoints.every((point) => point.reservedBy === null)).toBe(true);
    expect(isJobAssignable(sim.state, pingo)).toBe(false);
  });

  it("wakes at the entrance without a free satiety refill", () => {
    const sim = new Simulation();
    sim.setClock({ hour: 22, minute: 0 });
    const momo = sim.state.slimes[SLIME_IDS.MOMO];
    tickUntil(sim, () => momo.state === "sleeping");
    const satiety = momo.satiety;
    sim.setClock({ hour: 12, minute: 0 });
    expect(momo.state).toBe("idle");
    expect(momo.routinePhase).toBe("awake");
    expect(momo.satiety).toBe(satiety);
    expect(isJobAssignable(sim.state, momo)).toBe(true);
  });

  it("pauses hunger while actually sleeping", () => {
    const sim = new Simulation();
    sim.setClock({ hour: 22, minute: 0 });
    const momo = sim.state.slimes[SLIME_IDS.MOMO];
    tickUntil(sim, () => momo.state === "sleeping");
    const before = momo.satiety;
    sim.tick();
    sim.tick();
    expect(momo.satiety).toBe(before);
    expect(momo.satiety).toBeGreaterThan(before - SATIETY_DECAY_PER_TICK);
  });

  it("does not enter stale sleep if wake arrives while still walking home", () => {
    const sim = new Simulation();
    sim.setClock({ hour: 22, minute: 0 });
    const momo = sim.state.slimes[SLIME_IDS.MOMO];
    expect(momo.state).toBe("moving_to_home");
    sim.setClock({ hour: 12, minute: 0 });
    expect(momo.state).toBe("idle");
    expect(momo.routinePhase).toBe("awake");
    expect(momo.state).not.toBe("sleeping");
  });

  it("blocks jobs when the home is missing and recovers when it returns", () => {
    const sim = new Simulation();
    const saved = sim.state.buildings.home_momo;
    delete sim.state.buildings.home_momo;
    sim.setClock({ hour: 22, minute: 0 });
    const momo = sim.state.slimes[SLIME_IDS.MOMO];
    expect(momo.routinePhase).toBe("home_blocked");
    expect(momo.routineBlockReason).toBe("missing_home");
    expect(momo.state).not.toBe("sleeping");
    expect(isJobAssignable(sim.state, momo)).toBe(false);
    if (saved) {
      sim.state.buildings.home_momo = saved;
    }
    momo.routineRetryAtTick = 0;
    sim.setClock({ hour: 22, minute: 1 });
    expect(momo.routinePhase === "returning_home" || momo.state === "sleeping").toBe(true);
  });

  it("retries a blocked home on a bounded timer, not every frame", () => {
    const sim = new Simulation();
    delete sim.state.buildings.home_momo;
    sim.setClock({ hour: 22, minute: 0 });
    const momo = sim.state.slimes[SLIME_IDS.MOMO];
    const retryAt = momo.routineRetryAtTick;
    expect(retryAt).toBeGreaterThan(sim.state.tickIndex);
    sim.tick();
    expect(momo.routineRetryAtTick).toBe(retryAt);
    expect(HOME_RETRY_TICKS).toBeGreaterThan(1);
  });

  it("cancels unfinished farming without applying the till", () => {
    const sim = new Simulation();
    sim.setClock({ hour: 12, minute: 0 });
    expect(designateFarmTile(sim.state, 2, 12)).toBe(true);
    const momo = sim.state.slimes[SLIME_IDS.MOMO];
    tickUntil(sim, () => {
      const task = momo.currentTaskId ? sim.state.tasks[momo.currentTaskId] : undefined;
      return task?.type === "till_soil";
    });
    const till = momo.currentTaskId ? sim.state.tasks[momo.currentTaskId] : undefined;
    expect(till?.type).toBe("till_soil");
    momo.state = "working";
    momo.workElapsedMs = 100;
    sim.setClock({ hour: 21, minute: 30 });
    expect(sim.state.farmAt(2, 12)?.state).toBe("designated");
    expect(till?.state === "cancelled" || till?.assignedSlimeId !== SLIME_IDS.MOMO).toBe(true);
    expect(isJobAssignable(sim.state, momo)).toBe(false);
  });

  it("cancels travel-to-food without consuming, and lets a started meal settle", () => {
    const sim = new Simulation();
    sim.setClock({ hour: 12, minute: 0 });
    const momo = sim.state.slimes[SLIME_IDS.MOMO];
    momo.satiety = 5;
    momo.state = "moving_to_food";
    momo.path = [];
    sim.state.resources.food = 2;
    sim.setClock({ hour: 21, minute: 30 });
    expect(sim.state.resources.food).toBe(2);
    expect(momo.state).not.toBe("moving_to_food");

    const tito = sim.state.slimes[SLIME_IDS.TITO];
    tito.satiety = 5;
    tito.tileX = sim.state.storage.x;
    tito.tileY = sim.state.storage.y;
    tito.state = "eating";
    tito.workElapsedMs = 0;
    sim.state.resources.food = 1;
    sim.setClock({ hour: 23, minute: 0 });
    expect(sim.state.resources.food).toBe(1);
    expect(tito.state).toBe("eating");
    expect(tito.satiety).toBe(5);
  });

  it("excludes Lily from resident sleep", () => {
    const sim = new Simulation();
    expect(spawnLilyVisitor(sim.state).ok).toBe(true);
    expect(inviteVisitor(sim.state, SLIME_IDS.LILY).ok).toBe(true);
    const lily = sim.state.slimes[SLIME_IDS.LILY];
    expect(lily.residencyStatus).toBe("invited_waiting_for_house");
    sim.setClock({ hour: 22, minute: 0 });
    expect(lily.routinePhase).toBe("awake");
    expect(lily.state).not.toBe("sleeping");
    expect(lily.state).not.toBe("moving_to_home");
    expect(isJobAssignable(sim.state, lily)).toBe(false);
    expect(sleepScheduleFor("lily")).toBeUndefined();
    expect(formatRoutineBlockLabel("missing_home")).toBe("Aguardando casa");
    expect(formatRoutineBlockLabel("unreachable")).toBe("Casa inacessível");
  });

  it("reconciles debug jumps twice without duplicating cargo or rewards", () => {
    const sim = new Simulation();
    sim.setClock({ hour: 12, minute: 0 });
    const tito = sim.state.slimes[SLIME_IDS.TITO];
    tito.carriedResource = { stone: GATHER_AMOUNT };
    tito.state = "carrying_to_storage";
    tito.tileX = sim.state.storage.x;
    tito.tileY = sim.state.storage.y;
    tito.path = [];
    const stone = sim.state.resources.stone;
    sim.setClock({ hour: 23, minute: 0 });
    sim.setClock({ hour: 23, minute: 0 });
    sim.tick();
    expect(sim.state.resources.stone).toBe(stone + GATHER_AMOUNT);
    sim.setClock({ hour: 23, minute: 0 });
    expect(sim.state.resources.stone).toBe(stone + GATHER_AMOUNT);
  });

  it("stops routine movement while paused", () => {
    const sim = new Simulation();
    sim.setClock({ hour: 22, minute: 0 });
    const momo = sim.state.slimes[SLIME_IDS.MOMO];
    const tileX = momo.tileX;
    const tileY = momo.tileY;
    const hop = momo.hopElapsedMs;
    sim.setPaused(true);
    sim.update(4000);
    expect(momo.tileX).toBe(tileX);
    expect(momo.tileY).toBe(tileY);
    expect(momo.hopElapsedMs).toBe(hop);
  });

  it("starts Pingo on a home transition when the restored clock is inside his sleep window", () => {
    const sim = new Simulation();
    sim.setClock({ hour: 9, minute: 30 });
    const pingo = sim.state.slimes[SLIME_IDS.PINGO];
    expect(isJobAssignable(sim.state, pingo)).toBe(false);
    expect(["returning_home", "sleeping"]).toContain(pingo.routinePhase);
    expect(pingo.state).not.toBe("working");
  });
});

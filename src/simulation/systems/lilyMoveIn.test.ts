import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { GameState } from "../GameState";
import { Simulation } from "../Simulation";
import { CHARACTERS } from "../data/characters";
import { SLIME_IDS } from "../entities/SlimeState";
import { SATIETY_DECAY_PER_TICK, SATIETY_INITIAL } from "../needsConfig";
import { STARTING_HOMES } from "../data/startingHomes";
import { BUILDINGS, buildingById, entranceTile } from "../data/buildings";
import {
  isResidentReadyForMoveIn,
  placedHomeForResident,
  playerBuildableBuildingTypes,
  residentHomeStatus,
} from "../residentHomes";
import {
  completeConstruction,
  placeConstructionSite,
} from "./BuildingSystem";
import { assignAvailableTasks, canPerformTask, createGatherTask } from "./JobSystem";
import { designateFarmTile } from "./FarmSystem";
import { isJobAssignable } from "./slimeAvailability";
import { isVillageResident, isVisitorLifecycle } from "../data/residents";
import {
  MOVE_IN_TOAST_MESSAGE,
  canMoveInResident,
  inviteVisitor,
  moveInInvitedResident,
  prepareLilyMoveInPreconditions,
  spawnLilyVisitor,
} from "./VisitorSystem";
import { selectSlimeCardModel } from "@/src/ui/hud/slimeCardModel";
import { MOVE_IN_ACTION_LABEL } from "@/src/ui/hud/slimeCardPresentation";
import { slimeView } from "@/src/game/render/slimeView";
import type { SlimeInfo } from "@/src/store/gameUiStore";

const LILY_ORIGIN = { x: 5, y: 11 };
const LILY_RECIPE = { wood: 10, stone: 4, vine: 3, foliage: 4, shell: 1 } as const;

function stockLilyRecipe(state: GameState): void {
  state.resources.wood = LILY_RECIPE.wood;
  state.resources.stone = LILY_RECIPE.stone;
  state.resources.vine = LILY_RECIPE.vine;
  state.resources.foliage = LILY_RECIPE.foliage;
  state.resources.shell = LILY_RECIPE.shell;
}

function inviteLily(state: GameState): void {
  expect(spawnLilyVisitor(state).ok).toBe(true);
  expect(inviteVisitor(state, SLIME_IDS.LILY).ok).toBe(true);
}

function completeLilyHouse(state: GameState) {
  stockLilyRecipe(state);
  const site = placeConstructionSite(state, "lily_house", LILY_ORIGIN);
  expect(site).not.toBeNull();
  site!.workCompletedMs = site!.workRequiredMs;
  const built = completeConstruction(state, site!.id);
  expect(built).not.toBeNull();
  return built!;
}

function lilyCard(info: Partial<SlimeInfo>) {
  return selectSlimeCardModel({
    id: SLIME_IDS.LILY,
    name: "Lily",
    state: "idle",
    taskLabel: "none",
    tileX: 0,
    tileY: 0,
    destX: null,
    destY: null,
    carrying: "Nothing",
    satiety: 100,
    hungerState: "fed",
    visual: "FINAL",
    anim: "idle",
    frame: 0,
    technique: 3,
    strength: 2,
    instinct: 3,
    luck: 3,
    specialties: [],
    capabilitiesDebug: "CAP: —",
    constructionActivity: null,
    constructionSiteId: null,
    constructionCapabilityEligible: null,
    constructionPresentation: null,
    constructionTool: null,
    residencyStatus: "invited_waiting_for_house",
    homeBuildingType: "lily_house",
    homeBuildingId: null,
    homeStatus: "completed",
    homeEntranceTile: "5,13",
    visitorInterestLabel: CHARACTERS.lily.visitorInterestLabel,
    visitorIntent: "idle",
    eligibleForJobs: false,
    needsActive: false,
    consumesFood: false,
    currentAnimation: "lily_idle",
    activeSpecialistAnimation: null,
    routinePhase: "awake",
    routineWakeTime: "08:00",
    routineBedtime: "22:00",
    routineJobAvailable: true,
    routineHomeDestination: "5,13",
    routineBlockReason: null,
    readyForMoveIn: false,
    ...info,
  });
}

function lilyCount(state: GameState): number {
  return Object.values(state.slimes).filter(
    (slime) => slime.id === SLIME_IDS.LILY || slime.name === "Lily",
  ).length;
}

function tickUntil(sim: Simulation, predicate: () => boolean, maxTicks = 120): void {
  for (let i = 0; i < maxTicks; i += 1) {
    if (predicate()) {
      return;
    }
    sim.tick();
  }
}

function snapshotLoop(state: GameState) {
  return {
    wood: state.resources.wood,
    stone: state.resources.stone,
    vine: state.resources.vine,
    foliage: state.resources.foliage,
    shell: state.resources.shell,
    food: state.resources.food,
    buildings: Object.keys(state.buildings).sort(),
    farms: Object.keys(state.farms).sort(),
    pingoHome: placedHomeForResident(state, "pingo")?.id,
    momoHome: placedHomeForResident(state, "momo")?.id,
    titoHome: placedHomeForResident(state, "tito")?.id,
  };
}

describe("Lily move-in 05.6C", () => {
  it("rejects move-in without invitation, house, or a completed associated lily_house", () => {
    const uninvited = new GameState();
    spawnLilyVisitor(uninvited);
    expect(canMoveInResident(uninvited, SLIME_IDS.LILY)).toBe(false);
    expect(moveInInvitedResident(uninvited, SLIME_IDS.LILY).ok).toBe(false);
    expect(isResidentReadyForMoveIn(uninvited, "lily")).toBe(false);

    const noHouse = new GameState();
    inviteLily(noHouse);
    expect(canMoveInResident(noHouse, SLIME_IDS.LILY)).toBe(false);
    expect(moveInInvitedResident(noHouse, SLIME_IDS.LILY).ok).toBe(false);
    expect(placedHomeForResident(noHouse, "pingo")).toBeDefined();
    expect(isResidentReadyForMoveIn(noHouse, "lily")).toBe(false);

    const incomplete = new GameState();
    inviteLily(incomplete);
    stockLilyRecipe(incomplete);
    const site = placeConstructionSite(incomplete, "lily_house", LILY_ORIGIN);
    expect(site).not.toBeNull();
    expect(site?.status).not.toBe("completed");
    expect(canMoveInResident(incomplete, SLIME_IDS.LILY)).toBe(false);
    expect(isResidentReadyForMoveIn(incomplete, "lily")).toBe(false);
    expect(moveInInvitedResident(incomplete, SLIME_IDS.LILY).ok).toBe(false);
    expect(incomplete.slimes[SLIME_IDS.LILY].residencyStatus).toBe("invited_waiting_for_house");
  });

  it("enables the house-ready action only for eligible invited Lily", () => {
    const sim = new Simulation();
    inviteLily(sim.state);
    const built = completeLilyHouse(sim.state);
    expect(isResidentReadyForMoveIn(sim.state, "lily")).toBe(true);
    expect(canMoveInResident(sim.state, SLIME_IDS.LILY)).toBe(true);
    expect(sim.state.slimes[SLIME_IDS.LILY].residencyStatus).toBe("invited_waiting_for_house");
    expect(placedHomeForResident(sim.state, "lily")?.id).toBe(built.id);

    const eligible = lilyCard({ readyForMoveIn: true, homeBuildingId: built.id });
    expect(eligible.showMoveIn).toBe(true);
    expect(eligible.showInvite).toBe(false);
    expect(eligible.variant).toBe("invited_visitor");
    expect(MOVE_IN_ACTION_LABEL).toBe("Sua casa está pronta!");

    expect(lilyCard({ residencyStatus: "visitor", readyForMoveIn: false, homeBuildingType: null }).showMoveIn).toBe(
      false,
    );
    expect(
      lilyCard({
        id: SLIME_IDS.PINGO,
        name: "Pingo",
        residencyStatus: "resident",
        readyForMoveIn: true,
        homeBuildingType: "small_blue_house",
      }).showMoveIn,
    ).toBe(false);
  });

  it("moves Lily in atomically, preserves identity, and is idempotent", () => {
    const sim = new Simulation();
    inviteLily(sim.state);
    const built = completeLilyHouse(sim.state);
    const lily = sim.state.slimes[SLIME_IDS.LILY];
    const tile = { x: lily.tileX, y: lily.tileY };
    const satiety = lily.satiety;
    const before = snapshotLoop(sim.state);
    expect(lilyCount(sim.state)).toBe(1);

    const first = moveInInvitedResident(sim.state, SLIME_IDS.LILY);
    expect(first.ok).toBe(true);
    expect(first.message).toBe(MOVE_IN_TOAST_MESSAGE);
    expect(sim.state.slimes[SLIME_IDS.LILY]).toBe(lily);
    expect(lily.id).toBe(SLIME_IDS.LILY);
    expect(lily.residencyStatus).toBe("resident");
    expect(isVillageResident(lily)).toBe(true);
    expect(isVisitorLifecycle(lily)).toBe(false);
    expect(Object.keys(sim.state.slimes).filter((id) => id === SLIME_IDS.LILY)).toHaveLength(1);
    expect(lilyCount(sim.state)).toBe(1);
    expect(placedHomeForResident(sim.state, "lily")?.id).toBe(built.id);
    expect(placedHomeForResident(sim.state, "lily")?.typeId).toBe("lily_house");
    expect(residentHomeStatus(sim.state, "lily")).toBe("completed");
    expect(sim.state.buildings[built.id]?.typeId).toBe("lily_house");
    expect(isResidentReadyForMoveIn(sim.state, "lily")).toBe(false);
    expect(canMoveInResident(sim.state, SLIME_IDS.LILY)).toBe(false);
    expect(lily.tileX).toBe(tile.x);
    expect(lily.tileY).toBe(tile.y);
    expect(lily.satiety).toBe(satiety);
    expect(lily.capabilities).toEqual([]);
    expect(lily.participatesInWork).toBe(false);
    expect(CHARACTERS.lily.participatesInWork).toBe(false);
    expect(snapshotLoop(sim.state)).toEqual(before);
    expect(playerBuildableBuildingTypes(sim.state)).toEqual([]);

    const toasts: string[] = [];
    if (first.ok) {
      toasts.push(first.message);
    }
    const second = sim.moveInVisitor(SLIME_IDS.LILY);
    if (second.ok) {
      toasts.push(second.message);
    }
    expect(second.ok).toBe(false);
    expect(second.alreadyComplete).toBe(true);
    expect(toasts).toEqual([MOVE_IN_TOAST_MESSAGE]);
    expect(lily.satiety).toBe(satiety);
    expect(lilyCount(sim.state)).toBe(1);
    expect(Object.keys(sim.state.buildings).filter((id) => sim.state.buildings[id].typeId === "lily_house")).toHaveLength(
      1,
    );

    expect(spawnLilyVisitor(sim.state).ok).toBe(false);
    expect(inviteVisitor(sim.state, SLIME_IDS.LILY).ok).toBe(false);
    const residentCard = lilyCard({
      residencyStatus: "resident",
      readyForMoveIn: false,
      needsActive: true,
      consumesFood: true,
      homeBuildingId: built.id,
    });
    expect(residentCard.showInvite).toBe(false);
    expect(residentCard.showMoveIn).toBe(false);
    expect(residentCard.variant).toBe("resident");
    expect(residentCard.home).toBe("Casa da Lily");
    expect(residentCard.specialtyLine).toBeNull();
  });

  it("clears visitor lifecycle and starts resident needs, routine, and home routing", () => {
    const sim = new Simulation();
    sim.setClock({ hour: 12, minute: 0 });
    inviteLily(sim.state);
    completeLilyHouse(sim.state);
    const lily = sim.state.slimes[SLIME_IDS.LILY];
    lily.state = "wandering";
    lily.destination = { x: 8, y: 8 };
    lily.path = [{ x: 8, y: 8 }];
    expect(moveInInvitedResident(sim.state, SLIME_IDS.LILY).ok).toBe(true);
    expect(isVisitorLifecycle(lily)).toBe(false);
    expect(lily.state).toBe("idle");
    expect(lily.destination).toBeUndefined();
    expect(lily.path).toEqual([]);
    expect(lily.satiety).toBe(SATIETY_INITIAL);

    for (let i = 0; i < 40; i += 1) {
      sim.tick();
    }
    expect(sim.state.slimes[SLIME_IDS.LILY]).toBe(lily);
    expect(lily.residencyStatus).toBe("resident");
    expect(lily.satiety).toBeLessThan(SATIETY_INITIAL);
    expect(lily.satiety).toBeCloseTo(SATIETY_INITIAL - SATIETY_DECAY_PER_TICK * 40, 5);

    const lilyEntrance = entranceTile(LILY_ORIGIN, buildingById("lily_house"));
    const otherEntrances = STARTING_HOMES.map((home) => ({
      x: home.origin.x,
      y: home.origin.y + 2,
    }));
    sim.setClock({ hour: 22, minute: 0 });
    expect(["returning_home", "sleeping", "home_blocked"]).toContain(lily.routinePhase);
    tickUntil(sim, () => lily.state === "sleeping");
    expect(lily.state).toBe("sleeping");
    expect(lily.tileX).toBe(lilyEntrance.x);
    expect(lily.tileY).toBe(lilyEntrance.y);
    for (const entrance of otherEntrances) {
      expect(lily.tileX === entrance.x && lily.tileY === entrance.y).toBe(false);
    }

    sim.setClock({ hour: 8, minute: 0 });
    expect(lily.state).not.toBe("sleeping");
    expect(lily.routinePhase).toBe("awake");
  });

  it("excludes Lily from productive and universal jobs using participatesInWork", () => {
    const sim = new Simulation();
    sim.setClock({ hour: 12, minute: 0 });
    inviteLily(sim.state);
    completeLilyHouse(sim.state);
    expect(moveInInvitedResident(sim.state, SLIME_IDS.LILY).ok).toBe(true);
    const lily = sim.state.slimes[SLIME_IDS.LILY];
    const pingo = sim.state.slimes[SLIME_IDS.PINGO];
    const momo = sim.state.slimes[SLIME_IDS.MOMO];
    const tito = sim.state.slimes[SLIME_IDS.TITO];
    expect(lily.capabilities).toEqual([]);
    expect(lily.participatesInWork).toBe(false);
    expect(isJobAssignable(sim.state, lily)).toBe(false);
    expect(isJobAssignable(sim.state, pingo)).toBe(true);
    expect(isJobAssignable(sim.state, momo)).toBe(true);
    expect(isJobAssignable(sim.state, tito)).toBe(true);

    const gather = createGatherTask(sim.state, "gather_wood");
    assignAvailableTasks(sim.state);
    expect(gather?.assignedSlimeId).toBe(SLIME_IDS.TITO);
    expect(lily.currentTaskId).toBeUndefined();
    expect(canPerformTask(lily, gather!)).toBe(false);

    gather!.state = "available";
    gather!.assignedSlimeId = undefined;
    tito.currentTaskId = undefined;
    tito.state = "idle";
    gather!.requiredCapabilities = [];
    assignAvailableTasks(sim.state);
    expect(gather?.assignedSlimeId).not.toBe(SLIME_IDS.LILY);
    expect(lily.currentTaskId).toBeUndefined();

    const jobSource = readFileSync("src/simulation/systems/JobSystem.ts", "utf8");
    const availability = readFileSync("src/simulation/systems/slimeAvailability.ts", "utf8");
    expect(jobSource).toMatch(/participatesInWork/);
    expect(availability).toMatch(/participatesInWork/);
    expect(jobSource).not.toMatch(/slime_lily/);
    expect(availability).not.toMatch(/slime_lily/);
    expect(CHARACTERS.pingo.participatesInWork).toBe(true);
    expect(CHARACTERS.momo.participatesInWork).toBe(true);
    expect(CHARACTERS.tito.participatesInWork).toBe(true);

    lily.participatesInWork = true;
    expect(canPerformTask(lily, gather!)).toBe(true);
    expect(isJobAssignable(sim.state, lily)).toBe(true);
    lily.participatesInWork = false;
    expect(canPerformTask(lily, gather!)).toBe(false);
    expect(isJobAssignable(sim.state, lily)).toBe(false);

    tito.participatesInWork = false;
    expect(isJobAssignable(sim.state, tito)).toBe(false);
    tito.participatesInWork = true;
    expect(isJobAssignable(sim.state, tito)).toBe(true);
  });

  it("does not charge resources, duplicate presentation, or change unrelated loops", () => {
    const sim = new Simulation();
    inviteLily(sim.state);
    completeLilyHouse(sim.state);
    designateFarmTile(sim.state, 2, 12);
    const before = snapshotLoop(sim.state);
    const lily = sim.state.slimes[SLIME_IDS.LILY];
    expect(moveInInvitedResident(sim.state, SLIME_IDS.LILY).ok).toBe(true);
    expect(snapshotLoop(sim.state)).toEqual(before);
    expect(sim.commitFishing(5 * 32, 11 * 32)).toBe(false);
    expect(BUILDINGS.lily_house.id).toBe("lily_house");
    const views = Object.values(sim.state.slimes).map((slime) => ({
      id: slime.id,
      view: slimeView(slime, 0, 0),
    }));
    expect(views.filter((entry) => entry.id === SLIME_IDS.LILY)).toHaveLength(1);
    expect(views.filter((entry) => entry.id === SLIME_IDS.LILY)[0]?.view.anim).toBeDefined();
    expect(lily.residencyStatus).toBe("resident");
    expect(playerBuildableBuildingTypes(sim.state)).not.toContain("lily_house");

    const prepared = new Simulation();
    expect(prepareLilyMoveInPreconditions(prepared.state).ok).toBe(true);
    expect(prepared.state.slimes[SLIME_IDS.LILY].residencyStatus).toBe("invited_waiting_for_house");
    expect(isResidentReadyForMoveIn(prepared.state, "lily")).toBe(true);
    expect(canMoveInResident(prepared.state, SLIME_IDS.LILY)).toBe(true);
  });
});

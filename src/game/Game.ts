import Phaser from "phaser";
import { createPhaserConfig, REGISTRY_KEYS } from "./config";
import { applyGameViewport } from "./viewport";
import { BootScene } from "./scenes/BootScene";
import { VillageScene } from "./scenes/VillageScene";
import { GameState } from "@/src/simulation/GameState";
import { Simulation } from "@/src/simulation/Simulation";
import { hydrateWorldTime, writeWorldTimeSave } from "@/src/simulation/worldTimePersist";

export function createGame(parent: HTMLElement): Phaser.Game {
  const state = new GameState();
  hydrateWorldTime(state.worldTime);
  const simulation = new Simulation(state);
  const game = new Phaser.Game({
    ...createPhaserConfig(parent),
    scene: [BootScene, VillageScene],
    callbacks: {
      preBoot: (bootGame) => {
        bootGame.registry.set(REGISTRY_KEYS.GAME_STATE, simulation.state);
        bootGame.registry.set(REGISTRY_KEYS.SIMULATION, simulation);
      },
    },
  });

  const resize = () => {
    applyGameViewport(game, parent);
  };
  const persistTime = () => writeWorldTimeSave(simulation.state.worldTime);
  const onPageHide = () => persistTime();
  const onVisibility = () => {
    if (document.visibilityState === "hidden") {
      persistTime();
    }
  };
  window.addEventListener("resize", resize);
  window.addEventListener("pagehide", onPageHide);
  document.addEventListener("visibilitychange", onVisibility);
  const observer = new ResizeObserver(resize);
  observer.observe(parent);
  game.events.once(Phaser.Core.Events.READY, resize);
  game.events.once(Phaser.Core.Events.DESTROY, () => {
    window.removeEventListener("resize", resize);
    window.removeEventListener("pagehide", onPageHide);
    document.removeEventListener("visibilitychange", onVisibility);
    observer.disconnect();
    persistTime();
  });

  return game;
}

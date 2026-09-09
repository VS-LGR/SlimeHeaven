import Phaser from "phaser";
import { createPhaserConfig, REGISTRY_KEYS } from "./config";
import { applyGameViewport } from "./viewport";
import { BootScene } from "./scenes/BootScene";
import { VillageScene } from "./scenes/VillageScene";
import { GameState } from "@/src/simulation/GameState";
import { Simulation } from "@/src/simulation/Simulation";

export function createGame(parent: HTMLElement): Phaser.Game {
  const simulation = new Simulation(new GameState());
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
  window.addEventListener("resize", resize);
  const observer = new ResizeObserver(resize);
  observer.observe(parent);
  game.events.once(Phaser.Core.Events.READY, resize);
  game.events.once(Phaser.Core.Events.DESTROY, () => {
    window.removeEventListener("resize", resize);
    observer.disconnect();
  });

  return game;
}

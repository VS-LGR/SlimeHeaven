import Phaser from "phaser";
import {
  GAME_HEIGHT,
  GAME_WIDTH,
  createPhaserConfig,
  integerCanvasScale,
  REGISTRY_KEYS,
} from "./config";
import { BootScene } from "./scenes/BootScene";
import { VillageScene } from "./scenes/VillageScene";
import { GameState } from "@/src/simulation/GameState";
import { Simulation } from "@/src/simulation/Simulation";

function applyIntegerScale(game: Phaser.Game, parent: HTMLElement): void {
  const scale = integerCanvasScale(parent.clientWidth, parent.clientHeight);
  const canvas = game.canvas;
  canvas.style.width = `${GAME_WIDTH * scale}px`;
  canvas.style.height = `${GAME_HEIGHT * scale}px`;
  canvas.style.imageRendering = "pixelated";
}

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

  const resize = () => applyIntegerScale(game, parent);
  window.addEventListener("resize", resize);
  game.events.once(Phaser.Core.Events.READY, resize);
  game.events.once(Phaser.Core.Events.DESTROY, () => {
    window.removeEventListener("resize", resize);
  });

  return game;
}

import type { SlimeAnimName } from "../slimeVisualConfig";

export interface SpecialistAnchor {
  slimeId: string;
  groundX: number;
  groundY: number;
  depth: number;
  facing: 1 | -1;
  anim: SlimeAnimName;
  frame: number;
}

/**
 * Presentation-only: do not cut a playing body clip. Looping clips finish the
 * current cycle, then the next requested action starts.
 */
export type BodyPlaybackAction = "apply" | "hold" | "finish-loop";

export function bodyClipRepeatsForever(repeat: number | undefined | null): boolean {
  return repeat === -1;
}

export function nextBodyPlaybackAction(
  isPlaying: boolean,
  sameClip: boolean,
  repeatsForever: boolean,
): BodyPlaybackAction {
  if (!isPlaying || sameClip) {
    return "apply";
  }
  return repeatsForever ? "finish-loop" : "hold";
}

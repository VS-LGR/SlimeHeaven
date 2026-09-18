export type InventoryHudEvent =
  | { type: "openInventory" }
  | { type: "closeInventory" }
  | { type: "toggleInventory" };

export interface InventoryHudMachine {
  inventoryOpen: boolean;
}

export function createInventoryHudMachine(): InventoryHudMachine {
  return { inventoryOpen: false };
}

export function inventoryHudInventoryOpen(state: InventoryHudMachine): boolean {
  return state.inventoryOpen;
}

export function advanceInventoryHud(
  state: InventoryHudMachine,
  event: InventoryHudEvent,
): InventoryHudMachine {
  switch (event.type) {
    case "openInventory":
      return { inventoryOpen: true };
    case "closeInventory":
      return { inventoryOpen: false };
    case "toggleInventory":
      return { inventoryOpen: !state.inventoryOpen };
    default:
      return state;
  }
}

/** Esc closes the centered inventory dialog. */
export function handleInventoryEscape(state: InventoryHudMachine): InventoryHudMachine | null {
  if (state.inventoryOpen) {
    return { inventoryOpen: false };
  }
  return null;
}

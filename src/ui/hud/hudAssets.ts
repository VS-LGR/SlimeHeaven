export const HUD_ASSETS = {
  topLeft: "/assets/UI/UI_Top_Left.png",
  topRight: "/assets/UI/UI_Top_Right.png",
  iconWood: "/assets/UI/UI_Icon_Wood.png",
  iconStone: "/assets/UI/UI_Icon_Rock.png",
  iconFood: "/assets/UI/UI_Icon_Food.png",
  iconHarmony: "/assets/UI/UI_Icon_Harmony.png",
  iconSun: "/assets/UI/UI_Icon_Sun.png",
  iconConfig: "/assets/UI/UI_Icon_Config.png",
  iconPlanting: "/assets/UI/UI_Icon_Planting.png",
  iconWoodCutting: "/assets/UI/UI_Icon_Wood_Cutting.png",
  iconMining: "/assets/UI/UI_Icon_Mining.png",
  iconFishing: "/assets/UI/UI_Icon_Fishing.png",
  iconBuild: "/assets/UI/UI_Icon_Build.png",
  toolbar: "/assets/UI/UI_Icon_ToolBar.png",
  toolbarSelected: "/assets/UI/UI_Icon_ToolBar_Selected.png",
  iconTechnique: "/assets/UI/UI_Icon_Technique.png",
  iconStrength: "/assets/UI/UI_Icon_Strength.png",
  iconInstinct: "/assets/UI/UI_Icon_Instintic.png",
  iconLuck: "/assets/UI/UI_Icon_Luck.png",
  iconSpeak: "/assets/UI/UI_Icon_Speak.png",
  iconStar: "/assets/UI/UI_Icon_Star.png",
  iconStarEmpty: "/assets/UI/UI_Icon_Star_Empty.png",
} as const;

export const HUD_ASSET_FILES = {
  topLeft: "public/assets/UI/UI_Top_Left.png",
  topRight: "public/assets/UI/UI_Top_Right.png",
  iconWood: "public/assets/UI/UI_Icon_Wood.png",
  iconStone: "public/assets/UI/UI_Icon_Rock.png",
  iconFood: "public/assets/UI/UI_Icon_Food.png",
  iconHarmony: "public/assets/UI/UI_Icon_Harmony.png",
  iconSun: "public/assets/UI/UI_Icon_Sun.png",
  iconConfig: "public/assets/UI/UI_Icon_Config.png",
  iconPlanting: "public/assets/UI/UI_Icon_Planting.png",
  iconWoodCutting: "public/assets/UI/UI_Icon_Wood_Cutting.png",
  iconMining: "public/assets/UI/UI_Icon_Mining.png",
  iconFishing: "public/assets/UI/UI_Icon_Fishing.png",
  iconBuild: "public/assets/UI/UI_Icon_Build.png",
  toolbar: "public/assets/UI/UI_Icon_ToolBar.png",
  toolbarSelected: "public/assets/UI/UI_Icon_ToolBar_Selected.png",
  iconTechnique: "public/assets/UI/UI_Icon_Technique.png",
  iconStrength: "public/assets/UI/UI_Icon_Strength.png",
  iconInstinct: "public/assets/UI/UI_Icon_Instintic.png",
  iconLuck: "public/assets/UI/UI_Icon_Luck.png",
  iconSpeak: "public/assets/UI/UI_Icon_Speak.png",
  iconStar: "public/assets/UI/UI_Icon_Star.png",
  iconStarEmpty: "public/assets/UI/UI_Icon_Star_Empty.png",
} as const;

export const SLIME_CARD_ASSET = "/assets/UI/UI_Slime_Card.png";
export const SLIME_CARD_FILE = "public/assets/UI/UI_Slime_Card.png";

export const HUD_ASSET_SIZES = {
  topLeft: { width: 243, height: 155 },
  topRight: { width: 730, height: 159 },
  topRightAnimation: { width: 795, height: 237 },
  icon: { width: 76, height: 75 },
  actionIcon: { width: 75, height: 75 },
  toolbar: { width: 626, height: 126 },
  toolbarSelected: { width: 71, height: 71 },
  sun: { width: 98, height: 94 },
  slimeCard: { width: 368, height: 586 },
  star: { width: 76, height: 75 },
} as const;

/** Cataloged for the Slime Card milestone. Do not wire these to the action toolbar. */
export const SLIME_CARD_ICON_ASSETS = {
  technique: HUD_ASSETS.iconTechnique,
  strength: HUD_ASSETS.iconStrength,
  instinct: HUD_ASSETS.iconInstinct,
  luck: HUD_ASSETS.iconLuck,
  speak: HUD_ASSETS.iconSpeak,
  star: HUD_ASSETS.iconStar,
  starEmpty: HUD_ASSETS.iconStarEmpty,
} as const;

export const SLIME_CARD_ICON_FILES = {
  technique: HUD_ASSET_FILES.iconTechnique,
  strength: HUD_ASSET_FILES.iconStrength,
  instinct: HUD_ASSET_FILES.iconInstinct,
  luck: HUD_ASSET_FILES.iconLuck,
  speak: HUD_ASSET_FILES.iconSpeak,
  star: HUD_ASSET_FILES.iconStar,
  starEmpty: HUD_ASSET_FILES.iconStarEmpty,
} as const;

export const SLIME_CARD_ATTRIBUTE_KEYS = ["technique", "strength", "instinct", "luck"] as const;
export type SlimeCardAttributeKey = (typeof SLIME_CARD_ATTRIBUTE_KEYS)[number];

export const ACTION_TOOLBAR_ICON_ASSETS = {
  planting: HUD_ASSETS.iconPlanting,
  woodCutting: HUD_ASSETS.iconWoodCutting,
  mining: HUD_ASSETS.iconMining,
  fishing: HUD_ASSETS.iconFishing,
  build: HUD_ASSETS.iconBuild,
} as const;

export const ACTION_TOOLBAR_ICON_FILES = {
  planting: HUD_ASSET_FILES.iconPlanting,
  woodCutting: HUD_ASSET_FILES.iconWoodCutting,
  mining: HUD_ASSET_FILES.iconMining,
  fishing: HUD_ASSET_FILES.iconFishing,
  build: HUD_ASSET_FILES.iconBuild,
} as const;

export const ACTION_TOOLBAR_ART_ASSETS = {
  toolbar: HUD_ASSETS.toolbar,
  selected: HUD_ASSETS.toolbarSelected,
} as const;

export const ACTION_TOOLBAR_ART_FILES = {
  toolbar: HUD_ASSET_FILES.toolbar,
  selected: HUD_ASSET_FILES.toolbarSelected,
} as const;

export const UNAVAILABLE_HUD_VALUE = "—";

export const TOP_RIGHT_COLLAPSE_FRAME_COUNT = 47;
export const TOP_RIGHT_EXPAND_FRAME_COUNT = 47;

function topRightSequenceName(stem: "Minimize" | "Return", index: number): string {
  return `UI_Animação_${stem}${index}.png`;
}

function topRightSequencePublicUrl(folder: "Foward" | "Backward", stem: "Minimize" | "Return", index: number): string {
  return encodeURI(`/assets/UI/Animations/${folder}/${topRightSequenceName(stem, index)}`);
}

function topRightSequenceFile(folder: "Foward" | "Backward", stem: "Minimize" | "Return", index: number): string {
  return `public/assets/UI/Animations/${folder}/${topRightSequenceName(stem, index)}`;
}

/** Minimize 1→47: collapse (opaque width shrinks). Files stay in authored `Foward/`. */
export const TOP_RIGHT_COLLAPSE_FRAMES = Array.from({ length: TOP_RIGHT_COLLAPSE_FRAME_COUNT }, (_, i) =>
  topRightSequencePublicUrl("Foward", "Minimize", i + 1),
);

/** Return 1→47: expand (opaque width grows). Files stay in authored `Backward/`. */
export const TOP_RIGHT_EXPAND_FRAMES = Array.from({ length: TOP_RIGHT_EXPAND_FRAME_COUNT }, (_, i) =>
  topRightSequencePublicUrl("Backward", "Return", i + 1),
);

export const TOP_RIGHT_COLLAPSE_STILL = topRightSequencePublicUrl(
  "Foward",
  "Minimize",
  TOP_RIGHT_COLLAPSE_FRAME_COUNT,
);

export const TOP_RIGHT_SEQUENCE_FILES = {
  collapse: Array.from({ length: TOP_RIGHT_COLLAPSE_FRAME_COUNT }, (_, i) =>
    topRightSequenceFile("Foward", "Minimize", i + 1),
  ),
  expand: Array.from({ length: TOP_RIGHT_EXPAND_FRAME_COUNT }, (_, i) =>
    topRightSequenceFile("Backward", "Return", i + 1),
  ),
} as const;

export const TOP_RIGHT_SEQUENCE_URLS = {
  collapse: TOP_RIGHT_COLLAPSE_FRAMES,
  expand: TOP_RIGHT_EXPAND_FRAMES,
} as const;

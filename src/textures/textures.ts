import { repeat } from '~/common/func'
import { Scene } from '~/common/types'

export const INF_TEXTURE_COUNT = 50

// unused right now
export const ANIMS_MAP = {
  PARACHUTING: 'PARACHUTING',
  PARACHUTE: 'PARACHUTE',
  PARACHUTE_BLOW: 'PARACHUTE_BLOW',
  PLR_RIP: 'PLR_RIP',
  BORDER_ANIM: 'BORDER_ANIM',
  BIRD_FLAPPING_1: 'BIRD_FLAPPING_1',

  // UI
  UI_GAME_BTN_START: 'UI_GAME_BTN_START',
  UI_GAME_BTN_CONTINUE: 'UI_GAME_BTN_CONTINUE',
}

export const TEXTURES_MAP = {
  CROSSHAIR: 'CROSSHAIR',
  SPACEBAR: 'SPACEBAR',
  BUG_BIG: 'BUG_BIG',
  BUG_SMALL: 'BUG_SMALL',
  CREATION_CIRCLE: 'CREATION_CIRCLE',
  EARTH: 'EARTH',
  BTN_BASE: 'BTN_BASE',
  BTN_UNSUMMON: 'BTN_UNSUMMON',
  //
  PLANE: 'PLANE',
  SKY_BACKGROUND: 'SKY_BACKGROUND',
  CLOUDS: 'CLOUDS',
  CRATE: 'CRATE',
  CRATE_WOOD: 'CRATE_WOOD',
  CRATE_IRON: 'CRATE_IRON',

  FLAG: 'FLAG',
  GROUND1: 'GROUND1',
  GROUND2: 'GROUND2',

  EJECT_AREA: 'EJECT_AREA',

  /////
  NO_TEXTURE: 'NO_TEXTURE',
  ELEM_ALL: 'ELEM_ALL',

  WEAP_BULLET_1: 'WEAP_BULLET_1',
  WEAP_SGM_BULLET_1: 'WEAP_SGM_BULLET_1',
  WEAP_PISTOL_1: 'WEAP_PISTOL_1',
  WEAP_SMG_1: 'WEAP_SMG_1',
  WEAP_EXCALIBUR_1: 'WEAP_EXCALIBUR_1',

  UI_GAME_BTN_START: 'UI_GAME_BTN_START',
  UI_GAME_BTN_CONTINUE: 'UI_GAME_BTN_CONTINUE',

  UI_GAME_BTN_SIMPLE_1: 'UI_GAME_BTN_SIMPLE_1',

  BIRD_SPAWNER_1: 'BIRD_SPAWNER_1',
  LOOT_BIRD_WING: 'LOOT_BIRD_WING',
  LOOT_FEATHER: 'LOOT_FEATHER',
  LOOT_FEATHER_GOLDEN: 'LOOT_FEATHER_GOLDEN',

  BG_HILLS_1: 'BG_HILLS_1',

  BIRD_FLAPPING: 'BIRD_FLAPPING',

  ELEM_PARACHUTE: 'ELEM_PARACHUTE',
  ELEM_PARACHUTE_BLOW: 'ELEM_PARACHUTE_BLOW',
  ELEM_PARACHUTER: 'ELEM_PARACHUTER',

  ELEM_BORDER: 'ELEM_BORDER',

  ELEM_PARACHUTER_RIPPED: 'ELEM_PARACHUTER_RIPPED',

  ELEM_WIN_BOTTOM_LINE: 'ELEM_WIN_BOTTOM_LINE',
  ELEM_SPIKE1: 'ELEM_SPIKE1',
}

/** For when individual files have their own textures */
// TODO: link all from here
export const TEXTURES_FILES_MAP = {
  // [TEXTURES_MAP.InfBg[1]]: 'gal/bg-1.avif',
  // TODO:UPDATE
  // [TEXTURES_MAP.InfBg2]: "nebulae_1.avif",
  // [TEXTURES_MAP.InfBg3]: "1pdn_2.avif",
  // [TEXTURES_MAP.InfBg4]: "sketch1633244048613_v1.avif",
  // [TEXTURES_MAP.InfBg5]: "sketch1633244048613_v2.avif",
  // [TEXTURES_MAP.InfBg6]: "sketch1633244048613_v3.avif",
  // [TEXTURES_MAP.InfBg7]: "sketch1633244048613_v4.avif",
  // [TEXTURES_MAP.InfBg8]: "sketch1633244048613_v5.avif",
  // [TEXTURES_MAP.InfBg9]: "sketch1633244048613_v6_alpha2.avif",
}

export const getTextureFilePath = (key: string) => TEXTURES_FILES_MAP[key]

export const TEXTURES_COLLIDE_ZONE = {
  Asteroid: 200,
}

export type TTextureKey = keyof typeof TEXTURES_MAP

export const textureIsLoaded = (scene: Scene, key: string) =>
  scene.textures.get(key) && scene.textures.get(key).key !== '__MISSING'

// export const addB64Txt = (scene: Scene, key: TTextureKey, data: any) => {
//   if (!textureIsLoaded(scene, key)) {
//     scene.textures.addBase64(key, data);
//   }
// };
export const getTxt = (scene: Scene, key: TTextureKey) => scene.textures.get(key).get(0)

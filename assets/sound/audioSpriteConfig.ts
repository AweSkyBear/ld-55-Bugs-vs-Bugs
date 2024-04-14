export type TAudioKey = 'lvlIntro1' | 'lvlIntro2' | 'lvlIntro3' | 'lvlIntro4' | 'lvlIntro5'

export const AUDIO_SPRITE_MAP: Record<TAudioKey, TAudioKey> = {
  lvlIntro1: 'lvlIntro1',
  lvlIntro2: 'lvlIntro2',
  lvlIntro3: 'lvlIntro3',
  lvlIntro4: 'lvlIntro4',
  lvlIntro5: 'lvlIntro5',
}

export default {
  // unused key
  resources: [],
  spritemap: {
    [AUDIO_SPRITE_MAP.lvlIntro1]: {
      start: 0,
      end: 10.85,
      loop: false,
    },
    [AUDIO_SPRITE_MAP.lvlIntro2]: {
      start: 10.85,
      end: 21.581,
      loop: false,
    },
    [AUDIO_SPRITE_MAP.lvlIntro3]: {
      start: 21.581,
      end: 35.81,
      loop: false,
    },
    [AUDIO_SPRITE_MAP.lvlIntro4]: {
      start: 35.81,
      end: 47.668,
      loop: false,
    },
    [AUDIO_SPRITE_MAP.lvlIntro5]: {
      start: 47.668,
      end: 59.368,
      loop: false,
    },
  },
}

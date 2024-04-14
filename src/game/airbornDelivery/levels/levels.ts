import { Point } from '~/common/types'
import { TEXTURES_MAP } from '~/textures/textures'

export type TLevelName = 'The First One' | 'The 2nd One!'

export type TLevel = typeof Levels[0]
export type TLevelGround = typeof Levels[0]['ground'][0]

const GROUND_W = 1100
const GROUND_H = 300

const lvl3Stairs: TLevel = {
  name: "The 3rd Maybe? It's like stairs!",
  ejectAreas: [
    {
      x: -500,
      y: -500,
      w: 1500,
      h: 1500,
    },
    {
      x: 200,
      y: 200,
      w: 1500,
      h: 1500,
    },
  ],
  ground: [
    {
      pos: {
        // relativeToWater: true, - by default
        x: -GROUND_W * 2 - 500,
        y: -GROUND_H * 5,
      },
      texture: TEXTURES_MAP.GROUND1,
      withFlag: false,
    },
    {
      pos: {
        // relativeToWater: true,
        x: -GROUND_W - 550,
        y: -GROUND_H * 4,
      },
      texture: TEXTURES_MAP.GROUND1,
      withFlag: true,
    },
    {
      pos: {
        // relativeToWater: true,
        x: 200,
        y: -GROUND_H * 3,
      },
      texture: TEXTURES_MAP.GROUND1,
      withFlag: false,
    },
    {
      pos: {
        // relativeToWater: true,
        x: GROUND_W + 550,
        y: -GROUND_H * 2,
      },
      texture: TEXTURES_MAP.GROUND1,
      withFlag: true,
    },
    {
      pos: {
        // relativeToWater: true,
        x: GROUND_W * 2 + 550,
        y: -GROUND_H * 1,
      },
      texture: TEXTURES_MAP.GROUND1,
      withFlag: false,
    },
    {
      pos: {
        // relativeToWater: true,
        x: GROUND_W * 3 + 550,
        y: -GROUND_H,
      },
      texture: TEXTURES_MAP.GROUND1,
      withFlag: false,
    },
    {
      pos: {
        // relativeToWater: true,
        x: GROUND_W * 4 + 550,
        y: 0,
      },
      texture: TEXTURES_MAP.GROUND1,
      withFlag: true,
    },
    {
      pos: {
        // relativeToWater: true,
        x: GROUND_W * 5 + 550,
        y: GROUND_H,
      },
      texture: TEXTURES_MAP.GROUND1,
      withFlag: false,
    },
  ],
}
const lvl4TinyStairs: TLevel = {
  ...lvl3Stairs,
  ejectAreas: [
    {
      x: -500 - 2000,
      y: -500 + 3000,
      w: 1000,
      h: 1000,
    },
    {
      x: 200 - 2000,
      y: 200 + 3000,
      w: 1000,
      h: 1000,
    },
  ],
  name: 'Tiny Stairs.. OOPS!' as any,
  ground: lvl3Stairs.ground.map((g) => ({
    ...g,
    texture: TEXTURES_MAP.GROUND2,
  })) as TLevel['ground'],
}

const _ejectAreasLvl1 = [
  {
    x: -1500 * 3,
    y: +1500 * 3,
    w: 1500,
    h: 1500,
  },
  {
    x: -1500 * 2,
    y: +1500 * 2,
    w: 1500,
    h: 1500,
  },
  {
    x: -1500 * 2,
    y: +1500,
    w: 1500,
    h: 1500,
  },
  {
    x: 200,
    y: 200,
    w: 1500,
    h: 1500,
  },
  {
    x: 200 + 1500,
    y: 200 + 1500,
    w: 1500,
    h: 1500,
  },
]

export const LEVEL_EDITOR_INDEX = -1
export const LevelEditor: typeof Levels[0] = {
  ground: [],
  ejectAreas: [],
  name: 'Level Editor',
}

export const Levels = [
  {
    name: 'The First One - should be easy',
    isFromEditor: false,
    ejectAreas: _ejectAreasLvl1,
    ground: [
      {
        pos: {
          // relativeToWater: true, - by default
          x: -GROUND_W * 2 - 500,
          y: 0,
        },
        angle: 0,
        texture: TEXTURES_MAP.GROUND1,
        withFlag: false,
      },
      {
        pos: {
          // relativeToWater: true,
          x: -GROUND_W - 550,
          y: 0,
        },
        texture: TEXTURES_MAP.GROUND1,
        withFlag: true,
      },
      {
        pos: {
          // relativeToWater: true,
          x: -200,
          y: 0,
        },
        texture: TEXTURES_MAP.GROUND1,
        withFlag: true,
      },
      {
        pos: {
          // relativeToWater: true,
          x: GROUND_W + 500,
          y: 0,
        },
        texture: TEXTURES_MAP.GROUND1,
        withFlag: true,
      },
      {
        pos: {
          // relativeToWater: true,
          x: GROUND_W * 2 + 550,
          y: 0,
        },
        texture: TEXTURES_MAP.GROUND1,
        withFlag: true,
      },
      {
        pos: {
          // relativeToWater: true,
          x: GROUND_W * 3 + 550,
          y: 0,
        },
        texture: TEXTURES_MAP.GROUND1,
        withFlag: true,
      },
      {
        pos: {
          // relativeToWater: true,
          x: GROUND_W * 4 + 550,
          y: 0,
        },
        texture: TEXTURES_MAP.GROUND1,
        withFlag: true,
      },
      {
        pos: {
          // relativeToWater: true,
          x: GROUND_W * 5 + 550,
          y: 0,
        },
        texture: TEXTURES_MAP.GROUND1,
        withFlag: true,
      },
    ],
  },
  // 2
  {
    name: 'The Second One',
    ejectAreas: [
      {
        x: 200,
        y: 200,
        w: 1500,
        h: 1500,
      },
    ],
    ground: [
      {
        pos: {
          // relativeToWater: true,
          x: GROUND_W * 4 + 550,
          y: -1000,
        },
        texture: TEXTURES_MAP.GROUND1,
        withFlag: false,
      },
      {
        pos: {
          // relativeToWater: true,
          x: GROUND_W * 5 + 550,
          y: -1000,
        },
        texture: TEXTURES_MAP.GROUND1,
        withFlag: true,
      },
    ],
  },
  lvl3Stairs,
  lvl4TinyStairs,
  {
    name: 'The High Pot...',
    ejectAreas: [
      {
        x: 200 - 2500,
        y: 200 - 500,
        w: 2000,
        h: 2000,
      },
    ],
    ground: [
      {
        pos: {
          // relativeToWater: true,
          x: GROUND_W - 600,
          y: -6000 - 500,
        },
        angle: 90,
        texture: TEXTURES_MAP.GROUND1,
        withFlag: false,
      },
      {
        pos: {
          // relativeToWater: true,
          x: GROUND_W,
          y: -6000,
        },
        texture: TEXTURES_MAP.GROUND1,
        withFlag: true,
      },
      {
        pos: {
          // relativeToWater: true,
          x: GROUND_W + 600,
          y: -6000 - 500,
        },
        angle: -90,
        texture: TEXTURES_MAP.GROUND1,
        withFlag: false,
      },
    ],
  },
  {
    name: 'The Small High Pot......',
    ejectAreas: [
      {
        x: 200 - 2000,
        y: 200,
        w: 1500 / 2,
        h: 1500 / 2,
      },
    ],
    ground: [
      {
        pos: {
          // relativeToWater: true,
          x: GROUND_W - 600,
          y: -6000 - 500,
        },
        angle: 90,
        texture: TEXTURES_MAP.GROUND2,
        withFlag: false,
      },
      {
        pos: {
          // relativeToWater: true,
          x: GROUND_W,
          y: -6000,
        },
        texture: TEXTURES_MAP.GROUND2,
        withFlag: true,
      },
      {
        pos: {
          // relativeToWater: true,
          x: GROUND_W + 600,
          y: -6000 - 500,
        },
        angle: -90,
        texture: TEXTURES_MAP.GROUND2,
        withFlag: false,
      },
    ],
  },
  {
    name: 'The High HIGH throw Pot......',
    ejectAreas: [
      {
        x: 200 - 2500,
        y: 200 - 3500,
        w: 2000,
        h: 2000,
      },
    ],
    ground: [
      {
        pos: {
          // relativeToWater: true,
          x: GROUND_W - 600,
          y: -6000 - 500,
        },
        angle: 90,
        texture: TEXTURES_MAP.GROUND1,
        withFlag: false,
      },
      {
        pos: {
          // relativeToWater: true,
          x: GROUND_W,
          y: -6000,
        },
        texture: TEXTURES_MAP.GROUND1,
        withFlag: true,
      },
      {
        pos: {
          // relativeToWater: true,
          x: GROUND_W + 600,
          y: -6000 - 500,
        },
        angle: -90,
        texture: TEXTURES_MAP.GROUND1,
        withFlag: false,
      },
    ],
  },
  {
    name: 'The Smaaaall Tiny Tilted High Pot......',
    ejectAreas: [
      {
        x: 200 - 1500,
        y: 200,
        w: 1500 / 3,
        h: 1500 / 3,
      },
      {
        x: 200 - 3000 + 400,
        y: 200,
        w: 1500 / 3,
        h: 1500 / 3,
      },
    ],
    ground: [
      {
        pos: {
          // relativeToWater: true,
          x: GROUND_W - 600,
          y: -6000 - 500,
        },
        angle: 90,
        texture: TEXTURES_MAP.GROUND2,
        withFlag: false,
      },
      {
        pos: {
          // relativeToWater: true,
          x: GROUND_W + 300,
          y: -6000 - 200,
        },
        angle: -30,
        texture: TEXTURES_MAP.GROUND2,
        withFlag: true,
      },
      {
        pos: {
          // relativeToWater: true,
          x: GROUND_W + 600,
          y: -6000 - 500,
        },
        angle: -90,
        texture: TEXTURES_MAP.GROUND2,
        withFlag: false,
      },
    ],
  },
  {
    name: 'The Precision Small High Pot..',
    ejectAreas: [
      {
        x: -1900,
        y: -2400,
        w: 1500 / 3,
        h: 1500 / 3,
      },
    ],
    ground: [
      {
        pos: {
          // relativeToWater: true,
          x: GROUND_W - 200,
          y: -6000 - 500,
        },
        angle: 90,
        texture: TEXTURES_MAP.GROUND2,
        withFlag: false,
      },
      {
        pos: {
          // relativeToWater: true,
          x: GROUND_W,
          y: -6000 - 200,
        },
        texture: TEXTURES_MAP.GROUND2,
        withFlag: true,
      },
      {
        pos: {
          // relativeToWater: true,
          x: GROUND_W + 200,
          y: -6000 - 500,
        },
        angle: -90,
        texture: TEXTURES_MAP.GROUND2,
        withFlag: false,
      },
    ],
  },
  {
    name: 'The Ultra Precision Small High Pot.. !',
    ejectAreas: [
      {
        x: -1900,
        y: -2400,
        w: 1500 / 5,
        h: 1500 / 5,
      },
    ],
    ground: [
      {
        pos: {
          // relativeToWater: true,
          x: GROUND_W - 200,
          y: -6000 - 500,
        },
        angle: 90,
        texture: TEXTURES_MAP.GROUND2,
        withFlag: false,
      },
      {
        pos: {
          // relativeToWater: true,
          x: GROUND_W,
          y: -6000 - 200,
        },
        texture: TEXTURES_MAP.GROUND2,
        withFlag: true,
      },
      {
        pos: {
          // relativeToWater: true,
          x: GROUND_W + 200,
          y: -6000 - 500,
        },
        angle: -90,
        texture: TEXTURES_MAP.GROUND2,
        withFlag: false,
      },
    ],
  },
  {
    name: 'The Ultra Precision Small High Pot With a Tiny Eject Area.. !',
    ejectAreas: [
      {
        x: -1900,
        y: -2400,
        w: 50,
        h: 50,
      },
    ],
    ground: [
      {
        pos: {
          // relativeToWater: true,
          x: GROUND_W - 200,
          y: -6000 - 500,
        },
        angle: 90,
        texture: TEXTURES_MAP.GROUND2,
        withFlag: false,
      },
      {
        pos: {
          // relativeToWater: true,
          x: GROUND_W,
          y: -6000 - 200,
        },
        texture: TEXTURES_MAP.GROUND2,
        withFlag: true,
      },
      {
        pos: {
          // relativeToWater: true,
          x: GROUND_W + 200,
          y: -6000 - 500,
        },
        angle: -90,
        texture: TEXTURES_MAP.GROUND2,
        withFlag: false,
      },
    ],
  },
  // 12
  {
    name: 'The Great Throw !',
    ejectAreas: [
      {
        x: 200 - 4000,
        y: 200,
        w: 1500 / 1.5,
        h: 1500 / 1.5,
      },
    ],
    ground: [
      {
        pos: {
          // relativeToWater: true,
          x: GROUND_W * 4 + 550,
          y: -1000,
        },
        texture: TEXTURES_MAP.GROUND1,
        withFlag: false,
      },
      {
        pos: {
          // relativeToWater: true,
          x: GROUND_W * 5 + 550,
          y: -1000,
        },
        texture: TEXTURES_MAP.GROUND1,
        withFlag: true,
      },
    ],
  },
  // 13
  {
    name: 'Editor Level',
    isFromEditor: true,
    ground: [
      {
        x: -1941,
        y: 1084,
        angle: -17,
        texture: 'GROUND2',
        withFlag: false,
        pos: {
          x: -1941,
          y: 1084,
        },
      },
      {
        x: -1610,
        y: 1035,
        angle: 0,
        texture: 'GROUND2',
        withFlag: true,
        pos: {
          x: -1610,
          y: 1035,
        },
      },
    ],
    ejectAreas: [
      {
        x: -2695,
        y: 1075,
        angle: 0,
        texture: 'GROUND1',
        withFlag: false,
        w: 582,
        h: 396,
      },
    ],
  },
  // 14
  // {
  //   name: 'Editor Level 2',
  //   isFromEditor: true,
  //   ground: [
  //     {
  //       x: -3484,
  //       y: 1123,
  //       angle: 20,
  //       texture: 'GROUND2',
  //       withFlag: true,
  //       w: 800,
  //       h: 800,
  //       pos: {
  //         x: -3484,
  //         y: 1123,
  //       },
  //     },
  //     {
  //       x: -1773,
  //       y: 1230,
  //       angle: 0,
  //       texture: 'GROUND1',
  //       withFlag: true,
  //       pos: {
  //         x: -1773,
  //         y: 1230,
  //       },
  //     },
  //     {
  //       x: -2022,
  //       y: 1212,
  //       angle: 0,
  //       texture: 'GROUND2',
  //       withFlag: true,
  //       pos: {
  //         x: -2022,
  //         y: 1212,
  //       },
  //     },
  //     {
  //       x: -3193,
  //       y: 607,
  //       angle: 0,
  //       texture: 'GROUND2',
  //       withFlag: false,
  //       pos: {
  //         x: -3193,
  //         y: 607,
  //       },
  //     },
  //   ],
  //   ejectAreas: [
  //     {
  //       x: -1885,
  //       y: 1567,
  //       angle: 0,
  //       texture: 'GROUND1',
  //       withFlag: false,
  //       w: 800,
  //       h: 800,
  //     },
  //     {
  //       x: -2776,
  //       y: 631,
  //       w: 300,
  //       h: 300,
  //       angle: 0,
  //     },
  //   ],
  // },
  // {
  //   name: 'Editor Level 4',
  //   isFromEditor: true,
  //   ground: [
  //     {
  //       x: -3570,
  //       y: 893,
  //       angle: -47,
  //       texture: 'GROUND1',
  //       withFlag: false,
  //       pos: {
  //         x: -3570,
  //         y: 893,
  //       },
  //     },
  //     {
  //       x: -2374,
  //       y: 1416,
  //       angle: 9,
  //       texture: 'GROUND2',
  //       withFlag: true,
  //       pos: {
  //         x: -2374,
  //         y: 1416,
  //       },
  //     },
  //     {
  //       x: -2136,
  //       y: 1269,
  //       angle: -85,
  //       texture: 'GROUND2',
  //       withFlag: true,
  //       pos: {
  //         x: -2136,
  //         y: 1269,
  //       },
  //     },
  //   ],
  //   ejectAreas: [
  //     {
  //       x: -3021,
  //       y: 1157,
  //       w: 636,
  //       h: 597,
  //       angle: -24,
  //     },
  //   ],
  // },
  {
    name: 'Editor Level 4',
    isFromEditor: true,
    ground: [
      {
        x: -2398,
        y: 476,
        angle: 0,
        texture: 'GROUND1',
        withFlag: true,
        pos: {
          x: -2398,
          y: 476,
        },
      },
      {
        x: -2844,
        y: 1382,
        angle: 0,
        texture: 'GROUND1',
        withFlag: false,
        pos: {
          x: -2844,
          y: 1382,
        },
      },
      {
        x: -3448,
        y: 1144,
        angle: 90,
        texture: 'GROUND2',
        withFlag: false,
        pos: {
          x: -3448,
          y: 1144,
        },
      },
      {
        x: -2230,
        y: 1207,
        angle: -90,
        texture: 'GROUND2',
        withFlag: true,
        pos: {
          x: -2230,
          y: 1207,
        },
      },
      {
        x: -3724,
        y: 529,
        angle: -180,
        texture: 'GROUND2',
        withFlag: false,
        pos: {
          x: -3724,
          y: 529,
        },
      },
      {
        x: -3479,
        y: 1493,
        angle: 45,
        texture: 'GROUND1',
        withFlag: false,
        pos: {
          x: -3479,
          y: 1493,
        },
      },
    ],
    ejectAreas: [
      {
        x: -2863,
        y: 849,
        w: 1300,
        h: 1300,
        angle: 0,
      },
      {
        x: -3612,
        y: 822,
        angle: 0,
        texture: 'GROUND1',
        withFlag: false,
        w: 200,
        h: 200,
      },
    ],
  },
] as {
  name: string // TLevelName
  isFromEditor?: false
  ejectAreas: {
    x: number
    y: number
    w: number
    h: number
    angle?: number
  }[]
  ground: {
    angle?: number
    withFlag?: boolean
    texture: string /* keyof typeof TEXTURES_MAP */
    pos: Point
  }[]
}[]

export const getLevelCount = () => Levels.length

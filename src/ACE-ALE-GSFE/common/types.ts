export type TCanvasMarker = Phaser.GameObjects.Arc

export type Predicate<T> = Func<T, boolean>

export type Func<T, U> = (x?: T) => U

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

export type Point = {
  x: number
  y: number
}

// #PhaserDep
export type GameObject = Phaser.GameObjects.GameObject

export type Scene = Phaser.Scene

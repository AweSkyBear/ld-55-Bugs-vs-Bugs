import { TEXTURES_MAP } from '~/textures/textures'
import { IMatterImageFixed, IMatterSpriteFixed } from './matter'
import { getRelativeScale } from './screen'
import { Func, MatterSprite, Scene } from './types'

export const createNoTxtImage = ({ scene }: { scene: Scene }) => {
  const img = scene.matter.add.image(0, 0, TEXTURES_MAP.NO_TEXTURE).setScale(getRelativeScale())
  return (img as any) as IMatterImageFixed
}

export const createImage = ({ scene, texture }: { scene: Scene; texture: string }) => {
  const img = scene.add.image(0, 0, texture).setScale(getRelativeScale())
  // .setTint(0xb61d00)
  // .setData('id', index)
  // .setInteractive()

  return img
}
export const createMatterImage = ({ scene, texture }: { scene: Scene; texture: string }) => {
  const img = scene.matter.add.image(0, 0, texture).setScale(getRelativeScale())
  // .setTint(0xb61d00)
  // .setData('id', index)
  // .setInteractive()

  return (img as any) as IMatterImageFixed
}

export const createStaticSprite = ({
  scene,
  texture,
  anim,
}: {
  scene: Scene
  texture?: string
  anim?: string
  bodyConfig?: Phaser.Types.Physics.Matter.MatterBodyConfig
}) => {
  const spr = scene.add.sprite(0, 0, texture, undefined).setScale(getRelativeScale())
  anim && spr.play(anim)
  return (spr as any) as IMatterSpriteFixed
}

export const createSprite = ({
  scene,
  texture = TEXTURES_MAP.NO_TEXTURE,
  bodyConfig,
  anim,
}: {
  scene: Scene
  texture?: string
  bodyConfig?: Phaser.Types.Physics.Matter.MatterBodyConfig
  anim?: string
}) => {
  const spr = scene.matter.add
    .sprite(0, 0, texture, undefined, bodyConfig)
    .setScale(getRelativeScale())
  // const spr = scene.add.sprite(0, 0, texture).setScale(getRelativeScale())
  anim && spr.play(anim)
  return (spr as any) as IMatterSpriteFixed
}

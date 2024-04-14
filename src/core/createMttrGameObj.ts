import { merge } from '~/common/func'
import { createMatterImage, createSprite } from '~/common/image'
import { IMatterImageFixed, IMatterObj, IMatterSpriteFixed } from '~/common/matter'
import { DEFAULT_PHYS_PROPS, TPhysicsProps } from './matterObj'
import { getRelativeScale } from '~/common/screen'
import { Point, Scene } from '~/common/types'
import { ObservableScenes } from '~/scenes/BaseObservableScene'

export const createMttrGameObj = <T extends IMatterSpriteFixed | IMatterImageFixed>(opts: {
  scene?: Scene
  /** Important - play animations with */
  isSprite?: boolean
  isCircle?: boolean
  anim?: string
  texture?: string
  pos?: Point
  name: string
  physicsProps?: TPhysicsProps
}) => {
  const physicsProps: TPhysicsProps = merge({ ...DEFAULT_PHYS_PROPS }, opts.physicsProps || {})

  const pos = opts.pos
  const obj = (opts.isSprite ? createSprite : createMatterImage)({
    scene: opts.scene || ObservableScenes.game,
    texture: opts.texture,
  })

  if (opts.isCircle) {
    obj.setBody(
      { type: 'circle', addToWorld: true, radius: physicsProps.radius },
      { label: opts.name }
    )
  }

  if (physicsProps.rectangleSize) {
    obj.setBody({ ...physicsProps.rectangleSize })
  }

  obj
    .setName(opts.name)
    // .setFrictionStatic(physicsProps.friction)
    .setInteractive()
    .setMass(1 / physicsProps.gravity) // HIGHER mass - even funnier bouncing
    // note: very LOW - lunar effect on touch
    .setAlpha(1)
    .setScale(getRelativeScale(physicsProps.scale))
    .setIgnoreGravity(physicsProps.ignoreGravity)
    .setFrictionAir(physicsProps.frictionAir)
    .setFrictionStatic(physicsProps.frictionStatic)
    .setBounce(physicsProps.bounce)
  // TODO: apply HAGObjectProps.baseProps.hp / rest...

  obj.body.velocity.x = 0
  obj.body.velocity.y = 0
  obj.body.gameObject.label = opts.name
  ;(obj.body as any).label = opts.name
  ;(obj.body as any).slop = 1 // this behaves better than the default 0.05? -> it is faster?

  if (opts.isSprite && opts.anim) {
    ;(obj as IMatterSpriteFixed).play(opts.anim)
  }
  if (opts.pos) obj.setPosition(pos.x, pos.y)

  return obj as T
}

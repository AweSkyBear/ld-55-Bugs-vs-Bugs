import { GameObject } from './types'

export const sendToTop = (child: GameObject) =>
  child.scene && child.scene.children.bringToTop(child)
export const sendToTopInOrder = (sceneChildren: GameObject[]) =>
  // reverse(sceneChildren).
  sceneChildren.forEach((child) => child.scene.children.bringToTop(child))

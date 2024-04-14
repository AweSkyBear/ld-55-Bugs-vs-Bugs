import { DPR, getGameCanvas, getRelativeScale } from "./screen";
import { Scene } from "./types";

export const createTiledBg = (scene: Scene, txtKey: string, doNotTile: boolean = false) => {
  const canv = getGameCanvas()
  const CANVAS_WIDTH = canv.width
  const CANVAS_HEIGHT = canv.height

  const backgroundW = scene.textures.get(txtKey).get(0).width
  const backgroundH = scene.textures.get(txtKey).get(0).height

  // TODO: take into account scaling
  // TODO: take into account scroll factor : setScrollFactor
  
  const repeatTimesX = 
    doNotTile ? 1 : parseInt(((CANVAS_WIDTH + backgroundW) / backgroundW).toFixed(0))
  const repeatTimesY = 
    doNotTile ? 1 : parseInt(((CANVAS_HEIGHT + backgroundH) / backgroundH).toFixed(0))

  const cam = scene.cameras.main

  const background = scene.add.tileSprite(cam.scrollX, cam.scrollY, null, null, txtKey)
    .setScale(getRelativeScale(1))
    .setSize(backgroundW * repeatTimesX * DPR, backgroundH * repeatTimesY * DPR)

  return {
    background,
    txtKey
  }
}
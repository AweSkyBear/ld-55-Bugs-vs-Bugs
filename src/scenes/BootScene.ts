import crosshairImg from '../LD55/assets/crosshair-6.png'
import spacebarImg from '../LD55/assets/spacebar.png'
import bugBig from '../LD55/assets/space-bug.png'
import bugSmall from '../LD55/assets/bug-small-sm.png'
import spawnCircle from '../LD55/assets/spawn-circle.avif'
import earth from '../LD55/assets/earth-sm.avif'

import btnBase from '../LD55/assets/bonus-button.png'
import btnUnsummon from '../LD55/assets/bonus-unsummon-sm.png'
import btnBonusUnsummon from '../LD55/assets/bonus-unsummon-sm.png'
import btnBonusDecoy from '../LD55/assets/bonus-decoy-sm.png'
import btnBonusShwockwave from '../LD55/assets/bonus-shockwave-sm.png'

import bgNoTexture from '../../assets/no-texture.png'

//////// AUDIO

// import b64SoundTrackLvlIntro from '../../assets/sound/2022.02.13-21.28.32-PM-8-4-lvlIntro.mp3'
// import b64SoundTrackLvlTheme1 from '../../assets/sound/2022.02.13-21.31.12-PM-8-1-lvlTheme.mp3'

import { SCENE_KEY, BOOT_SCENE_KEY } from '~/common/scene'
import { TEXTURES_MAP } from '~/textures/textures'
import { startScene } from './common'
import { exposeToWindow } from '~/common/debug'
import { Scene } from '~/common/types'
import Game from '~/LD55/GameScene'

/** Use to load assets (and to start the actual game and other scenes) */
export const BootScene = new (Phaser as any).Class({
  Extends: Phaser.Scene,

  initialize: function BootScene() {
    Phaser.Scene.call(this, { key: BOOT_SCENE_KEY, active: true })
  },

  preload: async function () {
    const scene = this as Scene

    scene.load.image(TEXTURES_MAP.CROSSHAIR, crosshairImg)
    scene.load.image(TEXTURES_MAP.SPACEBAR, spacebarImg)
    scene.load.image(TEXTURES_MAP.BUG_BIG, bugBig)
    scene.load.image(TEXTURES_MAP.BUG_SMALL, bugSmall)
    scene.load.image(TEXTURES_MAP.CREATION_CIRCLE, spawnCircle)
    scene.load.image(TEXTURES_MAP.EARTH, earth)
    scene.load.image(TEXTURES_MAP.BTN_UNSUMMON, btnUnsummon)
    scene.load.image(TEXTURES_MAP.BTN_BASE, btnBase)
    // scene.load.image(TEXTURES_MAP.PLANE, planeImg)
    // scene.load.image(TEXTURES_MAP.SKY_BACKGROUND, skyBgImg)
    // scene.load.image(TEXTURES_MAP.CLOUDS, cloudsImg)
    // scene.load.image(TEXTURES_MAP.CRATE, crateImg)

    // scene.load.image(TEXTURES_MAP.FLAG, flagImg)
    // scene.load.image(TEXTURES_MAP.GROUND1, ground1Img)
    // scene.load.image(TEXTURES_MAP.GROUND2, ground2Img)

    // scene.load.image(TEXTURES_MAP.EJECT_AREA, ejectAreaImg)

    scene.load.image(TEXTURES_MAP.NO_TEXTURE, bgNoTexture)
  },

  // AFTER EVERYTHING HAS PRELOADED :::
  create: async function () {
    ////// START SCENES + some wiring
    const sceneBackground = startScene(this.game, SCENE_KEY.BACKGROUND_SCENE as any)
    const sceneForeground = startScene(this.game, SCENE_KEY.FOREGROUND_SCENE as any)
    // sceneBackgroundScroller.scene.bringToTop('BackgroundScene')
    // const sceneStarGravityGame = startScene(this.game, 'STAR_GRAVITY_GAME')

    exposeToWindow({
      sceneBackground,
      sceneForeground,
    })

    /// ADD THE GAME SCENE
    const GAME_SCENE_KEY = SCENE_KEY.GAME_SCENE
    const SCENE_CLASS = Game

    // adds and starts the game
    this.game.scene.add(GAME_SCENE_KEY, SCENE_CLASS, true, {})
  },
})

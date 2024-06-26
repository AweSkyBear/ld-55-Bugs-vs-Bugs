import { Global } from '~/LD55/global/global'
import { ObsDispCreate, IEvent, obsDispCreator, obsDispEvents, ODAPI } from '../OD'
import { Howl, HowlOptions } from 'howler'
import { fadeOut } from './camera'
import { exposeToWindow } from './debug'

export const createSoundFX = obsDispCreator(
  () => {
    type TMP3Sound = 'main'

    const state = {
      muted: false,

      mp3SoundPaths: { main: '/music/cosmic-wow.mp3' } as Record<TMP3Sound, string>,
      mp3Sounds: { levelPass: null as Howl } as Record<string, Howl>,
    }

    // const playSoundFX = (s: Parameters<typeof playSound>[0]) => (_: IEvent) =>
    //   !state.muted && playSound(s)

    const playMp3Sound = (snd: TMP3Sound, opts?: Partial<HowlOptions>) => {
      if (state.muted) return

      if (!state.mp3Sounds[snd]) {
        // load it / create it
        state.mp3Sounds[snd] = new Howl({
          src: state.mp3SoundPaths[snd],
          ...opts,
        })
      }

      state.mp3Sounds[snd].play()

      return state.mp3Sounds[snd]
    }
    Global.playMp3Sound = playMp3Sound

    return {
      [obsDispEvents.OBS_CREATE]: ObsDispCreate.useObs((obs) => {
        let repeatInd = 0
        const rates = [1, 0.8, 0.9, 0.75, 1, 0.5]

        const snd = playMp3Sound('main', {
          loop: true,
          onend: () => {
            repeatInd = (repeatInd + 1) % rates.length === 0 ? 0 : repeatInd + 1
            snd.rate(rates[repeatInd] || 1)
          },
        })

        exposeToWindow({ snd })
      }),
      // SOUND_TOGGLE: () => (state.muted = !state.muted),
      // PORTAL_ENTERED: playSoundFX('portalEntered'),
      // LEVEL_REQUEST_START_NEXT: () => playMp3Sound('levelPass'),
      // LEVEL_STARTED: playSoundFX('startLevel'),
      // PLAYER_REPOSITION: playSoundFX('playerStep'),
      // FOE_HIT_BY_PLAYER: playSoundFX('explosion2'),
      // PLAYER_HIT_BY_FOE: playSoundFX('explosion'),
      // FRUIT_COLLECTED: playSoundFX('collect2'),
      // PLAYER_ACTION_ATTACK: playSoundFX('actionAttack'),
      // LEVEL6_THIRD_EYE_TAKEN: playSoundFX('collect'),
      // LEVEL5_GAME_RESET_FULL: playSoundFX('funnyGhost'),
      // LEVEL5_GAME_WON: playSoundFX('diamondPickup'),
      // GAME_WON: playSoundFX('diamondPickup'),
      [obsDispEvents.OBS_REMOVE]: () => {
        Object.values(state.mp3Sounds).forEach((s) => s?.unload())
      },
    }
  },
  { id: 'sound-fx' }
)

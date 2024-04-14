// import './../jsfxr/riffwave.js'
// import './../jsfxr/sfxr.js'
// const sfxr = require("jsfxr").sfxr;
import { sfxr } from 'jsfxr'

exposeToWindow({ sfxr })

import { take } from 'ramda'
import toArrayBuffer from 'to-array-buffer'
import { debugLog, debugWarn, exposeToWindow } from '~/common/debug'
import { waitMs } from '~/common/func'
import { Scene } from '~/common/types'

export const soundConfigs = {
  shootBulletV1_1:
    '1ZM7A8r3ViuMficyti7TW87rZokzdtkutGG8muMPoMyNjPjeK1TnT4mKcQQArKPm8DrCd8qkkThDeUKR9SDEDUuMXmutS3utXVF4Y6AbQP58yNt73EbQYBa4B',
  shootBulletV1_2:
    '12U5xWooi1xx8PctUoPDJNKZWuWzBiL57Kvhnyh6XgVexLwZwiHvgjJ2sxgxNfP8SWArv1X97gkjD3xLhq1bkgXGbVkQM3JhsC9eEXmZNi5Br9KpJ4wbcYsovc',
  shootBulletV1_3:
    '131eim9wyeNteEqisCXvWE9SNoYGRvRSNqgLPiYQX95oDXYkgQGds9A4yUUGvHFjNTTiTQBL6U2yE6ujKNRBzs2p752nVsjL9kVwH8XAjCRxJAdc6rmeBN85rk ',
  shootBulletV2_1:
    '6az9JKEvtHQqJFwe99XASd3AkM6uvnJd4RqFWQurMBWVxQhf1xFgxrjU7Nqxq9kFgac7Gr1fFMcjgWZHFt6SWKw3MzgCHpoyrYJKcCh7nS6kv1bLkRkWRLgqA',
  shootBulletV2_2:
    '6hztd4cs1aVxDDK5a1kaFcQwNRx4X88qjjKHZ3ipRm71R64zEZhrv2ZAsRs72yN45jymbpvFP5PoaciUNq9gBEFwg2RKLvf4k9L7zDDhEuVWEmmzQWFuF32bv',
  shootBulletV2_3:
    '6hztd4cs1aVxDDK5a1kaFcQwNRx4X88qjobMcTCcsLuQc2amCSy55XYcvuHuToc8n7gVpVmGzJCwDU55ZvMqoxk3f6t8jQUJF5HcB6ceZN7dPstuGhLEHv1t8',
  ufoLoad1:
    '54dqZYTzRkgcBzEMH5dm5F2Q9TEwpHjwRgXCT128NKSPpi8z7Gvqy97VSHbhMLeKPSeQR52Re9WaJ2Nrj4Mi9DXfsq9YS8rCh9HkeBJSncPWCCYe3EeBMGY4W',
  loadLazerWeapon:
    '54dqZYTzRkgcBzEMH5dm5F2Q9TEwpHjwRgXCT128NKSPpi8z7Gvqy97VSHbhMLeKPSeQR52Re9WaHwxhXVw4MdrC3wkhphBEztW2VqR5gV3yKj48Sf7GxuH5g',
  lazerShoot1:
    '7BMHBGPsaXrCFw6aDdveLTUi2ZE8uj8NAegReJzn2fx9XUDg7Dn1ofbPhZiU2j7uJuhw8ioPQsEzkYMzTLEK8avMLD95YNayTNnd51sWew75PMD3TmqT6okvs',
  boomerang:
    '1HGKtSRDdmGnv3LPGpMpwGnGcvh1dmEdzVJ3UKmpdqEioxTVEnpez28pKbFcte4y7MKW3maRtny5gbMba321zobo7SoxZ28kHitzt8vXxz1fKhigBZC2RbJKM',
  chopper1:
    '12193yApHEM1y8CqD1QkcMxVRk3bReLmrZ5AhagDqbHfdJXhYipe59vEfmQyac5onA18J89hn9QDsTCXEvCEGGXhpi1rS85KZPiZ5MgeWZ9FW9n5oM91k9Z2dK',
  chopperSlowing:
    '1BU9WVFR2kCiQctVmpEX7MvTwjrWeW6BgHdFyHvzFkNk3aNoc9z8cDc9pFX5gXS6Jt9tWemD3fWwt9Nz9YGNqw9CSvUzvEwChnWZPNLRg5rtS1Tzhstmb3Xg1',
  longRocketFlight:
    '8YiPCVXK45arABDDs63CQJtGkSMuYTtrethzTahGP6L5TqjY3YNgScyUcr2zZAFbGYEEGGiD2qZ9tCciQKPZdzHU64e1gYedRKzBpmdHMz5oNMuh3yvVPAN6Z',
  toonyLaughter:
    '6VGHojohcvMVhrgeCCtGNA9Sq2JYSEn6ne9GCDnc3kQJf7AgPiDBKqdBYW6CUGwggLMddcGwFY7PZvWRgt9Dj5xF9wW64Hba68f9HZ4QpodLz22AiEr3SvveH',
  toonyTrampolineJump:
    '111119qtbtbiDaPJAn5p5FwxthxLNF21Q11zU53sGEao5RYu2hd2TskY7yVyVovm1yNtekYkbmDTi5ce6UgsWCvSgbKJkH48xrpD4FgnrDyEAVv2JzrM8LMM',
  ufoRebounce:
    '57uBnWb4kvMJcrdYdw5wtNjboipgYpUXju8UXBtNXx68QYZGCh2dG2aLgos69GRjwRia9yd6KCek6GJC4xyNhJsNJvsAZGPAoMWuHVPRsD8szrGxho9kDbDF',
  toonyDiving:
    '57uBnWb4kvMJcrdYdw5wtNjboipgYpUXju8UXBtNXx68QYZGCh2dG2aLgos69GRjwRia9yd6KCek6HmUbfjtnZR5dmPNJ4v4xV2DVC8G17fT8CB2ybQxNaevs',
  poppingUpOutOfNowhere1:
    '57uBnWb4kvMJcrdYdw5wtNjboipgYpUXju8UXBtNXx68QYZGCh2dG2aLgos69GRjwRia9yd6KCek6FdmuaVidX85gCTCtXPpFPH7gbsfkfpzPjXZ2i9XntX8j',
  poppingUpOutOfNowhere2:
    '57uBnWb4kvMJcrdYdw5wtNjboipgYpUXju8UXBtNXx68QYZGCh2dG2aLgos69GRjwRia9yd6KCek6FLrAj5CQd9Xy29nK3Nhv6Z9SfmAS8rrTgy5XAKDd7HmR',
  poppingUpOutOFNowhere3Quick:
    '5vfkRjysnPva77Vu3v597ywzBCJP2t8sHb1GixTY2ncwxCFCut6WzLG1sGtr5juTerf3Dzj3fdcaL2qvyDd3sAeFoj5F4vpJQSg6HZN6TXpFfGnXsvM6tfRgB',
  shortRocketLaunch:
    '88cALu9nZjbXbtCwg3VgqcB9GW4pXPe7sK2X6Kr8bTxGuct3HxyandwuqzuXpkyq36WA3zM15jMEi5bJynB6Mv3voJNk9mskVKQnrDH5cvbfJbTcEk5LDbo2S',
  shortBurningLazer:
    '5URhKYk1LuwLHN4WWx9oCoAhesNqQvfGpzXC9QSrDenkYWWu8UY8FeeqkvcJFssvKTSPBkpCGmSmfvn39iopCBQRfXNb3a9bQUbF5X5FqBGBwiNR5gg7MbB4N',
  classicPowerup:
    '6rQqme25HxF2SkQuhfXJ3BEZRKWcssE8B7pEnnJC9JwT4Tij94r74Uzx7cxvnqRDpFXZtNuPsubBxp9fG8mtSccHLsPTBdTzaqpeiLc4P5ppTWwbVzTGei5Rd',
  retroHugeExplosion:
    '8MEfjtzmXGByXbNe2SsK6Kq2su4fu2RpdSuaTtqsGjuC3QjM6ZR6GPKjiNSDLTSiEpXUJYKNESpWV6m8DgBEEiWT8hG3oeU2W9wqNYorcaekRQwZ56siLHEW9',
  waterfall:
    '7BMHBG9qJwvAHMDahYJQDKxCGAStYNvnZkGHYuBh792W3nMW8ykWqDshCGEZnB2gGUYwN9WQipBkXdjCYZfaWEFbRFw6rBNyBSUGcTbTaXsfibx7MDHv7qbFD',
  waterfallDistantLong:
    '7BMHBG9qJiLBr1SMLuRjP1BWvRpRmm8rAu1yBqvAHMTrbshafCjryGrLX7Kx4jMnqcTPFeFVPfmdw3H3EdiegjFJrqecFQesqpZNDSQubXD2CR5kxCLH7pbw5',
  //https://sfxr.me/#5fhKMSDou5KBBwWJY7VWNrSv9hqoQwjwVKtK2b3Kr6jQ5HLgsrWq1DGNN4tc6bEz6CRXiy3RBYVY4PujuPNowbSNpp2pBiDfdwcXkYQ5BNsxYyqZoFAU8VJNe
  ////////////////////////////
  addGoldBar1:
    '34T6PktYrJjA7BfJPrM4VzwVeZFC1gzX2N1NLDQLjTZubmiU7sXNifmccngDDCKzoWh8s6au5MZ95mxvN1g66FYhUDVfU7vGkWVPKxpPHhgkNKxZQg2KjeHiF',
  addGoldBar2:
    '34T6PktYrJjA7BfJPrM4VzyqmpRpCyUAAgfPPvBiqrrpSKmUyk36krpfFLc7Q2F3m6MZwP6hJhaHVppcxv3nznFLzguQdt5a4FdiJdWnAAToGaEkgAQGjw2UF',
  addGoldBar3:
    '3ndM6oBqNfo3CzTAAqrTWvP7Bt6sBhvDVcus4JNzBhQ3z8FVvKaaXauRDHh8GFpzJVU8LSqePCfB1MdKuPQfjTebrHagFdSxzj1oqbWCWLzjPjQkUXFmzmMD9',
  goldShort:
    '3ndM6oBqNfo3CzTAAqrTWvQo8YZgCsxZL5LRFBZR1BM9pPmsMDBE2G46DEooEYwrbfsnirTArzaoUnficy9F6MNHyHwkiQTpDCUc6cPQogbC4noMGQdYgMoEf',
  goldLong:
    '4TmYwEycXkuLpmJCZS3JymS6oFxS8GBuDfSdzQi1hwLEg53C9fpUP53mZzjNTf2u1zefCNt7fc7CuWcbSXRmrSDeVmXa5pqyuMcTKZc1k3QXpnTmukXvKLRG3',
  shortBurst1:
    '111119JL3qdiiY52upLZGLkmUyJgPtsRroU6VTtgRuronr2DKGf3CJaMhBS7s5kxj1Me2XEoGLcRknJCHKtnAowvHKVBfVifda7Dx6DUzQXXfV8zDYbLXPcT',
  shortBurst2:
    '1111132GcoHBn6zRidimZXKUAHsmPUkSbnz2KrWjkzg31r98o5AiijKdFaMZCYyG7ZxAEmvWnwLDS67DRctvkww5Lu6jd4GSFBSCzbrMZkpFrWmQbG5vWpZD',
  shortBurst3:
    '1111121e3WfXM7pRrSigcknRDa8NbSA2N7okHuyBtSK9HbpzzxLYy3Ekzx2ByS9XjKGjvp8D4CdJpMgP4Zu6DfhkH49Ak9nPGbPBRgWbDxxDSRJ2FdiEznUw',
  plrBodyBurst1:
    '111118YG5zhVrELn8VTGkxwxYWMKh7a8dzegcvekzfeW8CVPMw5n8EwoAmAREwg8acnupveJwBZLE8B39dPrrR85JWsKMZ7ApXEmsUqzMfCxmRVLZYA21mm',
  plrBodyBurst2:
    '111118YG5zhVrELgY9HGUYhSRe7mTAGoPEaDHUH94yxmBBzd8w9oxUKqVhiog5KKSStE47r5MK2BUhvqhhkwTEmxghFD9v3D3pcumDPkKgaRk5VdBaumgEF',
  plrBodyBurst3:
    '111118YG5zhVrELgY9HGUYhSRe7mTAGoPEaDHUH94z3PuHGBTD82QpMvyfoDm4Un8bShE63qzMWm9P1yxZiQyYEvGGfDps3z8d83sHfmt7Po1U6PfC8knXM',
  birdHit1:
    '34T6PkijyRKM9pNp1Zh5KRDNcrV1DzZv93wxqaC8cUzkmQjAqUJaGDyyMSR9jC691NLc2F7eZ2wk7ndEEVc8gseg4B9pKQc4P1WBgAkb4TByUYCS7avx8vNDy',
  birdHit2:
    '57uBnWSMQaYhc8uPgSr1MZxCYGYNLDgg1JWh6w6nwpvXa9J2VJU5P1LGRnMwp5Q3baDCeuYvLLPWS4jWwvrUbmytzJHjwff7iCqEDPKTbdeRrt5xTL1Q59ogF',
  onSpike1:
    '1111121e3WeC4AmPKjiTC3g2Y6zDfUKSi9UqhrwSrhfFKPdvDxrLy6saEcrbGLThVYCeDJer114Tr975w6Xoso3wobD6GWgGHVnCL4wio4sJX2SRbw6BumBm',
  onSpike2:
    '1111121e3WeC4AmPKjiTC3g2Y6zDfUKSi9Uqhs3EqzRz2kKrVK68EG7eP6BJPDEhMhYsZSiQzHArktSa5XJPkwDnro4444Tj5xhwcMrzGMc9QCyw7P36Ypx7',
  onSpike3:
    '1111121e3WeC4AmPKjiTC3g2Y6zDfUKSi9Uqhs3EqzRyUUMrkrN3ZebRJmxsRsxzSPDwckbNV3uFeFyowNUTc6u5USZzeWwSG9jhpWFeByrpTi9Vg3V1qDZH',
  alienBeam:
    '5B745WpuiiNxJmKw9AL4aDd75n8pagHL8yYiTfjioHH37tW9WWZhAL9WbBB2fkhoG7oViRWf2SnjsjMNyHtZBwukEFDgwv42KA4c3UexZ5jCTk32g7hiXULDW',
  noisySplash:
    '7BMHBGS7TPmzBB8VHN3YaGqpi2SR3y7MpWt9MuxNB1wkSpDoXEQN4QNvCsz3jcug8i4xtw3vfZTVCqY9uNQShghgDx8NoMEohUVJRLZPrkri6dgN5FsGPXh2w',
  bubbleInShort:
    '8wDgXXdm6UL8RAzZmAJ2QDKdTaPp8A4YTKbst7TiPDJLMAffyW47u4sa1LKfzFJhdEubsb8Jxi8svQLigwCjGpW2y1QjRQJg5TkxFsSfjHFT8UD1EFKmpGWiR',
  bubbleInSlow:
    '9Akajz5ktv9BdonUUSes1GJCpodDym5rDqF7Sap3DPasYpfo1JUpKV8ZQHB998ZqocPJ5pPcR5thsBAYHh83NrPPQurNij1taS4XijUp9CR48mVDW8aCTUFbU',
  cartoonMissileLaunch:
    '3ErJF1eyRkbYFouYvXTTVjR36byr2Ea4HDwpEmfuKwqsSTQk5fAPgatB5FYiuAFp4SdKAq5Hnp4L6m2h1xMBRqyqV4dnvGJCNVCkriDs1AnamhgKCktyht1P7',
  cartoonMissileLaunchMultiple:
    '3ZaWJTN45HihKaUekefAx7KPnBCBnQ8xrb1GmvyNPh9Gwe3UdXxNe1DtYXTgjYkxyXK5dVHn8cNTry82BsU7a5HCa9oyiKXUMvpqkUJHvjGXcngBGBQNw4e8y',
}

////////// AUDIO TO A SPRITE
const __AUDIO_SPRITE_KEY = '__AUDIO_SPRITE_KEY'
import __AUDIO_SPRITE_JSON, { TAudioKey } from '../../assets/sound/audioSpriteConfig'

export const playAudioFromSprite = (
  scene: Scene,
  key: TAudioKey,
  config?: Phaser.Types.Sound.SoundConfig
) => {
  try {
    scene.sound.playAudioSprite(__AUDIO_SPRITE_KEY, key, config)
  } catch (ex) {
    debugWarn(`Can't play audio sprite: `, ex)
  }

  return __AUDIO_SPRITE_KEY
}

export const loadB64AudioSprite = (
  scene: Scene,
  b64data: string,
  opts: { spriteKey: string; spriteConfig: object } = {
    spriteKey: __AUDIO_SPRITE_KEY,
    spriteConfig: __AUDIO_SPRITE_JSON,
  }
) => {
  scene.cache.json.add(opts.spriteKey, opts.spriteConfig)

  return new Promise((resolve, reject) => {
    var audioCtx: AudioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    audioCtx.decodeAudioData(
      toArrayBuffer(b64data),
      (buffer) => {
        scene.cache.audio.add(__AUDIO_SPRITE_KEY, buffer)
        resolve(__AUDIO_SPRITE_KEY)
      },
      (e) => {
        debugWarn('Error with decoding audio data' + e)
        reject('Error with decoding audio data' + e)
      }
    )
  })
}
////////////

export const Music = {
  BgMusicCosmicImpro: 'BgMusicCosmicImpro',
  FrankSinatraILoveYou: 'FrankSinatraILoveYou',
  BeeGeesHowDeepIsYourLove: 'BeeGeesHowDeepIsYourLove',
}

export type TSoundConfigs = typeof soundConfigs

/** NOTE: this relies onto the inclusion of sfxr.js and riffwave.js */
const SoundEffect = (window as any).SoundEffect

// const generateEffect = (effectConfig: string) => new SoundEffect(effectConfig).generate()

export const generatedSounds = (
  configs: typeof soundConfigs = soundConfigs
): typeof soundConfigs => {
  const soundsResult = Object.keys(configs).reduce((acc: any, key: string) => {
    const soundConf = configs[key]
    // acc[key] = generateEffect(soundConf)
    try {
      acc[key] = sfxr.toAudio(soundConf)
    } catch (ex) {
      console.warn('Could not create sound: ', ex)
    }
    return acc
  }, {})

  // SOUNDS = soundsResult
  return soundsResult
}

const AUDIO_CONFIG = {
  fxVolume: 0.05,
}

/** @deprecated */
export const playSound = (sound: any) => {
  // TODO:LATER: unhardcode sound volume
  ;(sound as any).getAudio().setVolume(AUDIO_CONFIG.fxVolume).play()
}

export let SOUNDS = generatedSounds()

export const playAnyOf = (nameStartsWith: string, count?: number) => {
  const filtered = Object.keys(SOUNDS).filter((key) => key.startsWith(nameStartsWith))
  const playAnyOf = count ? take(count, filtered) : filtered
  const chosenSound = SOUNDS[playAnyOf[Phaser.Math.Between(0, playAnyOf.length - 1)]]

  if (chosenSound) {
    chosenSound.setVolume(AUDIO_CONFIG.fxVolume)
    chosenSound.play()
  }
}

export const Sound = {
  playAnyOf,
  TracksMap: {
    LVL_INTRO: 'LVL_INTRO',
    LVL_THEME1: 'LVL_THEME1',
  },
  loadSoundtrack: async (scene: Scene, key: string, b64Data: string) => {
    ;(scene.sound as Phaser.Sound.WebAudioSoundManager).decodeAudio(key, b64Data)

    return new Promise<void>((resolve) => {
      scene.sound.once('decodedall', async (...args) => {
        // debugLog('audio decoded', ...args)
        // scene.sound.add(key)
        await waitMs(1)
        resolve()
      })
    })
  },
  generatedSounds,
  SOUNDS,
}

exposeToWindow({ Sound, playAudioFromSprite, playSound, SOUNDS })

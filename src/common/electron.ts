import { exposeToWindow } from './debug'

export const isElectron = () => Boolean(process.env.ELECTRON || process.env.ELECTRON_DEBUG)

exposeToWindow({ isElectron })

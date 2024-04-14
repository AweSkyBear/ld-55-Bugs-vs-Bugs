import { SETTINGS_KEYS, TSettings } from '~/obs-disp/SettingsCRUD'
import { constructEvents, IEvent } from './event'

type TSettingEventName =
  | 'SETTINGS_LOADED'
  | 'SETTING_UPDATE'

export interface ISettingEvent extends IEvent {
  name: TSettingEventName
}

export interface ISettingsLoadedEvent extends IEvent {
  payload: TSettings
}

export interface ISettingsUpdateEvent extends IEvent {
  name: TSettingEventName
  payload: {
    field?: keyof typeof SETTINGS_KEYS,
    value?: any,
    path?: string[]
    values?: Record<string | number | symbol, any>
  }
}

export interface ISettingsSetPanEvent extends IEvent {
  name: TSettingEventName
  payload: {
    values: {
      panSpeed: number
      panInertiaDist: number
      panInertiaSpeed: number
    }
  }
}

// note: re-typing the input `name` so that its fixed to TSettingEventName
const _constructEvents: (
  events: Array<ISettingEvent['name'] | ISettingEvent>
) => Record<ISettingEvent['name'], ISettingEvent> = constructEvents as any

export const settingEvents = _constructEvents([
  'SETTINGS_LOADED',
  'SETTING_UPDATE',
])

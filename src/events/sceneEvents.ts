import { constructEvents } from 'obs-disp'

export const sceneEvents = constructEvents([
  'CREATE',
  'CORRECTED_UPDATE',
  'DESTROY',
  'UPDATE',
  'POST_UPDATE',
  'POST_UPDATE_THROTTLED',
  'CAMERA_SCROLL_CHANGE',
  // CUSTOM
  'RESIZE_WORLD',
  'SCENE_SET_CINEMATIC_ACTIVE',
  'DRAW_HALT',
  'DRAW_RESUME',
])

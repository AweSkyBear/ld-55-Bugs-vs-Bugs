import { constructEvents, IEvent } from "./event";

type TMapZoomEventName =
  | "MAPZOOM_ZOOM_IN"
  | "MAPZOOM_ZOOM_OUT"
  | "MAPZOOM_MAP_SHOW"
  | "MAPZOOM_MAP_HIDE";

export interface IMapZoomEvent extends IEvent {
  name: TMapZoomEventName;
}

// note: re-typing the input `name` so that its fixed to TInputEventName
const _constructEvents: (
  events: Array<IMapZoomEvent["name"] | IMapZoomEvent>
) => Record<IMapZoomEvent["name"], IMapZoomEvent> = constructEvents as any;

export const mapAndZoomEvents = _constructEvents([
  "MAPZOOM_ZOOM_IN",
  "MAPZOOM_ZOOM_OUT",
  "MAPZOOM_MAP_SHOW",
  "MAPZOOM_MAP_HIDE",
]);

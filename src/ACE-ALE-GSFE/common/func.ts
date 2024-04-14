import { Func, Point, Predicate } from './types'
import {
  map,
  addIndex,
  path,
  defaultTo,
  compose,
  mapObjIndexed,
  isNil,
  is,
  complement,
  prop,
  find,
  propEq,
  propOr,
  toPairs,
  pathOr,
  mergeWith,
  uniq,
  concat,
  mergeAll,
  either,
  pathEq,
  mergeDeepRight,
  pick,
  any,
} from 'ramda'
export {
  omit,
  either,
  any,
  filter,
  mergeDeepRight as merge,
  mergeDeepLeft,
  mergeDeepRight,
  isEmpty,
  pathOr,
  path,
  clone,
  propEq,
  clamp,
  propOr,
  always,
  forEach,
  defaultTo,
  reduce,
  is,
  compose,
  mapObjIndexed,
  flatten,
  map,
  addIndex,
  add,
  length,
  complement,
  curry,
  equals,
  find,
  findIndex,
  flip,
  head,
  identity,
  ifElse,
  isNil,
  repeat,
  reverse,
  subtract,
  when,
  all,
  prop,
  remove,
  prepend,
  pick,
  allPass,
  partial,
  last,
  pathEq,
  mergeAll,
} from 'ramda'

// export const isNil = <T extends any>(v: T) => v === null && v === undefined
export const isNotNil = <T extends any>(v: T) => v !== null && v !== undefined
export const identityIfNotNil = <T extends any>(v: T) => v !== null && v !== undefined && v

export const isBetweenInclusive = (minInclusive, maxInclusive, value) =>
  value >= minInclusive && value <= maxInclusive

export const getObjPos: Func<Phaser.GameObjects.Components.Transform, Point> = pick(['x', 'y'])
export const addPoints = (p1: Point, p2: Point) => ({ x: p1.x + p2.x, y: p1.y + p2.y })
export const subtractPoints = (p1: Point, p2: Point) => ({ x: p1.x - p2.x, y: p1.y - p2.y })
export const dividePoint = (p1: Point, divisor: number) => ({
  x: p1.x / divisor,
  y: p1.y / divisor,
})
export const multiplyPoint = (p1: Point, factor: number) => ({
  x: p1.x * factor,
  y: p1.y * factor,
})

export const deepMerge = <T extends object | Array<any>>(v1: T, v2: T): T => {
  if (Array.isArray(v1) && Array.isArray(v2)) {
    return uniq(concat(v1, v2)) as T
  } else if (typeof v1 === 'object' && typeof v2 === 'object' && !isNil(v1) && !isNil(v2)) {
    return mergeWith(deepMerge, v1, v2)
  } else {
    return v2
  }
}

export const deepUpdate = (obj: object, value: any, path: string) => {
  var i,
    pathArr = path.split('.')
  for (i = 0; i < pathArr.length - 1; i++) obj = obj[pathArr[i]]

  obj[pathArr[i]] = value
}

export const updateFlag =
  (path: string, flag: boolean, when?: Predicate<object>) => (obj: object) => () =>
    when ? when(obj) && deepUpdate(obj, flag, path) : deepUpdate(obj, flag, path)

export const objForEach = <T extends Record<any, any>>(
  cb: Func<{ key: keyof T; value; ind: number; collection }, void>,
  obj: T
) =>
  toPairs(obj).forEach(([key, value], ind, collection) => {
    cb({ key, value, ind, collection })
  })

export const matchesId = (id: string) => propEq('id')(id)
export const notMatchesId = (id: string) => complement(matchesId(id))

/** An alternative to the switch {} statement */
export const basedOn =
  <T extends string | number | symbol>(paths: Record<T, Func<never, void>>) =>
  (choice: T) => {
    return paths[choice]()
  }
export const switchOn = basedOn
export const basedOnPartial =
  <T extends string | number | symbol, R = any>(
    paths: Partial<Record<T, Func<never, R>>> & { default?: Func<never, R> }
  ) =>
  (choice: T) => {
    return paths[choice] ? paths[choice]() : paths['default'] && paths['default']()
  }
/**
 * Similar to basedOn but checks if a number is between the range [n1, n2)
 * where n1...nN are the passed paths
 */
export const basedOnRanges =
  (numberBoundariesToFN: Record<number, Func<never, void>>) => (numValue: number) => {
    // TODO:FIX BUGS -> 2) floats not working
    const rangeStarts = Object.keys(numberBoundariesToFN).map((k) => parseFloat(k))

    const firstRangeBeginningGreaterThanValue = rangeStarts.find((rangeStartVal, ind) => {
      const nextNum = rangeStarts[ind + 1]
      return numValue >= rangeStartVal && (numValue < nextNum || nextNum === undefined)
    })

    if (firstRangeBeginningGreaterThanValue !== undefined) {
      return numberBoundariesToFN[firstRangeBeginningGreaterThanValue]()
    } else {
      return noop()
    }
  }
export const switchOnRanges = basedOnRanges

export const numToFixed = (n: number, digits: number) => parseFloat(n.toFixed(digits))

export const mapObjectValuesToFnCalls = <props extends object>(
  fn: Func<any, any>,
  obj: Record<string, props>
): any => {
  const res = mapObjIndexed<object, any, string>((innerObj, presetName, topObject) => {
    // create a Function that when called will invoke `fn` with the inner object, e.g.
    //#region EXPLAIN
    /* this
      ...
      smoothy: {
        distortFactor1: 1,
        distortFactor2: 0.2,
      },
      shaky: {
        distortFactor1: 1,
        distortFactor2: 0.2,
      }
      ...

      is turned into that:

      ...
      smoothy: () => fn({
        distortFactor1: 1,
        distortFactor2: 0.2,
      }),
      shaky: () => fn({
        distortFactor1: 1,
        distortFactor2: 0.2,
      }),
      ...

    */
    //#region
    return () => fn(innerObj)
  }, obj)

  return res
}

export const mapWithIndex = addIndex(map)

export const noop = () => {}

export const callAll =
  <T extends Func<any, any>>(...fns: T[]) =>
  (...args: any) => {
    let lastReturnVal = undefined
    fns.filter(Boolean).forEach((fn) => {
      lastReturnVal = fn.apply(null, args)
    })

    return lastReturnVal
  }

export const isFunction = (val: any) => Object.prototype.toString.call(val) === '[object Function]'

export const waitMs = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms))

export const checkUntilTrue = async (
  cond: any, //Func<any, boolean>,
  timeoutMs: number = 1000,
  checkEveryMs: number = 50
) => {
  return new Promise<void>(async (resolve) => {
    const timeout = setTimeout(resolve, timeoutMs)
    while (await !cond()) await waitMs(checkEveryMs)
    clearTimeout(timeout)
    resolve()
  })
}

export const toFixedFloat = (n: number, precision = 5) => parseFloat(n.toFixed(precision))
export const normalizeFloat = (n: number, precision = 2) => parseFloat(n.toFixed(precision))

export const asArray = <T>(val: T | T[]) => (val instanceof Array ? val : [val]) as T[]

export const isUndefined = (val) => val === undefined
export const isDefined = (val) => val !== undefined

export const propIsDefined = (key: string) =>
  compose(complement(isUndefined), prop(key), defaultTo({}))

export const getPropWhenExists = <T>(key: string, ...objects: object[]) => {
  const obj = find(propIsDefined(key), objects)
  return obj ? obj[key] : undefined
}
export const getPropWhenExistsOr = <T>(defaultVal: any, key: string, ...objects: object[]) => {
  return (getPropWhenExists(key, ...objects) || defaultVal) as T
}

export const defer = (cb: Func<any, any>, timeout?: number) =>
  new Promise((resolve) => setTimeout(callAll(cb, resolve), timeout))

export const arePointsEqual = (p1: Point, p2: Point) => p1 && p2 && p1.x === p2.x && p2.y === p2.y

export const addSelfUntilSumIsInteger = (floatNum: number, maxIterations: number = 15) => {
  const self = {
    sum: 0,
    iters: 0,
    add: () => {
      self.sum = parseFloat((floatNum * self.iters).toFixed(2))
      self.iters += 1
    },
    reset: () => (self.sum = 0),
    run: () => {
      while (
        self.sum === 0 ||
        // (self.sum - parseInt(self.sum as any) < 0.151) &&
        (self.sum !== parseInt(self.sum as any) && self.iters < maxIterations)
      ) {
        self.add()
      }
    },
  }

  return self
}

export const toggleGameObjVisible = (obj: { visible: boolean; setVisible: Func<boolean, void> }) =>
  obj.setVisible(!obj.visible)

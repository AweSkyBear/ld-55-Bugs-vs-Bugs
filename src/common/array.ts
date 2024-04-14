import { equals } from 'ramda'

export const removeArrItem = (arr: Array<any>, itemOrPred: any) => {
  const pred = typeof itemOrPred === 'function' ? itemOrPred : equals(itemOrPred)
  const itemInd = arr.find(pred)
  itemInd !== -1 && arr.splice(itemInd, 1)
  return arr
}
export const emptyArray = (arr: Array<any>) => arr.splice(0, arr.length - 1)

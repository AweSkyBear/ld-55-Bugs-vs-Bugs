export const padFloatTo2Digits = (float: number | string) => {
  const _float = parseFloat(float as any)
  return _float < 10 ? '0' + float : float
}

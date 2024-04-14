export const getTimeInMinutesAndSecondsStr = (n: number) => {
  const minutes = `${parseInt((n / 60) as any)}`
  const seconds = `${n - parseInt((n / 60) as any) * 60}`
  return `${minutes}.` + `${seconds.length < 2 ? '0' + seconds : seconds}m`
}

export const getTimeInMinutesAndSeconds = (n: number) => {
  const minutes = parseInt((n / 60) as any)
  const seconds = n - parseInt((n / 60) as any) * 60
  return {
    minutes,
    seconds,
  }
}

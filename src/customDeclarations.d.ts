// add any files we'd be importing via e6 import  e.g. check BootScene.ts

declare module '*.frag' {
  const value: string
  export default value
}

declare module '*.m4a' {
  const value: string
  export default value
}

declare module '*.png' {
  const value: string
  export default value
}
declare module '*.jpg' {
  const value: string
  export default value
}

declare module '*.avif' {
  const value: string
  export default value
}

declare module '*.mp3' {
  const value: string
  export default value
}

declare module '*.json' {
  const value: object
  export default value
}

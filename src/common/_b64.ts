export const downloadDataAsImg = ({ title, getHref }: { title: string; getHref: () => string }) => {
  var link = document.createElement('a')
  link.download = title
  link.href = getHref()
  link.click()
  link.remove()
  // document.removeChild(link)
}

export function dataURItoBlob(dataURI: string) {
  var binary = atob(dataURI.split(',')[1])
  var array = []
  for (var i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i))
  }
  return new Blob([new Uint8Array(array)], { type: 'image/png' })
}

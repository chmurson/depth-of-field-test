export function imageName(aperture: string, milkNr: number, isThumb: boolean) {
  return `/images/F${aperture} - Focus on milk${milkNrToString(milkNr)}${
    isThumb ? "-600px" : ""
  }.jpg`
}

function milkNrToString(milkNr: number) {
  if (milkNr === 1) {
    return ""
  }
  return ` ${milkNr - 1}`
}

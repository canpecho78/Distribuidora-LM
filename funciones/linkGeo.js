/**
 * @param {{degreesLatitude:number,degreesLongitude:number}} param1
 */
function generateLocationURL({degreesLatitude,degreesLongitude}) {
  const url = `https://www.google.com/maps/search/${degreesLatitude},+${degreesLongitude}`
  return url
}

export default generateLocationURL
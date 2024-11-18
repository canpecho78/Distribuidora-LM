/**
 * @param {number} userDistance Distancia del usuario entre su locacalización y el negocio
 * @param {number} maxDistance Distancia máxima permitida del delivery
 */
function isValidDistance(userDistance,maxDistance) {
  if (userDistance <= maxDistance) {
    return true
  }
  return false
}

export default isValidDistance
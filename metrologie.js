/**
 * 
 * @param {*} predetermination : Consigne de chargement
 * @param {*} taux : Taux d'incorporation du produit secondaire (additif)
 * @returns : quantité d'additif à charger
 */
export function calculAdditif(predetermination, taux) {
    return Math.round(predetermination*(taux/100))
}

/**
 * 
 * @param {*} masse : masse chargée
 * @param {*} densite : densité du produit chargé
 * @returns : volume à température
 */
export function volumeT(masse,densite){
    return masse*densite;
}

/**
 * Conversion du volume à temparéture vers Volume marchand à 15°c
 * @param {*} volumeT : Volume à température
 * @param {*} k : Coefficient dépendant du produit
 * @param {*} t : température
 * @returns : Volume converti à 15 °c
 */

export function volume15(volumeT, k, t){
    const volume15 = volumeT*(1+k*(t-15))
    return volume15
}
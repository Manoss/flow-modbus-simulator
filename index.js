//var Debitmetre = require('./turbine')
import Debitmetre from "./turbine.js"
import {calculAdditif, volume15, volumeT} from "./metrologie.js"

import {lowUint16, hightUint16} from "./conversion.js";

const consigne = 200;
const taux = 4.8;
const densite = 0.789;
const mot28 = 1122;
const temperature = 22.35;
const coeff15 = 0.9922;
let volumeCharge = 0;

const additif = calculAdditif(consigne, taux)

const em1 = new Debitmetre(consigne, 'em1');
const em2 = new Debitmetre(additif, 'em2');
const em3 = new Debitmetre(150, 'em3');

/**
 * MAIN
 *
 *
 *
 **/

// Turbine 1
em1.start();
em1.pulse();

// Turbine 2
em2.start();
em2.pulse();

// Turbine 3
//em3.start();
//em3.pulse();

const tauxSatisfaction = lowUint16(mot28);
const injecteur = hightUint16(mot28);
const volume = volumeT(consigne,densite)
const volumeA15 = volume15(volume,coeff15,temperature,)

console.log("Taux Satisfaction : ", tauxSatisfaction, " %")
console.log("Numéro d'injecteur : ", injecteur)
console.log("Volume à Température : ", volume)
console.log("Volume à 15°c : ", volumeA15)
console.log("Volume Chargé : ", volumeCharge)

/**
em1.start();

turb1 = setInterval(() => {
  em1.calculVolume();
  if (em1.consigneAtteinte()) clearInterval(turb1);
}, 500);

turb2 = setInterval(() => {
  em2.calculVolume();
  if (em2.consigneAtteinte()) clearInterval(turb2);
}, 100);
*/


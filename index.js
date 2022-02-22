//var Debitmetre = require('./turbine')
import Debitmetre from "./turbine.js"

import {calculAdditif, swapIntegerToHexadecimal, volumeT} from "./util.js";

const predetermination = 200;
const taux = 4.8;
const densite = 0.789;

const em1 = new Debitmetre(predetermination, 'em1');
const em2 = new Debitmetre(calculAdditif(predetermination, taux), 'em2');
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

console.log("Volume à T : ", volumeT(calculAdditif(predetermination, taux), densite))
console.log(swapIntegerToHexadecimal(predetermination))

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

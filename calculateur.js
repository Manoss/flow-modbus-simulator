import Debitmetre from "./turbine.js"
import {calculAdditif, volume15, volumeT} from "./metrologie.js"
import {lowUint16, hightUint16} from "./conversion.js";
import { startServeur } from "./serveur-modbus.js";

export default class Calculateur {
    constructor(id, consigne, taux) {
        this.id = id;
        this.consigne = consigne || 200;
        this.taux = taux || 4.8;
        this.densite = 0.789;
        this.mot28 = 1122;
        this.temperature = 22.35;
        this.coeff15 = 0.9922;
        this.additif = calculAdditif(this.consigne, this.taux)
        this.em1 = new Debitmetre(consigne, 'em1');
        this.em2 = new Debitmetre(this.additif, 'em2');
    }

    #bilan(vol){
        this.tauxSatisfaction = lowUint16(this.mot28);
        this.injecteur = hightUint16(this.mot28);
        console.log(" Identification : ", this.id)
        console.log("[",this.id,"] Taux Satisfaction : ", this.tauxSatisfaction, " %")
        console.log("[",this.id,"] Numéro d'injecteur : ", this.injecteur)
        console.log("[",this.id,"] Volume à Température : ", vol)
        console.log("[",this.id,"] Volume à 15°c : ", volume15(vol,this.coeff15))
        console.log("[",this.id,"] Volume atteint : ", vol)
    }

    start(){

        startServeur('193.1.1.1', 502, 2);

        //this.em1.start();
        //this.em2.start();

        this.em1
        .on("start", () => console.log("[EM1] Turbine en service"))
        .on("volumeEnCours", volumeEm1 => console.log("[EM1] Volume en cours: ", volumeEm1))
        .on("consigneAtteinte", chargementEm1 => this.#bilan(chargementEm1))
      
      
        this.em2
        .on("start", () => console.log("[EM2] Turbine en service"))
        .on("volumeEnCours", volumeEm2 => console.log("[EM2] Volume en cours: ", volumeEm2))
        .on("consigneAtteinte", chargementEm2 => this.#bilan(chargementEm2))
    }
}
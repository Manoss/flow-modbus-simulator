import Debitmetre from "./turbine.js"
import {calculAdditif, volume15, volumeT} from "./metrologie.js"
import {lowUint16, hightUint16} from "./conversion.js";
import { startServeur } from "./serveur-modbus.js";
import TableEcriture  from "./table-ecriture.js"

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
        this.tableEcriture = new TableEcriture();
        this.unitID = 2;
        this.vector = {
            getInputRegister: function(addr, unitID) {
                // Synchronous handling
                return addr;
            },
            getHoldingRegister: function(addr, unitID, callback) {
                // Asynchronous handling (with callback)
                setTimeout(function() {
                    // callback = function(err, value)
                    callback(null, addr + 9000);
                }, 10);
            },
            getCoil: function(addr, unitID) {
                // Asynchronous handling (with Promises, async/await supported)
                return new Promise(function(resolve) {
                    setTimeout(function() {
                        resolve((addr % 2) === 0);
                    }, 10);
                });
            },
            setRegister: function(addr, value, unitID) {
                // Asynchronous handling supported also here
              this.#tableEcriture(addr,value)
                .then((buffer) =>console.log("Valeur saisie : ", buffer))
                .catch(err => console.log("Promise erreur : ",err))
                return;
            },
            setCoil: function(addr, value, unitID) {
                // Asynchronous handling supported also here
                console.log("set coil", addr, value, unitID);
                return;
            },
            readDeviceIdentification: function(addr) {
                return {
                    0x00: "MyVendorName",
                    0x01: "MyProductCode",
                    0x02: "MyMajorMinorRevision",
                    0x05: "MyModelName",
                    0x97: "MyExtendedObject1",
                    0xAB: "MyExtendedObject2"
                };
            }
        }
    }


    #tableEcriture(addr,value) {
        return new Promise ((resolve, reject) => {

            console.log("tableEcriture")

            if(addr === 0) {
                bufferFonction.writeUInt16BE(value,0)
                console.log("Buffer  :", bufferFonction);
                //console.log("Binaire : ", Array.from(bufferFonction.readUInt16BE(0).toString(2)))
                this.#fonction2Bin(bufferFonction)
                resolve(bufferFonction.readUInt16BE(0).toString(10))
            }

            if(addr === 2) {
                bufferDspc.writeUInt16BE(value,2)
                console.log("Buffer  :", bufferConsigne);
                //reject()
            }
            if (addr === 3) {
                bufferDspc.writeUInt16BE(value,0)
                console.log("Buffer : ", bufferDspc )
                resolve(bufferDspc.readUInt32BE(0).toString(10))
            }

            if(addr === 4) {
                bufferConsigne.writeUInt16BE(value,2)
                console.log("Buffer 4 :", bufferConsigne);
                //reject()
            }
            if (addr === 5) {
                bufferConsigne.writeUInt16BE(value,0)
                console.log("Buffer addr 5 : ", bufferConsigne )
                resolve(bufferConsigne.readUInt32BE(0).toString(10))
            }

            if(addr === 6) {
                bufferMasseVolumique.writeUInt16BE(value,0)
                console.log("Buffer  :", bufferMasseVolumique);
                resolve(bufferMasseVolumique.readUInt16BE(0),toString(10))
            }

            if(addr === 7) {
                bufferQuaiInjecteur.writeUInt16BE(value,0)
                console.log("Buffer  :", bufferQuaiInjecteur);
                resolve(bufferQuaiInjecteur.readUInt16BE(0).toString(10))
            }

            if(addr === 8) {
                bufferVolumeAdditif.writeUInt16BE(value,0)
                console.log("Buffer  :", bufferVolumeAdditif);
                resolve(bufferVolumeAdditif.readUInt16BE(0).toString(10))
            }

            if(addr === 9) {
                bufferTauxAdditif.writeUInt16BE(value,0)
                console.log("Buffer  :", bufferTauxAdditif);
                resolve(bufferTauxAdditif.readUInt16BE(0).toString(10))
            }
            
            //if (addr !== 4 || addr !== 5) err()
        })
    }

    #fonction2Bin(bufferUInt16) {
        const buffer2Array = Array.from(bufferUInt16.readUInt16BE(0).toString(2).padStart(16,0))
        console.log("[fonction2bin] : ", fonction)
        console.log("[fonction2bin] - taille du tableau : ", buffer2Array.length)
        console.log("[fonction2bin] - buffer2Array : ", buffer2Array)
    
            console.log("[fonction2bin] - tableau dans if : ", buffer2Array.length)
            fonction.bras_service = buffer2Array[15]
            fonction.dde_debit = buffer2Array[14]
            fonction.dde_arret = buffer2Array[13]
            fonction.dde_solde = buffer2Array[12]
            fonction.dde_synchro_heure = buffer2Array[11]
            fonction.acquit_alarme = buffer2Array[10]
            fonction.autorisation = buffer2Array[9]
            fonction.cr_ok = buffer2Array[8]
            fonction.bras_sud = buffer2Array[7]
            fonction.bars_nord = buffer2Array[6]
    
        console.log("[fonction2bin] : ", fonction)
        return true
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

        startServeur(this.vector, '193.1.1.1', 502, 2);

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
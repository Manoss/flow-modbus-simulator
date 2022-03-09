import * as ModbusRTU from 'modbus-serial' ;
import * as Calculateur from './calculateur.js';

let bufferFonction = Buffer.alloc(2) //mot 1
let bufferDspc = Buffer.alloc(4) //mot double 2/3
let bufferConsigne = Buffer.alloc(4) //mot double 4/5
let bufferMasseVolumique = Buffer.alloc(2) //mot 6
let bufferQuaiInjecteur = Buffer.alloc(2) //mot 7
let bufferVolumeAdditif = Buffer.alloc(2) //mot 8
let bufferTauxAdditif = Buffer.alloc(2) //mot 9

let fonction = {
    bras_service: 0,
    dde_debit:0,
    dde_arret:0,
    dde_solde:0,
    dde_synchro_heure:0,
    acquit_alarme:0,
    autorisation: 0,
    cr_ok:0,
    bras_sud:0,
    bars_nord:0
}



var vector = {
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
      tableEcriture(addr,value)
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

export function startServeur(ip,port,unitID){
    console.log("ModbusTCP listening on modbus://",ip,":",port);
    var serverTCP = new ModbusRTU.ServerTCP(vector, { host: ip, port: port, debug: true, unitID: unitID });

    serverTCP.on("socketError", function(err){
        console.error(err);
    });
}

function dec2bin(dec){
    //Supprime le signe et renvoi un string binaire sur 16 bits
    return (dec >>> 0).toString(2).padStart(16,'0');
}

async function tableEcriture(addr,value) {
    return await new Promise ((resolve, reject) => {

        console.log("tableEcriture")

        if(addr === 0) {
            bufferFonction.writeUInt16BE(value,0)
            console.log("Buffer  :", bufferFonction);
            //console.log("Binaire : ", Array.from(bufferFonction.readUInt16BE(0).toString(2)))
            fonction2Bin(bufferFonction)
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

async function fonction2Bin(bufferUInt16) {
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

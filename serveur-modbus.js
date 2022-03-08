import * as ModbusRTU from 'modbus-serial' ;

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

function extractBooleanFromBinaire16Bits(binaire){
    console.log("Longueur de la chaine : ", binaire.length)
    for(let i=0; i<=15; i++) {
        
        if(i === 0 && binaire.at(i) === '1') {
            console.log("Lecture CR effectuée");
        }
        if(i === 1 && binaire.at(i) === '1') {
            console.log("Autorisation");
        }
        if(i === 2 && binaire.at(i) === '1') {
            console.log("Acquit Alarme");
        }
        if(i === 3 && binaire.at(i) === '1') {
            console.log("Demande Synchro Heure");
        }
        if(i === 4 && binaire.at(i) === '1') {
            console.log("Demande de solde");
        }
        if(i === 5 && binaire.at(i) === '1') {
            console.log("Demande Arrêt");
        }
        if(i === 6 && binaire.at(i) === '1') {
            console.log("demande mise en débit");
        }
        if(i === 7 && binaire.at(i) === '1') {
            console.log("bras en service");
        }
        if(i === 15 && binaire.at(i) === '1') {
            console.log("Bras au sud");
        }
        if(i === 14 && binaire.at(i) === '1') {
            console.log("Bras au nord");
        }
        
        console.log("Scan Binaire to Boolean : ", binaire.at(i), " a l'index : ", i)
    }
} 

function setRegisterSwitch(addr, value) {

    switch(addr) {
        case 0:
            const addrBinaire16Bits = dec2bin(value)
            console.log("Représentation Binaire ",addrBinaire16Bits, " de : ", value)
            extractBooleanFromBinaire16Bits(addrBinaire16Bits);
        case 1:
            console.log("Heure-minute");
            break;
        case 2:
        case 3:
            dspc.push(value);
            console.log("N° DSPC", dspc);
            break;
        case 4:
            console.log("Buffer :", bufferConsigne);
            bufferConsigne.fill(value)
            console.log("Buffer :", bufferConsigne);
            break;
        case 5:
            prede.push(value);
            bufferConsigne.fill(prede)
            console.log("Prédétermination");
            console.log("Longueur Tableau : ", prede.length)
            console.log("Buffer :", bufferConsigne);

            if(prede.length >0) {
                
                const buffer = new ArrayBuffer(16)
                const view = new DataView(buffer)
                const byte1 = prede[1].toString(2).padStart(16,'0')
                const byte2 = prede[2].toString(2).padStart(16,'0')
                const bytes = byte1.concat(byte2)
                console.log("Byte1 : ", byte1, " Byte 2 : ", byte2, " Concat : ", bytes)
                view.setInt32(0,parseInt(bytes,2))
                console.log(view.getInt32(0))
                
                
                /** 
                const uInt16From2Bytes = parseInt(byte2.concat(byte1),10)
                console.log(uInt16From2Bytes)
                var uInt32 = (((byte1) << 16) | (byte2));
                console.log("Conversion : ", uInt32)
            */

            }
            break;
        case 6:
            console.log("Masse volumique");
            break;
        case 7:
            console.log("Etat Quai - N° injecteur")
            break;
        case 8:
            console.log("Volume de la dose");
            break;
        case 9:
            console.log("Taux additivation");
            break;
        case 10:
            console.log("Taux de mélange")
            break;
        break;
        default:
            console.log("Nada")
    }
}

async function tableEcriture(addr,value) {
    return await new Promise ((resolve, reject) => {

        console.log("tableEcriture")

        if(addr === 0) {
            bufferFonction.writeUInt16BE(value,0)
            console.log("Buffer  :", bufferFonction);
            console.log("Binaire : ", Array.from(bufferFonction.readUInt16BE(0).toString(2)))
            fonction2Bin(Array.from(bufferFonction.readUInt16BE(0).toString(2)), fonction)
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

async function fonction2Bin(array, objet) {
 
    for (let index of array) {
        console.log("Index : ", index)
        for (let [key, value] of Object.entries(objet)){
            key[value] = index;
            console.log("Valeur : ", key,value)
        }
    }
    console.log("Objet : ", objet)
    return objet
}

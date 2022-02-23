export function calculAdditif(predetermination, taux) {
    return Math.round(predetermination*(taux/100))
}

export function volumeT(masse,densite){
    return masse*densite;
}

export function swapUint32(uInt32) {
    const swap = parseInt(uInt32.toString(2).padStart(16,0).padEnd(32,0),2)
    console.log("[swapUint32 : ", swap)
    return swap
}

export function swapUint16(uInt16) {
    const swap = parseInt(uInt16.toString(2).padStart(8,0).padEnd(16,0),2)
    console.log("[swapUint16 : ", swap)
    return swap
}
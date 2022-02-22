export function calculAdditif(predetermination, taux) {
    return Math.round(predetermination*(taux/100))
}

export function volumeT(masse,densite){
    return masse*densite;
}

export function swapIntegerToHexadecimal(entier) {
    const arr = new ArrayBuffer(4);
    const view = new DataView(arr);
    view.setUint32(0, 8000, false);
    let extract = new Uint8Array(arr)
    console.log("Uint8Array : ", arr[2])
    //swap 32 bits
    let pos = 0;
    const a = view.getUint8(pos++).toString(16);
    const r = view.getUint8(pos++).toString(16);
    const g = view.getUint8(pos++).toString(16);
    const b = view.getUint8(pos++).toString(16);
    console.log("Swap : ", a,r,g,b)
    console.log("View : ", view)
    let reverse= []
    reverse.push(g);
    reverse.push(b);
    reverse.push(a);
    reverse.push(r);
    reverse.push('0');
    reverse.push('0');
    const swap = reverse.join('').toString(10)
    console.log("reverse : ", parseInt(reverse.join(''),16))
    return arr
}
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

export function lowUint16(uInt16){
    const low2Bin = uInt16.toString(2).padStart(16,0)
    const low = low2Bin.slice(8,16)
    console.log("lowUint16 : ", low)
    return parseInt(low,2)
}

export function hightUint16(uInt16){
    const hight2Bin = uInt16.toString(2).padStart(16,0)
    const hight = hight2Bin.slice(0,8)
    console.log("hightUint16 : ", hight)
    return parseInt(hight,2)
}
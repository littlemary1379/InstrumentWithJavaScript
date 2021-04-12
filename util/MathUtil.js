function lengthXtoY(firstVector, secondVector){
    return Math.sqrt(squared(firstVector[0]-secondVector[0], 2)+ squared(firstVector[1]-secondVector[1], 2))
}

function squared(number, squared){
    return Math.pow(number, squared)
}

function xLocationForCos(slopeLength, cos){
    return slopeLength * cos
}

function yLocationForCos(slopeLength, xLength) {
    var ylength = Math.sqrt(squared(slopeLength,2) - squared(xLength,2))
    return ylength;
}
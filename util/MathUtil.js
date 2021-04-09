function lengthXtoY(firstVector, secondVector){
    return Math.sqrt(squared(firstVector[0]-secondVector[0], 2)+ squared(firstVector[1]-secondVector[1], 2))
}

function squared(number, squared){
    return Math.pow(number, squared)
}
function mTextboxWatcher(){
    console.log("m 텍스트박스 변화");
    var lengthString = document.getElementById('lengthCorrectionM').value;
    document.getElementById('lengthCorrection').value = Math.round(lengthString * 100 *10) /10
}

function cmTextboxWatcher(){
    console.log("cm 텍스트박스 변화");
    var lengthString = document.getElementById('lengthCorrection').value;
    document.getElementById('lengthCorrectionM').value = lengthString / 100
}
var mCanvas;
var line;
var isDown;
var objectId = 0;

window.onload = function drawOneLine(){
    
    initHTML();
    setListener();
}

function initHTML(){
    mCanvas = window._canvas = new fabric.Canvas('c', {selection : false});
}

function editMode(){
    console.log("편집모드 진입");
    //mCanvas.setActiveObject(mCanvas.item(objectId-1));
    removeSpot(mCanvas, objectId-1)
    mCanvas.renderAll();
    
}

function removeSpot(canvas, id) {
    canvas.forEachObject(function(obj) {
        if (obj.id == id) {
            canvas.remove(obj);
        };
    });
}

function setListener(){
    mCanvas.on('mouse:down', function(o){

        isDown = true

        var pointer = mCanvas.getPointer(o.e)
        console.log("마우스 다운" + pointer.x + " , " + pointer.y);
        
        var point = [pointer.x, pointer.y, pointer.x, pointer.y]
        line = new fabric.Line(point, {
            id : objectId,
            strokeWidth : 2,
            fill : 'black',
            stroke : 'black',
            originX : 'center',
            originY : 'center'
        });

        console.log(objectId);
        mCanvas.add(line)

    });

    mCanvas.on('mouse:move', function(o){
        
        if(!isDown) {
            return;
        }

        console.log("마우스 이동");

        var pointer = mCanvas.getPointer(o.e)
        line.set({x2 : pointer.x, y2 : pointer.y});
        mCanvas.renderAll();

    });

    mCanvas.on('mouse:up', function(o){
        console.log("마우스 업");
        isDown = false;
        objectId = objectId+1;
    });

}

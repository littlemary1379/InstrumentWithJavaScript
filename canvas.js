var mCanvas;

var line = line;

var isDown;
var renderingObject = false;
var newLine;

var lastPoint;
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

    if(objectId == 0) {
        console.log("랜더링 없음");
        return;
    } 

    removeSpot(mCanvas, objectId-1)
    objectId = objectId -1;
    mCanvas.renderAll();
    console.log("편집모드 종료");
    
}

function removeSpot(canvas, id) {
    
    canvas.forEachObject(function(obj) {

        console.log("받은 아이디"+id);
        console.log("만들어진 오브젝트 아이디"+obj.id);

        console.log(obj.id);
        if (obj.id == id) {
            canvas.remove(obj);
        };
    });
}

function setListener(){
    mCanvas.on('mouse:down', function(o){

        isDown = true
        
        if(lastPoint == null) {

            console.log("null");

            var pointer = mCanvas.getPointer(o.e)
            console.log("마우스 다운" + pointer.x + " , " + pointer.y);
        
            var point = [pointer.x, pointer.y, pointer.x, pointer.y];
            line = new fabric.Line(point, {
                id : objectId,
                strokeWidth : 2,
                fill : 'black',
                stroke : 'black',
                originX : 'center',
                originY : 'center'
            });
        } else {
            console.log("not null");

            var pointer = mCanvas.getPointer(o.e)
            console.log("마우스 다운" + pointer.x + " , " + pointer.y);
            console.log("마지막 마우스 포인트" + lastPoint[0] + " , " + lastPoint[1]);
    
            var point = [lastPoint[0], lastPoint[1], lastPoint[0], lastPoint[1]];
            line = new fabric.Line(point, {
                id : objectId,
                strokeWidth : 2,
                fill : 'black',
                stroke : 'black',
                originX : 'center',
                originY : 'center'
            }); 
        }
        
        

        // var circle = new fabric.Circle({
        //     left : pointer.x,
        //     top : pointer.y,
        //     radius : 5,
        //     fill : '',
        //     stroke : 'black',
        //     originX : 'center',
        //     originY : 'center'
        // })

        console.log(objectId);
        mCanvas.add(line)
        // mCanvas.add(circle)

    });

    mCanvas.on('mouse:move', function(o){
        
        if(!isDown) {
            return;
        }


        renderingObject = true;
        

        console.log("마우스 이동");

        var pointer = mCanvas.getPointer(o.e);

        lastPoint = [pointer.x, pointer.y];

        line.set({x2 : pointer.x, y2 : pointer.y});
        mCanvas.renderAll();
    
       

    });

    mCanvas.on('mouse:up', function(o){
        console.log("마우스 업");
        isDown = false;

        if(renderingObject == true) {
            console.log("랜더링 만들어져쏘");
            objectId = objectId+1;
            renderingObject = false;
        } else {
            console.log("랜더링 안만들어져쏘");
            renderingObject = false;

        }
        
    
    });

    mCanvas.on('mouse:dblclick', function(o){
        console.log("더블클릭");
        lastPoint = null;
    
    });

}

document.write('<script src="./util/MathUtil.js"></script>');

//기본 랜더링 변수
var mCanvas;
var line;
var isDown;

var newLine;

//삭제에 사용하기 위한 변수
var objectId = 0;
var renderingObject = false;

//첫 벡터 근처로 오는것을 감지
var firstVector = null;
var nearFirstVector = false;

// 마지막 점에서 움직이기 위한 변수
var lastPoint;

//보정에 사용하는 변수
var isCorrection = false;
var isX;
var addFirstVector;

//최종적으로 이전하는 좌표 리스트
var floorVectorList;

window.onload = function drawOneLine(){
    
    initHTML();
    setListener();
}

function initHTML(){
    mCanvas = window._canvas = new fabric.Canvas('c', {selection : false});
}

function editMode(){
    var target = document.getElementById("editMode")
    console.log("편집모드 진입");
    target.style.color = "red";
    //mCanvas.setActiveObject(mCanvas.item(objectId-1));

    if(objectId == 0) {
        console.log("랜더링 없음");
        target.style.color = "black";

        return;
    } 

    removeSpot(mCanvas, objectId-1)
    objectId = objectId -1;
    mCanvas.renderAll();
    console.log("편집모드 종료");
    target.style.color = "black";

}

function correctionMode(){
    var target = document.getElementById("correctionMode")
   
    if(!isCorrection) {
        isCorrection = true;
        target.style.color = "red";
        console.log("보정모드 진입");
    } else {
        isCorrection = false;
        target.style.color = "black"; 
        console.log("보정모드 종료");
    }
    
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

            firstVector = [pointer.x, pointer.y];
            addFirstVector = [pointer.x, pointer.y];


           // floorVectorList.add(vector3())
            
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

            addFirstVector = [lastPoint[0], lastPoint[1]];

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

        if(isCorrection) {
            var slopeLength = lengthXtoY(addFirstVector, [pointer.x, pointer.y])
            var xLength;
            if(addFirstVector[0] - pointer.x >= 0 ){
                xLength = addFirstVector[0] - pointer.x
            } else {
                xLength = pointer.x - addFirstVector[0]
            }

            var cos45 = Math.sqrt(2)/2;
            var cosRadius = xLength/slopeLength; 
            //console.log("슬로프 길이 : " +slopeLength, " , x길이 : "+ xLength)
            //console.log("루트 2 " + Math.sqrt(2))
            if(cosRadius > cos45 && cosRadius < 1) {
                console.log("45도 미만");
                line.set({x2 : pointer.x, y2 : addFirstVector[1]});
                isX = true;
            } else if (cosRadius <= cos45 && cosRadius > 0 ){
                console.log("45도 이상");
                line.set({x2 : addFirstVector[0], y2 : pointer.y});
                isX = false;
            } else if(slopeLength == xLength){
                console.log("길이가 같다.")
                line.set({x2 : pointer.x, y2 : addFirstVector[1]});
                isX = true;
            } else if(xLength == 0){
                console.log("x값 변화가 없다.")
                line.set({x2 : addFirstVector[0], y2 : pointer.y});
                isX = true;
            } else {
                console.log("수식 오류 : "+ cosRadius)
            }

    

        } else {

            line.set({x2 : pointer.x, y2 : pointer.y});
        
        }

        mCanvas.renderAll();

    });

    mCanvas.on('mouse:up', function(o){
        console.log("마우스 업");
        isDown = false;

        var pointer = mCanvas.getPointer(o.e);

        if(isCorrection && isX) {
            lastPoint = [pointer.x, addFirstVector[1]];
        } else if(isCorrection && !isX) {
            lastPoint = [addFirstVector[0], pointer.y];
        } else {
            lastPoint = [pointer.x, pointer.y];
        }

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

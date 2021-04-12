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

//가이드라인 보정 변수
var isGuideline = false;
var xGuideLine;
var yGuideLine;

//길이 출력 변수
var lengthText;

//최종적으로 이전하는 좌표 리스트
var floorVectorList;

window.onload = function drawOneLine(){
    
    initHTML();
    setListener();
}

function initHTML(){
    mCanvas = window._canvas = new fabric.Canvas('c');
    mCanvas.selection = false;
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
    var target = document.getElementById("correctionMode");

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


function guidelineMode(){
    var target = document.getElementById("guidelineMode");
    
    if(!isGuideline) {
        console.log("가이드라인 모드 진입");
        target.style.color = "red";
        isGuideline = true;
        if(firstVector == null) {
            console.log("찍어놓은 좌표 없음");
        } else {
            console.log("찍어놓은 좌표 있음");
            drawGuideline(firstVector[0],firstVector[1])
        }

    } else {
        console.log("가이드라인 모드 해제");
        target.style.color = "black";
        removeSpot(mCanvas, "xGuideLine")
        removeSpot(mCanvas, "yGuideLine")

        isGuideline = false;

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

function drawGuideline(x, y){
    var firstX, firstY, lastX, lastY;
    if(x-250 < 0) firstX = 0
    else firstX = x-250

    if(x+250 > 1000) lastX = 1000
    else lastX = x+250

    if(y-250 < 0) firstY = 0
    else firstY = y-250

    if(y+250 > 1000) lastY = 1000
    else lastY = y+250

    var xPoint = [firstX, y, lastX, y];
    var yPoint = [x, firstY, x, lastY]; 

    xGuideLine = new fabric.Line(xPoint, {
        id : 'xGuideLine',
        strokeWidth : 3,
        fill : 'rgba(211,211,211,0.5)',
        stroke : 'rgba(211,211,211,0.5)',
        originX : 'center',
        originY : 'center'
    });

    yGuideLine = new fabric.Line(yPoint, {
        id : 'yGuideLine',
        strokeWidth : 3,
        fill : 'rgba(211,211,211,0.5)',
        stroke : 'rgba(211,211,211,0.5)',
        originX : 'center',
        originY : 'center'
    });

    
    
    mCanvas.add(xGuideLine);
    mCanvas.add(yGuideLine);

    xGuideLine.selectable = false;
    yGuideLine.selectable = false;

    mCanvas.renderAll();
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
                fill : 'rgba(0,0,0,128)',
                stroke : 'rgba(0,0,0,0.5)',
                originX : 'center',
                originY : 'center'
            });

            firstVector = [pointer.x, pointer.y];
            addFirstVector = [pointer.x, pointer.y];

            if(isGuideline) {
                drawGuideline(firstVector[0], firstVector[1])
            }


            
        } else {
            console.log("not null");

            var pointer = mCanvas.getPointer(o.e)
            console.log("마우스 다운" + pointer.x + " , " + pointer.y);
            console.log("마지막 마우스 포인트" + lastPoint[0] + " , " + lastPoint[1]);
    
            var point = [lastPoint[0], lastPoint[1], lastPoint[0], lastPoint[1]];
            line = new fabric.Line(point, {
                id : objectId,
                strokeWidth : 2,
                fill : 'rgba(0,0,0,1)',
                stroke : 'rgba(0,0,0,0.5)',
                originX : 'center',
                originY : 'center'
            }); 

            addFirstVector = [lastPoint[0], lastPoint[1]];

        }

        
        lengthText = new fabric.Text("0 m", {
            left : pointer.x, 
            top : pointer.y,
            opacity : 0,
            fontSize : 20
        });
        
        lengthText.selectable = false;

        mCanvas.add(lengthText)
        mCanvas.add(line)
        
    });

    mCanvas.on('mouse:move', function(o){
        
        if(!isDown) {
            return;
        }

        renderingObject = true;
        console.log("마우스 이동");

        var pointer = mCanvas.getPointer(o.e);
        var x2poistion;

        var slopeLength = lengthXtoY(addFirstVector, [pointer.x, pointer.y])
        var xLength;
        if(addFirstVector[0] - pointer.x >= 0 ){
            xLength = addFirstVector[0] - pointer.x
        } else {
            xLength = pointer.x - addFirstVector[0]
        }

        var cos45 = Math.sqrt(2)/2;
        var cosRadius = xLength/slopeLength; 

        if(isCorrection) {

            if(cosRadius > cos45 && cosRadius < 1) {
                line.set({x2 : pointer.x, y2 : addFirstVector[1]});
                x2poistion = [pointer.x,  addFirstVector[1]];
                isX = true;
            } else if (cosRadius <= cos45 && cosRadius > 0 ){
                line.set({x2 : addFirstVector[0], y2 : pointer.y});
                x2poistion = [addFirstVector[0],  pointer.y];
                isX = false;
            } else if(slopeLength == xLength){
                line.set({x2 : pointer.x, y2 : addFirstVector[1]});
                x2poistion = [pointer.x,  addFirstVector[1]];
                isX = true;
            } else if(xLength == 0){
                line.set({x2 : addFirstVector[0], y2 : pointer.y});
                x2poistion = [addFirstVector[0],  pointer.y];
                isX = false;
            } else {
                console.log("수식 오류 : "+ cosRadius)
            }

        } else {
            line.set({x2 : pointer.x, y2 : pointer.y});
            x2poistion = [pointer.x,  pointer.y];
        }

        if(isGuideline) {

            if(x2poistion[0] == firstVector[0]) {
                yGuideLine.set({
                    fill : '#ab88ff',
                    stroke : '#ab88ff'
                })
            } else {
                yGuideLine.set({
                    fill : 'rgba(211,211,211,0.5)',
                    stroke : 'rgba(211,211,211,0.5)'
                })
            }

            if(x2poistion[1] == firstVector[1]) {
                xGuideLine.set({
                    fill : '#ab88ff',
                    stroke : '#ab88ff'
    
                })
            } else {
                xGuideLine.set({
                    fill : 'rgba(211,211,211,0.5)',
                    stroke : 'rgba(211,211,211,0.5)'
                })
            }

        }


        if((pointer.x-addFirstVector[0] > 0 && pointer.y-addFirstVector[1] > 0) || (pointer.x-addFirstVector[0] < 0 && pointer.y-addFirstVector[1] < 0)) {
            console.log("2,4사분면");
            
            lengthText.rotate(Math.acos(cosRadius)*(180/Math.PI));
        } else {
            console.log("1,3사분면");
            lengthText.rotate(-Math.acos(cosRadius)*(180/Math.PI));
        }

        if(slopeLength != 0) {
            lengthText.set({
                left : (pointer.x + addFirstVector[0])/2, 
                top : (pointer.y+addFirstVector[1])/2,
                text : Math.round(slopeLength*10)/10 + " m",
                opacity : 1
            })
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

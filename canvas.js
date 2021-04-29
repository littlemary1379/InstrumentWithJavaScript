document.write('<script src="./util/MathUtil.js"></script>');

//기본 랜더링 변수
var mCanvas;
var line;
var isDown;

var newLine;

//삭제에 사용하기 위한 변수
var objectId = 0;
var renderingObject = false;
var renderingVectorList = new Array();

//첫 벡터 근처로 오는것을 감지
var firstVector = null;
var nearFirstVector = false;

// 마지막 점에서 움직이기 위한 변수
var lastPoint;

//보정에 사용하는 변수
var isCorrection = false;
var isX;
var addFirstVector;
var x2poistion;

//가이드라인 보정 변수
var isGuideline = false;
var xGuideLine;
var yGuideLine;

//길이 출력 변수
var lengthText;

//길이 보정 변수
var isLengthCorrection = false;
var length;
var cosXlength;
var cosYlength;

//좌표 보정 변수
var locationCircle;

//데이터 출력 변수
/*lineVectorList Wrapper List*/
var roomDataList = new Array();
/*structure : startVector, endVector*/
var lineVectorList;

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

    removeSpot(mCanvas, objectId-1);
    
    var textObjectName = "textlength" + (objectId-1);
    var textCircleName = "testCircle" + (objectId);
    var textCircleName1 = "testCircle" + (objectId-1);

    removeSpot(mCanvas, textObjectName);
    removeSpot(mCanvas, textCircleName);

    objectId = objectId -1;

    renderingVectorList.pop()

    lastPoint = renderingVectorList[renderingVectorList.length-1]
    if(renderingVectorList.length==0) {
        console.log("0이래");
        removeSpot(mCanvas, textCircleName1);
        if(isGuideline) {
            guidelineMode()
            firstVector = null;
        }

    }
    
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

function lengthCorrectionMode() {
    var lengthString = document.getElementById('lengthCorrection').value;
    length = lengthString*1
    var target = document.getElementById('lengthCorrectionMode');

    if(isLengthCorrection == false) {
        if(length == null || length <=0) {
            console.log("길이 없음");
            return;
        } else {
            console.log("길이보정 모드 시작 : " + length);
            isLengthCorrection = true;
            target.style.color = "red";
        }
    } else {
        console.log("길이보정 모드 해제");
        target.style.color = "black";
        isLengthCorrection = false;
    }
}

//선을 그릴 때 마다 보정변수가 있다면, 보정변수의 값을 리로드 하는 함수임
function reNewLengthCorrection(){
    var lengthString = document.getElementById('lengthCorrection').value;
    length = lengthString*1
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
    if(x-500 < 0) firstX = 0
    else firstX = x-500

    if(x+500 > 1000) lastX = 2000
    else lastX = x+250

    if(y-500 < 0) firstY = 0
    else firstY = y-500

    if(y+500 > 1000) lastY = 2000
    else lastY = y+500

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

function callRoomData(){
    console.log("데이터 호출");
    return roomDataList;
}

function setListener(){
    mCanvas.on('mouse:down', function(o){

        lineVectorList = new Array();

        isDown = true

        var pointer = mCanvas.getPointer(o.e)

        console.log(lastPoint);
        
        if(lastPoint == null) {

            //아무것도 없을때의 랜더링
            if(o.target == null) {
            
                console.log("없냥?");
        
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

                if(isGuideline) {
                    drawGuideline(firstVector[0], firstVector[1])
                }

                locationCircle = new fabric.Circle({
                    id : 'testCircle' + objectId,
                    fill : 'rgba(0,0,0,1)',
                    stroke : 'rgba(0,0,0,0.5)', 
                    radius : 3,
                    left : pointer.x, 
                    top : pointer.y,
                    originX : 'center',
                    originY : 'center'
                })

            } else {
                //있을 때 랜더링

                //클릭을 할 때, 점을 클릭하면 생기는 일
                if(o.target.id.indexOf("testCircle")!= -1){
                    console.log(o.target);
                    console.log("또잉?");

                    var point = [o.target.left, o.target.top, pointer.x, pointer.y];
                    line = new fabric.Line(point, {
                        id : objectId,
                        strokeWidth : 2,
                        fill : 'rgba(0,0,0,128)',
                        stroke : 'rgba(0,0,0,0.5)',
                        originX : 'center',
                        originY : 'center'
                    });

                    firstVector = [pointer.x, pointer.y];

                    if(isGuideline) {
                        drawGuideline(firstVector[0], firstVector[1])
                    }

                } else {
                   
                    console.log("???? 엥?");
        
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
                    
                    
                    if(isGuideline) {
                        drawGuideline(firstVector[0], firstVector[1])
                    }

                    locationCircle = new fabric.Circle({
                        id : 'testCircle' + objectId,
                        fill : 'rgba(0,0,0,1)',
                        stroke : 'rgba(0,0,0,0.5)', 
                        radius : 3,
                        left : pointer.x, 
                        top : pointer.y,
                        originX : 'center',
                        originY : 'center'
                    }) 
                }

            }

            lengthText = new fabric.Text("0 m", {
                id : "textlength"+objectId,
                left : pointer.x, 
                top : pointer.y,
                opacity : 0,
                fontSize : 16
            });

            addFirstVector = [pointer.x, pointer.y];
        

        } else {

            //랜더링이 남아있을 때
    
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

            lengthText = new fabric.Text("0 m", {
                id : "textlength"+objectId,
                left : pointer.x, 
                top : pointer.y,
                opacity : 0,
                fontSize : 16
            });

        }

        lineVectorList.push(addFirstVector)
        
        if(locationCircle != null){
            locationCircle.selectable = false;
            mCanvas.add(locationCircle)
        }

        lengthText.selectable = false;
        

        mCanvas.add(lengthText)
        mCanvas.add(line)
        
    });

    mCanvas.on('mouse:move', function(o){
        
        if(!isDown) {
            return;
        }

        var pointer = mCanvas.getPointer(o.e);

        if(lengthXtoY(addFirstVector,[pointer.x, pointer.y]) < 5) {
            console.log("??????? 됐나?");
            renderingObject = false;
        } else {
            renderingObject = true;
            console.log("마우스 이동");
        }

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

            if(cosRadius > cos45 && cosRadius <= 1) {

                //각도보정O , 길이보정O, x축 보정                
                if(isLengthCorrection) {

                    reNewLengthCorrection();

                    if(addFirstVector[0] < pointer.x) {

                        if(renderingVectorList.length > 1) {
                            if(lengthXtoY(firstVector,[addFirstVector[0]+length, addFirstVector[1]]) < 10) {
                                line.set({x2 : firstVector[0], y2 : firstVector[1]});
                                x2poistion = [firstVector[0],  firstVector[1]];
                            } else {
                                line.set({x2 : addFirstVector[0]+length, y2 : addFirstVector[1]});
                                x2poistion = [addFirstVector[0]+length,  addFirstVector[1]];
                            }
                        } else {
                            line.set({x2 : addFirstVector[0]+length, y2 : addFirstVector[1]});
                            x2poistion = [addFirstVector[0]+length,  addFirstVector[1]];
                        }

                    } else {

                        if(renderingVectorList.length > 1) {
                            if(lengthXtoY(firstVector,[addFirstVector[0]-length, addFirstVector[1]]) < 10) {
                                line.set({x2 : firstVector[0], y2 : firstVector[1]});
                                x2poistion = [firstVector[0],  firstVector[1]];
                            } else {
                                line.set({x2 : addFirstVector[0]-length, y2 : addFirstVector[1]});
                                x2poistion = [addFirstVector[0]-length,  addFirstVector[1]];
                            }
                        } else {
                            line.set({x2 : addFirstVector[0]-length, y2 : addFirstVector[1]});
                            x2poistion = [addFirstVector[0]-length,  addFirstVector[1]];
                        }
                    } 

                    lengthText.set({
                        text : Math.round(length * 10 / 100 ) /10 + " m",
                        opacity : 1
                    })

                //각도보정O , 길이보정x, x축 보정 
                } else {

                    if(renderingVectorList.length > 1) {
                        if(lengthXtoY(firstVector,[pointer.x,pointer.y]) < 10) {
                            line.set({x2 : firstVector[0], y2 : firstVector[1]});
                            x2poistion = [firstVector[0],  firstVector[1]];
                        } else {
                            line.set({x2 : pointer.x, y2 : addFirstVector[1]});
                            x2poistion = [pointer.x,  addFirstVector[1]];
                        }
                    } else {
                        line.set({x2 : pointer.x, y2 : addFirstVector[1]});
                        x2poistion = [pointer.x,  addFirstVector[1]];
                    }

                    lengthText.set({
                        text : Math.round(slopeLength * 10 / 100 ) /10 + " m",
                        opacity : 1
                    })

                }

                isX = true;
                
            } else if (cosRadius <= cos45 && cosRadius >= 0 ) {

                //각도보정O , 길이보정O, y축 보정
                if(isLengthCorrection) {

                    reNewLengthCorrection();

                    if(addFirstVector[1] < pointer.y) {

                        if(renderingVectorList.length > 1) {
                            if(lengthXtoY(firstVector,[addFirstVector[0], addFirstVector[1]+length]) < 10) {
                                line.set({x2 : firstVector[0], y2 : firstVector[1]});
                                x2poistion = [firstVector[0],  firstVector[1]];
                            } else {
                                line.set({x2 : addFirstVector[0], y2 : addFirstVector[1]+length});
                                x2poistion = [addFirstVector[0],  addFirstVector[1]+length];
                            }
                        } else {
                            line.set({x2 : addFirstVector[0], y2 : addFirstVector[1]+length});
                            x2poistion = [addFirstVector[0],  addFirstVector[1]+length];
                        }

                    } else {

                        if(renderingVectorList.length > 1) {
                            if(lengthXtoY(firstVector,[addFirstVector[0], addFirstVector[1]-length]) < 10) {
                                line.set({x2 : firstVector[0], y2 : firstVector[1]});
                                x2poistion = [firstVector[0],  firstVector[1]];
                            } else {
                                line.set({x2 : addFirstVector[0], y2 : addFirstVector[1]-length});
                                x2poistion = [addFirstVector[0],  addFirstVector[1]-length];
                            }
                        } else {
                            line.set({x2 : addFirstVector[0], y2 : addFirstVector[1]-length});
                            x2poistion = [addFirstVector[0],  addFirstVector[1]-length];
                        }

                    } 

                    lengthText.set({
                        text : Math.round(length * 10 / 100 ) /10 + " m",
                        opacity : 1
                    })

                //각도보정O , 길이보정x, y축 보정
                } else {

                    if(renderingVectorList.length > 1) {
                        if(lengthXtoY(firstVector,[pointer.x,pointer.y]) < 10) {
                            line.set({x2 : firstVector[0], y2 : firstVector[1]});
                            x2poistion = [firstVector[0],  firstVector[1]];
                        } else {
                            line.set({x2 : addFirstVector[0], y2 : pointer.y});
                            x2poistion = [addFirstVector[0],  pointer.y];
                        }
                    } else {
                        line.set({x2 : addFirstVector[0], y2 : pointer.y});
                        x2poistion = [addFirstVector[0],  pointer.y];
                    }



                    lengthText.set({
                        text : Math.round(slopeLength * 10 / 100 ) /10 + " m",
                        opacity : 1
                    })

                }

                isX = false;
            } else {
                console.log("수식 오류 : "+ cosRadius)
            }

            var textSize = 0;
            for (var i = 0; i < lengthText._textLines.length; i++) {
                textSize += lengthText.measureLine(i).width;
            }

            if(isX == true) {

                lengthText.rotate(0);
                if(isLengthCorrection) {
                    if(slopeLength != 0) {  
                        if(addFirstVector[0] < pointer.x) {
                            lengthText.set({
                                left : addFirstVector[0]+length/2-textSize/2,
                                top : addFirstVector[1],
                            })
                        } else {
                            lengthText.set({
                                left : addFirstVector[0]-length/2-textSize/2,
                                top : addFirstVector[1],
                            })
                        } 
                    } 

                } else {
                    if(slopeLength != 0) {
                        lengthText.set({
                            left : (pointer.x+addFirstVector[0])/2-textSize/2,
                            top : addFirstVector[1],
                        })
                    } 
                }    
                
            } else if(isX == false) {
                lengthText.rotate(90);

                if(isLengthCorrection) {
                    if(slopeLength != 0) {
                        if(addFirstVector[1] < pointer.y) {
                            lengthText.set({
                                left : addFirstVector[0],
                                top : addFirstVector[1]+length/2-textSize/2
                            });
                        } else {
                            lengthText.set({
                                left : addFirstVector[0],
                                top : addFirstVector[1]-length/2-textSize/2
                            });
                        }
                    } 
                } else {
                    lengthText.set({
                        left : addFirstVector[0],
                        top : (pointer.y+addFirstVector[1])/2-textSize/2,
                    });
                }
            }
            
        } else {

            //각도보정X , 길이보정O
            if(isLengthCorrection) {
                cosXlength = xLocationForCos(length, cosRadius)
                cosYlength = yLocationForCos(length, cosXlength)

                if(addFirstVector[0] > pointer.x) {
                    cosXlength = -cosXlength;
                }
                
                if(addFirstVector[1] > pointer.y) {
                    cosYlength = -cosYlength;
                }

                if(renderingVectorList.length > 1) {
                    if(lengthXtoY(firstVector,[addFirstVector[0]+cosXlength, addFirstVector[1]+cosYlength]) < 5) {
                        line.set({x2 : firstVector[0], y2 : firstVector[1]});
                        x2poistion = [firstVector[0],  firstVector[1]];
                    } else {
                        line.set({x2 : addFirstVector[0]+cosXlength, y2 : addFirstVector[1]+cosYlength});
                        x2poistion = [addFirstVector[0]+cosXlength,  addFirstVector[1]+cosYlength];
                    }
                } else {
                    line.set({x2 : addFirstVector[0]+cosXlength, y2 : addFirstVector[1]+cosYlength});
                    x2poistion = [addFirstVector[0]+cosXlength,  addFirstVector[1]+cosYlength];
                }

                line.set({x2 : addFirstVector[0]+cosXlength, y2 : addFirstVector[1]+cosYlength});
                x2poistion = [addFirstVector[0]+cosXlength,  addFirstVector[1]+cosYlength];

                lengthText.set({
                    text : Math.round(length * 10 / 100 ) /10 + " m",
                    opacity : 1
                })

                var textSize = 0;
                for (var i = 0; i < lengthText._textLines.length; i++) {
                    textSize += lengthText.measureLine(i).width;
                }

                var textXlength = xLocationForCos(textSize, cosRadius)
                var textYlength = yLocationForCos(textSize, textXlength)

                lengthText.set({
                    left : (addFirstVector[0])+(cosXlength/2)-textXlength/2, 
                    top : addFirstVector[1]+cosYlength/2-textYlength/2,
                })

            //각도보정X , 길이보정X
            } else {

                if(renderingVectorList.length > 1) {
                    if(lengthXtoY(firstVector,[pointer.x,pointer.y]) < 5) {
                        line.set({x2 : firstVector[0], y2 : firstVector[1]});
                        x2poistion = [firstVector[0],  firstVector[1]];
                    } else {
                        line.set({x2 : pointer.x, y2 : pointer.y});
                        x2poistion = [pointer.x,  pointer.y];
                    }
                } else {
                    line.set({x2 : pointer.x, y2 : pointer.y});
                    x2poistion = [pointer.x,  pointer.y];
                }

                var textSize = 0;
                for (var i = 0; i < lengthText._textLines.length; i++) {
                    textSize += lengthText.measureLine(i).width;
                }

                var textXlength = xLocationForCos(textSize, cosRadius)
                var textYlength = yLocationForCos(textSize, textXlength)

                
                if(slopeLength != 0) {
                    lengthText.set({
                        left : (pointer.x + addFirstVector[0])/2-textXlength/2, 
                        top : (pointer.y+addFirstVector[1])/2-textYlength/2,
                        text : Math.round(slopeLength * 10 / 100 ) /10 + " m",
                        opacity : 1
                    })
                }

            }
        
            if((pointer.x-addFirstVector[0] > 0 && pointer.y-addFirstVector[1] > 0) || (pointer.x-addFirstVector[0] < 0 && pointer.y-addFirstVector[1] < 0)) {
                //console.log("2,4사분면");
                lengthText.rotate(Math.acos(cosRadius)*(180/Math.PI));
            } else {
                //console.log("1,3사분면");
                lengthText.rotate(-Math.acos(cosRadius)*(180/Math.PI));
            }

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

        mCanvas.renderAll();

    });

    mCanvas.on('mouse:up', function(o){

        isDown = false;
        lastPoint = x2poistion;

        
        
        console.log("firstVector : "+ firstVector);
        console.log("lastPoint : "+ lastPoint);

        if(renderingObject == true) {
            console.log("랜더링 만들어져쏘");
            objectId = objectId+1;

            locationCircle = new fabric.Circle({
                id : 'testCircle' + objectId,
                fill : 'rgba(0,0,0,1)',
                stroke : 'rgba(0,0,0,0.5)', 
                radius : 3,
                left : lastPoint[0], 
                top : lastPoint[1],
                originX : 'center',
                originY : 'center'
    
            })

        } else {
            console.log("랜더링 안만들어져쏘");
        }

        renderingObject = false;
        renderingVectorList.push(lastPoint);
        lineVectorList.push(lastPoint);
        roomDataList.push(lineVectorList);

        console.log(roomDataList);


        if(lastPoint[0]==firstVector[0] && lastPoint[1]==firstVector[1]) {
            console.log("벡터가 같음, 방 하나 만들어진거임 ㅎ");
            lastPoint = null;
        }

        mCanvas.renderAll();
    
    });

    mCanvas.on('mouse:dblclick', function(o){
        console.log("더블클릭");
        lastPoint = null;
        locationCircle = null;
        var textCircleName = "testCircle" + (objectId);
        removeSpot(mCanvas, textCircleName)
        mCanvas.renderAll();
    
    });

    mCanvas.on('mouse:over', function(e){
        if(e.target == null) {
            
        } else {
            var id = e.target.id+""
            if(id.includes("testCircle")){
                e.target.set({
                    fill : 'red'
                })
            }
        }

        mCanvas.renderAll();
    });

    mCanvas.on('mouse:out', function(e) {
        if(e.target == null) {
            
        } else {
            var id = e.target.id+""
            if(id.includes("testCircle")){
                e.target.set({
                    fill : 'black'
                })
            }
        }

        mCanvas.renderAll();
      });

}


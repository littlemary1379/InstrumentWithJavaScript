//생성자 함수를 이용해서 Arraylist 만들기
ArrayList = function arrayList(){
  
    this.list=[]; //데이터를 저장할 수 있는 배열을 멤버필드로 선언한다.
    //인자로 전달되는 데이터를 저장하는 함수
    
    this.add = function(item){
     //인자로 전달된 데이터를 자기 자신의 필드에 저장
     this.list.push(item);
    };
    
    //인자로 전달되는 해당 인덱스의 값을 리턴 하는 함수
    this.get = function(index){
     return this.list[index];
    };
    
    //인자로 전달되는 해당 인덱스의 값을 삭제하는 함수
    this.removeAll = function(){
     this.list=[]; //빈 배열을 대입해서 삭제하는 효과를 준다
    };
    
    //현재 저장된 크기를 리턴하는 메소드
    this.size = function(){
     return this.list.length;
    };
     
    this.remove = function(index){
     //새로운 배열을 정의
     var newList=[];
     //반복문을 돌면서 인자로 전달된 인덱스를 제외한 모든 요소를 새 배열에 담는다.
     for(var i=0;i<this.list.length;i++){
      if(i!=index){ //삭제할 인덱스가 아니라면
       newList.push(this.list[i]);
      };
     };
     //새로 만든 배열을 멤버 필드에 저장한다.
     this.list = newList;
    };
   };
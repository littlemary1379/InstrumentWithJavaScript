document.write('<script src="./canvas.js"></script>');

var db;
var roomDataString;
var roomData; 

function sendDatabase(){
    // TODO: Replace the following with your app's Firebase project configuration
// For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
var firebaseConfig = {
    apiKey: "AIzaSyBXKfsEt58sDV3E95w_HGMCZEC09Kwq7zQ",
    authDomain: "instrumentwithjavascript.firebaseapp.com",
    projectId: "instrumentwithjavascript",
    storageBucket: "instrumentwithjavascript.appspot.com",
    messagingSenderId: "1054205797995",
    appId: "1:1054205797995:web:4d6d26a2c2a2e4e514732e",
    measurementId: "G-HC012J0V6B"
};

    firebase.initializeApp(firebaseConfig);

    db = firebase.firestore();

    roomData = callRoomData();
    roomDataObject = {};

    for(var i = 0; i < roomData.length; i++) {
        var key = "vector" + i;
        console.log(key);
        roomDataObject["start"+key] = roomData[i][0]
        roomDataObject["end"+key] = roomData[i][1]
    }

    console.log(roomDataString);
    addData()

}

function addData(){

        db.collection("data").doc("two").set(roomDataObject).then(() => {
        console.log("Document successfully written!");
    });
}
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

var db = firebase.firestore();

    db.collection("users").add({
    first: "Ada",
    last: "Lovelace",
    born: 1815
    })
    .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });


}
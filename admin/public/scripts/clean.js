
function doDaThang() {
    var ref = firebase.firestore().collection("database2/schedule/lessons");
    ref.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            if(doc.data()["day"].toString().includes("062020")) {
                console.log("todelete");
                firebase.firestore().collection("database2/schedule/lessons").doc(doc.id).delete().then(function() {
                    console.log("Document successfully deleted!");
                }).catch(function(error) {
                    console.error("Error removing document: ", error);
                });
            }
            
        });
    });
}
document.getElementById("b").addEventListener("click", () => {
    doDaThang();
});
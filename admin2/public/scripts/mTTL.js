db = firebase.firestore();
db.collection("database2/course2/TeeTimes")
  .doc(window.location.hash.substr(1))
  .onSnapshot(function (doc) {
    try {
      var users = doc.data().signedUp;
      var num = doc.data().registered;
      document.getElementById("main").innerHTML =
        "Number of registered users: " + num;
      users.forEach((item) => {
        var div = document.createElement("div");
        div.className = "list";
        div.innerHTML =
          "<button onclick='unregister(&quot" +
          item +
          "&quot)'><span class='material-icons'>remove_circle_outline</span></button><p>" +
          item +
          "</p>";
        document.getElementById("main").appendChild(div);
      });
    } catch (err) {}
  });
function unregister(iden) {
  db.collection("database2/course2/TeeTimes")
    .doc(window.location.hash.substr(1))
    .update({
      registered: firebase.firestore.FieldValue.increment(-1),
      signedUp: firebase.firestore.FieldValue.arrayRemove(iden),
    });
}
function add() {
  var name = prompt(
    "Enter Name of User (include capital letters, spaces and any 'extra' characters)"
  );
  var email = prompt("Enter email address");
  db.collection("database2/course2/TeeTimes")
    .doc(window.location.hash.substr(1))
    .update({
      registered: firebase.firestore.FieldValue.increment(1),
      signedUp: firebase.firestore.FieldValue.arrayUnion(
        "(" + name + ") " + email
      ),
    });
}

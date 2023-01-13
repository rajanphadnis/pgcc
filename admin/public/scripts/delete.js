function unParse(time) {
  return Date.parse("1-Jan-1970 " + time).getTime() / 1000;
}
function doDaThang() {
  var t = document.getElementById("date").value.toString();
  var one = t.substring(0, 2);
  var two = t.substring(2, 4);
  var three = t.substring(4, 8);
  var db = firebase.firestore();
  var ref = db.collection("database2/schedule/TeeTimes");
  for (var i = 0; i < document.getElementById("days").value; i++) {
    var next = Date.parse(one + "-" + two + "-" + three)
      .addDays(i)
      .toString("M/d/yyyy");
    // console.log(next);
    var dt = next.split("/");
    var month = dt[0].padStart(2, "0");
    var day = dt[1].padStart(2, "0");
    var year = dt[2];
    console.log(day + month + year);
    var ref = db
      .collection("database2/schedule/TeeTimes")
      .where("day", "==", day + month + year);
    ref.get().then((snap) => {
      snap.forEach((doc) => {
        db.collection("database2/schedule/TeeTimes")
          .doc(doc.id)
          .delete()
          .then((d) => {
            console.log("done");
          })
          .catch((error) => {
            console.log(error);
          });
      });
    });
  }
}
document.getElementById("date").addEventListener("keyup", (event) => {
  if (event.key == "Enter") {
    doDaThang();
  }
});
document.getElementById("b").addEventListener("click", () => {
  doDaThang();
});

function unParse(time) {
  return Date.parse("1-Jan-1970 " + time).getTime() / 1000;
}
document.getElementById("b").addEventListener("click", () => {
  var t = document.getElementById("date").value.toString();
  var one = t.substring(0, 2);
  var two = t.substring(2, 4);
  var three = t.substring(4, 8);
  var db = firebase.firestore();
  var ref = db.collection("database2/course2/lessons");
  for (var i = 0; i < 10; i++) {
    var next = Date.parse(one + "-" + two + "-" + three)
      .addDays(7 * i)
      .toString("M/d/yyyy");
    // console.log(next);
    var dt = next.split("/");
    var month = dt[0].padStart(2, "0");
    var day = dt[1].padStart(2, "0");
    var year = dt[2];
    console.log(day + month + year);
    ref.add({
      max: document.getElementById("maxNum").value,
      three: document.getElementById("desc").value,
      title: document.getElementById("title").value,
      start: unParse(document.getElementById("startInp").value),
      end: unParse(document.getElementById("endInp").value),
      day: day + month + year,
      ins: document.getElementById("ins").value,
      registered: 0,
    });
  }
  // window.location = "/";
});

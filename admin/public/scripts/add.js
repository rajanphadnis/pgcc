function unParse(time) {
  return Date.parse("1-Jan-1970 " + time).getTime() / 1000;
}
document.getElementById("b").addEventListener("click", () => {
  var raw = document.getElementById("datePicker").value.replaceAll("-", "").toString();
  var t = raw.substring(raw.length - 4).toString() + raw.substring(0, 4).toString()
  // var t = document.getElementById("date").value.toString();
  var one = t.substring(0, 2);
  var two = t.substring(2, 4);
  var three = t.substring(4, 8);
  var db = firebase.firestore();
  var ref = db.collection("database2/schedule/TeeTimes");
  var repeatedNum = document.getElementById("repeatedNum").value;
  for (var i = 0; i < repeatedNum; i++) {
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
      registered: 0,
    });
  }
  // window.location = "/";
});

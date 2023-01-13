var ins = [];
var actName = [];
var occurrence = function (array) {
  "use strict";
  var result = {};
  if (array instanceof Array) {
    // Check if input is array.
    array.forEach(function (v, i) {
      if (!result[v]) {
        // Initial object property creation.
        result[v] = [i]; // Create an array for that property.
      } else {
        // Same occurrences found.
        result[v].push(i); // Fill the array.
      }
    });
  }
  return result;
};
function uniq(a) {
  var prims = { boolean: {}, number: {}, string: {} },
    objs = [];

  return a.filter(function (item) {
    var type = typeof item;
    if (type in prims)
      return prims[type].hasOwnProperty(item)
        ? false
        : (prims[type][item] = true);
    else return objs.indexOf(item) >= 0 ? false : objs.push(item);
  });
}
function foo(arr) {
  var a = [],
    b = [],
    prev;

  arr.sort();
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] !== prev) {
      a.push(arr[i]);
      b.push(1);
    } else {
      b[b.length - 1]++;
    }
    prev = arr[i];
  }

  return [a, b];
}
function download(file, text) {
  var element = document.createElement("a");
  element.setAttribute("href", text);
  element.setAttribute("download", file);
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
function mainF() {
  console.log(foo(ins));
  var t = document.getElementById("day").value;
  var one = t.substr(0, 2);
  var two = t.substr(2, 2);
  var three = t.substr(4, 4);
  var div = "<p id='dateP'></p>";
  var newT = foo(ins);
  var newAct = foo(actName);
  newT[0].forEach((thang) => {
    div =
      div +
      "<p>" +
      newAct[0][newT[0].indexOf(thang)] +
      ": " +
      newT[1][newT[0].indexOf(thang)] +
      " lessons</p>";
    console.log(thang);
  });
  document.getElementById("main").innerHTML = div;
  document.getElementById("dateP").innerHTML = one + "/" + two + "/" + three + " - " + date + ":";
  document.getElementById("download").style.display = "inline";
}
var db = firebase.firestore();
var date = "";
document.getElementById("daySubmit").addEventListener("click", () => {
    document.getElementById("download").style.display = "none";
  ins = [];
  actName = [];
  document.getElementById("main").innerHTML =
    'Loading...This may take some time.</br><div id="loader" class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"></circle></svg></div>';
  var t = document.getElementById("day").value;
  var one = t.substr(0, 2);
  var two = t.substr(2, 2);
  var three = t.substr(4, 4);
  for (var i = 0; i < 7; i++) {
    var next = Date.parse(one + "-" + two + "-" + three)
      .addDays(i)
      .toString("M/d/yyyy");
      date = next;
    console.log(next);
    var dt = next.split("/");
    var month = dt[0].padStart(2, "0");
    var day = dt[1].padStart(2, "0");
    var year = dt[2];
    console.log(day + month + year);
    db.collection("database2/course2/lessons")
      .where("day", "==", day + month + year)
      .get()
      .then((snap) => {
        snap.forEach((doc) => {
          ins.push(doc.data().ins.toString().replace(/\s+/g, "").toLowerCase());
          actName.push(doc.data().ins);
        });
        console.log(ins);
        mainF();
      });
  }
});
document.getElementById("download").addEventListener("click", () => {
  var final = "";
  final = document.getElementById("main").innerText.toString();
  console.log(final);
  var t = document.getElementById("day").value;
  var one = t.substr(0, 2);
  var two = t.substr(2, 2);
  var three = t.substr(4, 4);
  // var fileContent = one + "/" + two + "/" + three + " - " + date + ":\r\n\r\n" + final;
  var fileContent = final;
  var myFile = new Blob([fileContent], { type: "text/plain" });
  window.URL = window.URL || window.webkitURL;
  download("weeklyLessons.txt", window.URL.createObjectURL(myFile));
});

var getOptions = {
  source: "cache",
};
function twentyFourHourCheck() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  console.log(today.getHours());
  var dayOne = new Date();
  var tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  console.log(tomorrow);
}
function getMonday(d) {
  d = new Date(d);
  var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff - 1));
}
function clearCalendar() {
  var items = "";
  for (var chunk = 0; chunk < 11; chunk++) {
    var other = "";
    for (var calendarDay = 0; calendarDay < 7; calendarDay++) {
      var num = calendarDay + chunk * 7;
      var dayOne = getMonday(new Date());
      var tomorrow = new Date(dayOne);
      tomorrow.setDate(tomorrow.getDate() + num);
      var day = tomorrow.getDate();
      var month = tomorrow.getMonth() + 1;
      var year = tomorrow.getFullYear();
      // console.log(tomorrow);
      other =
        other +
        '<div class="dayDiv"><p id="label' +
        String(day).padStart(2, "0") +
        String(month).padStart(2, "0") +
        year +
        '">' +
        String(month).padStart(2, "0") +
        "/" +
        String(day).padStart(2, "0") +
        "/" +
        year +
        '</p><div class="day" id="day' +
        String(day).padStart(2, "0") +
        String(month).padStart(2, "0") +
        year +
        '"></div></div>';
    }
    items =
      items + "<div class='week' id='week" + chunk + "'>" + other + "</div>";
    other = "";
  }
  document.getElementById("days").innerHTML = items;
}
function initCalendar() {
  var items = "";
  for (var chunk = 0; chunk < 11; chunk++) {
    var other = "";
    for (var calendarDay = 0; calendarDay < 7; calendarDay++) {
      var num = calendarDay + chunk * 7;
      var dayOne = getMonday(new Date());
      var tomorrow = new Date(dayOne);
      tomorrow.setDate(tomorrow.getDate() + num);
      var day = tomorrow.getDate();
      var month = tomorrow.getMonth() + 1;
      var year = tomorrow.getFullYear();
      // console.log(tomorrow);
      other =
        other +
        '<div class="dayDiv"><p id="label' +
        String(day).padStart(2, "0") +
        String(month).padStart(2, "0") +
        year +
        '">' +
        String(month).padStart(2, "0") +
        "/" +
        String(day).padStart(2, "0") +
        "/" +
        year +
        '</p><div class="day" id="day' +
        String(day).padStart(2, "0") +
        String(month).padStart(2, "0") +
        year +
        '"></div></div>';
    }
    items =
      items + "<div class='week' id='week" + chunk + "'>" + other + "</div>";
    other = "";
  }
  document.getElementById("days").innerHTML = items;
  document.getElementById("week0").style.display = "flex";
  db.collection("database2/schedule/lessons")
    .orderBy("start", "asc")
    .orderBy("ins", "desc")
    .onSnapshot(function (querySnapshot) {
      clearCalendar();
      document.getElementById("week" + activePane).style.display = "flex";
      querySnapshot.forEach(function (doc) {
        addEvent(
          doc.data().title,
          doc.data().day,
          doc.data().start,
          doc.data().end,
          doc.id,
          doc.data().signedUp,
          doc.data().max,
          doc.data().registered,
          doc.data().ins
        );
        overflow(doc.data().day);
        checkDuplicateTime(doc.data().day);
      });
    });
}
function checkDuplicateTime(day) {
  db.collection("database2/schedule/lessons")
    .where("day", "==", day)
    .get(getOptions)
    .then((snap) => {
      snap.forEach((lesson) => {
        try {
          var timeToCheck = document.getElementById(lesson.id).parentElement
            .childNodes[2];
          var lessonProperties = document.getElementById(lesson.id)
            .parentElement.parentElement.childNodes;
          lessonProperties.forEach((lessonProperty) => {
            var otherItem = lessonProperty.childNodes[2];
            if (
              otherItem.data == timeToCheck.data &&
              (lessonProperty.childNodes[4].data == "Register" ||
                document.getElementById(lesson.id).innerHTML == "Register")
            ) {
              document.getElementById(lesson.id).disabled = false;
              document.getElementById(lesson.id).innerText = "Register";
              lessonProperty.childNodes[4].disabled = false;
              lessonProperty.childNodes[4].innerText = "Register";
              // console.log("doubled");
              // console.log(otherItem.data);
              // console.log(timeToCheck.data);
              // console.log(item.childNodes[4]);
              // console.log(iden.id);
              // main.slice(2).forEach((item) => {
              //   try {
              //     document.getElementById(item).innerText = "Closed";
              //     document.getElementById(item).disabled = true;
              //   } catch (err) {
              //     // console.log("couldn't add closed tag");
              //   }
              // });
            }
            if (
              otherItem.data == timeToCheck.data &&
              (lessonProperty.childNodes[4].data == "Cancel Lesson" ||
                document.getElementById(lesson.id).innerHTML == "Cancel Lesson")
            ) {
              console.log("cancel lesson thing");
              // console.log(item.nextSibling)
              lessonProperty.nextSibling.childNodes[4].disabled = false;
              lessonProperty.nextSibling.childNodes[4].innerText = "Register";
            }
          });
        } catch (err) {}
      });
    })
    .catch(function (error) {
      console.log("Error getting cached document:", error);
      db.collection("database2/schedule/lessons")
        .where("day", "==", day)
        .get()
        .then((snap) => {
          // ga('send', 'event', [READ], [DATA], [FIREBASE_READ]);
          snap.forEach((lesson) => {
            try {
              var timeToCheck = document.getElementById(lesson.id).parentElement
                .childNodes[2];
              var lessonProperties = document.getElementById(lesson.id)
                .parentElement.parentElement.childNodes;
              lessonProperties.forEach((lessonProperty) => {
                var otherItem = lessonProperty.childNodes[2];
                if (
                  otherItem.data == timeToCheck.data &&
                  (lessonProperty.childNodes[4].data == "Register" ||
                    document.getElementById(lesson.id).innerHTML == "Register")
                ) {
                  document.getElementById(lesson.id).disabled = false;
                  document.getElementById(lesson.id).innerText = "Register";
                  lessonProperty.childNodes[4].disabled = false;
                  lessonProperty.childNodes[4].innerText = "Register";
                  // console.log("doubled");
                  // console.log(otherItem.data);
                  // console.log(timeToCheck.data);
                  // console.log(item.childNodes[4]);
                  // console.log(iden.id);
                  // main.slice(2).forEach((item) => {
                  //   try {
                  //     document.getElementById(item).innerText = "Closed";
                  //     document.getElementById(item).disabled = true;
                  //   } catch (err) {
                  //     // console.log("couldn't add closed tag");
                  //   }
                  // });
                }
                if (
                  otherItem.data == timeToCheck.data &&
                  (lessonProperty.childNodes[4].data == "Cancel Lesson" ||
                    document.getElementById(lesson.id).innerHTML ==
                      "Cancel Lesson")
                ) {
                  console.log("cancel lesson thing");
                  // console.log(item.nextSibling)
                  lessonProperty.nextSibling.childNodes[4].disabled = false;
                  lessonProperty.nextSibling.childNodes[4].innerText =
                    "Register";
                }
              });
            } catch (err) {}
          });
        });
    });
}
function addEvent(title, index, time, time2, id, array, max, regis, ins) {
  var exists = false;
  var available = true;
  var regNames = [];
  try {
    if (array.indexOf("(" + name + ") " + email) != -1) {
      exists = true;
    }
  } catch (err) {
    // console.log(err);
    exists = false;
  }
  if (max == regis) {
    available = false;
  } else {
    available = true;
  }
  // console.log(title);
  // console.log(index);
  var date = new Date(time * 1000);
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  var formattedTime = hours + ":" + minutes.substr(-2);
  var date2 = new Date(time2 * 1000);
  var hours2 = date2.getHours();
  var minutes2 = "0" + date2.getMinutes();
  var formattedTime2 = hours2 + ":" + minutes2.substr(-2);
  // console.log(formattedTime);
  var div = document.createElement("div");
  var spotsLeft;
  var originalString = array;
  var newThng = [];
  try {
    originalString.forEach((name) => {
      var regExp = /\(([^)]+)\)/;
      var matches = regExp.exec(name);
      // console.log(matches[1]);
      newThng.push(matches[1]);
    });
  } catch (err) {
    // console.log("user isn't registered for event");
  }
  try {
    spotsLeft = max - array.length;
  } catch (err) {
    spotsLeft = max;
  }
  if (exists && available) {
    div.innerHTML =
      ins +
      " - " +
      title +
      "</br>" +
      parseTime(hours, minutes.substr(-2)) +
      " - " +
      parseTime(hours2, minutes2.substr(-2)) +
      "</br>Student: " +
      newThng.join(", ") +
      "</br><button class='reg' onclick='unRegister(&quot;" +
      id +
      "&quot;);' id='" +
      id +
      "'>Cancel Lesson</button>";
    // n;
  } else if (!exists && available) {
    div.innerHTML =
      ins +
      " - " +
      title +
      "</br>" +
      parseTime(hours, minutes.substr(-2)) +
      " - " +
      parseTime(hours2, minutes2.substr(-2)) +
      "</br><button class='reg' onclick='register(&quot;" +
      id +
      "&quot;);' id='" +
      id +
      "'>Register</button>";
  } else if (!exists && !available) {
    div.innerHTML =
      ins +
      " - " +
      title +
      "</br>" +
      parseTime(hours, minutes.substr(-2)) +
      " - " +
      parseTime(hours2, minutes2.substr(-2)) +
      "</br>Student: " +
      newThng.join(", ") +
      "</br><button class='reg' onclick='register(&quot;" +
      id +
      "&quot;);' id='" +
      id +
      "' disabled>Full</button>";
  } else if (exists && !available) {
    div.innerHTML =
      ins +
      " - " +
      title +
      "</br>" +
      parseTime(hours, minutes.substr(-2)) +
      " - " +
      parseTime(hours2, minutes2.substr(-2)) +
      "</br>Student: " +
      newThng.join(", ") +
      "</br><button class='reg' onclick='unRegister(&quot;" +
      id +
      "&quot;);' id='" +
      id +
      "'>Cancel Lesson</button>";
  }
  div.className = "card";
  var insDiv = document.createElement("div");
  insDiv.id = ins.replace(/\s+/g, "").toLowerCase() + index;
  insDiv.className = "insDiv";
  // "<div id='" + ins.replace(/\s+/g, '').toLowerCase() + "'></div>";

  // try {
  //   document
  //     .getElementById(ins.replace(/\s+/g, "").toLowerCase() + index)
  //     .appendChild(div);
  // } catch (err) {
  //   try {
  //     document.getElementById("day" + index).appendChild(insDiv);
  //     document
  //       .getElementById(ins.replace(/\s+/g, "").toLowerCase() + index)
  //       .appendChild(div);
  //   } catch (err2) {
  //     console.log("index out of range");
  //   }
  //   // document.getElementById("day" + index).appendChild(insDiv);
  // }
  try {
    document.getElementById("day" + index).appendChild(div);
    // document
    //   .getElementById(ins.replace(/\s+/g, "").toLowerCase() + index)
    //   .appendChild(div);
  } catch (err2) {
    // console.log("index out of range");
  }
}
function unRegister(iden) {
  if (confirm("Do you want to unregister for this event?")) {
    var dayOne = new Date();
    var tomorrow = new Date(dayOne);
    tomorrow.setDate(tomorrow.getDate() + 1);
    var ref = db.collection("database2/schedule/lessons").doc(iden);
    ref.get().then((doc) => {
      // ga('send', 'event', [READ], [DATA], [FIREBASE_READ]);
      var date = new Date(doc.data().start * 1000);
      var hours = date.getHours();
      var minutes = date.getMinutes().toString().padStart(2, "0");
      var date2 = new Date(doc.data().end * 1000);
      var hours2 = date2.getHours();
      var minutes2 = date2.getMinutes().toString().padStart(2, "0");
      var rawDay = document
        .getElementById(iden)
        .parentNode.parentNode.id.toString()
        .substr(3, 8);

      var dat =
        rawDay.substr(4, 4) +
        "-" +
        rawDay.substr(2, 2) +
        "-" +
        rawDay.substr(0, 2);
      var cardDate = Date.parse(dat + "T" + hours + ":" + minutes + ":00");
      var TorF = Date.today().compareTo(cardDate);
      console.log(cardDate);
      console.log(Date.today());
      console.log(TorF);
      console.log(cardDate.getTime() / 1000);
      console.log(tomorrow.getTime() / 1000);
      var tom = tomorrow.getTime() / 1000;
      var cardD = cardDate.getTime() / 1000;
      if (cardD < tom) {
        alert("Sorry, you can't cancel a lesson 24 hours before the event.");
      } else {
        ref.update({
          registered: firebase.firestore.FieldValue.increment(-1),
          signedUp: firebase.firestore.FieldValue.arrayRemove(
            "(" + name + ") " + email
          ),
        });
      }
      // if (TorF < 0) {
      //   alert("Sorry, you can't cancel a lesson 24 hours before the event.");
      // } else {
      //   ref.update({
      //     registered: firebase.firestore.FieldValue.increment(-1),
      //     signedUp: firebase.firestore.FieldValue.arrayRemove(
      //       "(" + name + ") " + email
      //     ),
      //   });
      // }
    });
  } else {
    console.log("cancelled");
  }
}
function parseTime(hr, min) {
  if (parseInt(hr) > 11) {
    if (parseInt(hr) - 12 == 0) {
      return "12:" + min + " PM";
    } else {
      return (parseInt(hr) - 12).toString() + ":" + min + " PM";
    }
  } else {
    return hr + ":" + min + " AM";
  }
}
/** Function that count occurrences of a substring in a string;
 * @param {String} string               The string
 * @param {String} subString            The sub string to search for
 * @param {Boolean} [allowOverlapping]  Optional. (Default: false)
 *
 * @author Vitim.us https://gist.github.com/victornpb/7736865
 * @see Unit Test https://jsfiddle.net/Victornpb/5axuh96u/
 * @see http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string/7924240#7924240
 */
function occurrences(string, subString, allowOverlapping) {
  string += "";
  subString += "";
  if (subString.length <= 0) return string.length + 1;

  var n = 0,
    pos = 0,
    step = allowOverlapping ? 1 : subString.length;

  while (true) {
    pos = string.indexOf(subString, pos);
    if (pos >= 0) {
      ++n;
      pos += step;
    } else break;
  }
  return n;
}
function checkDuplicate(iden) {
  var time = document.getElementById(iden).parentNode.innerHTML;
  var start_pos = time.indexOf("<br>") + 4;
  var end_pos = time.indexOf("<br>", start_pos);
  var test = time.substring(start_pos, end_pos);
  var wholeParent =
    document.getElementById(iden).parentNode.parentNode.innerHTML;
  var numMatch = occurrences(wholeParent, test, false);
  console.log(numMatch);
  if (numMatch > 1) {
    alert(
      "Be careful! There are multiple events with this same time. You can only register for one lesson at a time!"
    );
  }
}
function register(iden) {
  checkDuplicate(iden);
  document.querySelector(".modal").classList.toggle("show-modal");
  document.getElementById("accept").disabled = true;
  var docRef = db.collection("database2/schedule/lessons").doc(iden);
  docRef
    .get()
    .then(function (doc) {
      // ga('send', 'event', [READ], [DATA], [FIREBASE_READ]);
      if (doc.exists) {
        var date = new Date(doc.data().start * 1000);
        var hours = date.getHours();
        var minutes = date.getMinutes().toString().padStart(2, "0");
        var formattedTime = hours + ":" + minutes.substr(-2);
        var date2 = new Date(doc.data().end * 1000);
        var hours2 = date2.getHours();
        var minutes2 = date2.getMinutes().toString().padStart(2, "0");
        var formattedTime2 = hours2 + ":" + minutes2.substr(-2);
        var originalString = doc.data().signedUp;
        var newThng = [];
        try {
          originalString.forEach((name) => {
            var regExp = /\(([^)]+)\)/;
            var matches = regExp.exec(name);
            // console.log(matches[1]);
            newThng.push(matches[1]);
          });
        } catch (err) {
          console.log("user isn;t signed up for event");
        }

        document.getElementById("modalTitle").innerHTML =
          doc.data().ins + " - " + doc.data().title;
        document.getElementById("modalTime").innerHTML =
          parseTime(hours, minutes) + " - " + parseTime(hours2, minutes2);
        document.getElementById("modalthree").innerHTML =
          "<p>" +
          doc.data().three +
          "</p>Participants: <p>" +
          newThng.join(", ") +
          "</p>";
        // console.log("Document data:", doc.data());
        identity = iden;
        document.getElementById("accept").disabled = false;
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    })
    .catch(function (error) {
      console.log("Error getting document:", error);
    });
}
function write() {
  // if (confirm("Do you want to unregister for this event?")) {
  var dayOne = new Date();
  var tomorrow = new Date(dayOne);
  tomorrow.setDate(tomorrow.getDate() + 1);
  var ref = db.collection("database2/schedule/lessons").doc(identity);
  ref.get().then((doc) => {
    // ga('send', 'event', [READ], [DATA], [FIREBASE_READ]);
    var date = new Date(doc.data().start * 1000);
    var hours = date.getHours();
    var minutes = date.getMinutes().toString().padStart(2, "0");
    var date2 = new Date(doc.data().end * 1000);
    var hours2 = date2.getHours();
    var minutes2 = date2.getMinutes().toString().padStart(2, "0");
    var rawDay = document
      .getElementById(identity)
      .parentNode.parentNode.id.toString()
      .substr(3, 8);

    var dat =
      rawDay.substr(4, 4) +
      "-" +
      rawDay.substr(2, 2) +
      "-" +
      rawDay.substr(0, 2);
    var cardDate = Date.parse(dat + "T" + hours + ":" + minutes + ":00");
    var TorF = Date.today().compareTo(cardDate);
    console.log(cardDate);
    console.log(Date.today());
    console.log(TorF);
    console.log(cardDate.getTime() / 1000);
    console.log(tomorrow.getTime() / 1000);
    var tom = tomorrow.getTime() / 1000;
    var cardD = cardDate.getTime() / 1000;
    if (cardD < tom) {
      alert(
        "Sorry, you can't register for a lesson less than 24 hours before the event."
      );
    } else {
      ref.update({
        registered: firebase.firestore.FieldValue.increment(1),
        signedUp: firebase.firestore.FieldValue.arrayUnion(
          "(" + name + ") " + email
        ),
      });
    }
    // if (TorF < 0) {
    //   alert("Sorry, you can't cancel a lesson 24 hours before the event.");
    // } else {
    //   ref.update({
    //     registered: firebase.firestore.FieldValue.increment(-1),
    //     signedUp: firebase.firestore.FieldValue.arrayRemove(
    //       "(" + name + ") " + email
    //     ),
    //   });
    // }
  });
  // } else {
  //   console.log("cancelled");
  // }
  // var ref = db.collection("database2/schedule/lessons").doc(identity);
  // ref.update({
  //   registered: firebase.firestore.FieldValue.increment(1),
  //   signedUp: firebase.firestore.FieldValue.arrayUnion(
  //     "(" + name + ") " + email
  //   ),
  // });
  document.querySelector(".modal").classList.toggle("show-modal");
  document.getElementById("modalTitle").innerHTML = "Loading...";
  document.getElementById("modalTime").innerHTML = "Loading...";
  document.getElementById("modalthree").innerHTML = "Loading...";
}
function overflow(dayToCheck) {
  // var insPerDay = 2;
  // db.collection("database2")
  //   .doc("schedule")
  //   .onSnapshot( (doc) => {
  //     insPerDay = doc.data()[dayToCheck];
  //     console.log(insPerDay);
  //   });
  db.collection("database2/schedule/lessons")
    .where("day", "==", dayToCheck)
    .orderBy("start", "asc")
    .orderBy("ins", "desc")
    .onSnapshot(function (lessons) {
      var main = [];
      var maxAr = [];
      var registeredAr = [];
      var signedUpAr = [];
      var start = [];
      var instructors = [];
      lessons.forEach(function (lessonDoc) {
        if (lessonDoc.data().max != lessonDoc.data().registered) {
          main.push(lessonDoc.id);
          maxAr.push(lessonDoc.data().max);
          registeredAr.push(lessonDoc.data().registered);
          signedUpAr.push(lessonDoc.data().signedUp);
          start.push(lessonDoc.data().start);
          instructors.push(lessonDoc.data().ins);
        }
      });
      var exists = false;
      var available = true;

      try {
        if (signedUpAr[0].indexOf("(" + name + ") " + email) != -1) {
          exists = true;
        }
      } catch (err) {
        // console.log(err);
        exists = false;
      }
      if (maxAr[0] == registeredAr[0]) {
        available = false;
      } else {
        available = true;
      }
      try {
        if (exists && available) {
          document.getElementById(main[0]).disabled = false;
          document.getElementById(main[0]).innerText = "Cancel Lesson";
        } else if (!exists && available) {
          document.getElementById(main[0]).disabled = false;
          document.getElementById(main[0]).innerText = "Register";
        } else if (!exists && !available) {
          document.getElementById(main[0]).disabled = true;
          document.getElementById(main[0]).innerText = "Full";
        } else if (exists && !available) {
          document.getElementById(main[0]).disabled = false;
          document.getElementById(main[0]).innerText = "Cancel Lesson";
        }
      } catch (err) {
        // console.log("last item not fully registered event");
      }

      var uniqueInstructors = new Set(instructors);
      var totalUniqueInstructors = uniqueInstructors.length;
      var lessonsToStayOpen = [];

      uniqueInstructors.forEach((instructor) => {
        var indexOfIDToGet = instructors.indexOf(instructor);
        lessonsToStayOpen.push(main[indexOfIDToGet]);
      });

      main.forEach((workingID) => {
        if (!lessonsToStayOpen.includes(workingID)) {
          try {
            document.getElementById(workingID).innerText = "Closed";
            document.getElementById(workingID).disabled = true;
          } catch (err) {
            // console.log("couldn't add closed tag");
          }
        }
      });
      checkDuplicateTime(dayToCheck);
      // Potential problem: can be start.length + 1
      // for (var i = 0; i < start.length; i++) {
      //   var getCurrent = start[i];
      //   var removedArray = start;
      //   var index = removedArray.indexOf(5);
      //   if (index > -1) {
      //     removedArray.splice(index, 1);
      //   }
      //   if (removedArray.includes(getCurrent)) {
      //     var indexOfItem =
      //     document.getElementById(main[0]).disabled = false;
      //     document.getElementById(main[0]).innerText = "Register";
      //   }
      // }
      // console.log("Current cities in CA: ", cities.join(", "));
    });
}
document.getElementById("accept").addEventListener("click", write);
document.getElementById("plus").addEventListener("click", () => {
  console.log("plus");
  document.querySelector(".modal2").classList.toggle("show-modal2");
  // document.getElementById("newSave").style.display = "inline";
  // document.getElementById("accept").style.display = "none";
});
document.getElementById("deny").addEventListener("click", () => {
  document.querySelector(".modal").classList.toggle("show-modal");
  document.getElementById("modalTitle").innerHTML = "Loading...";
  document.getElementById("modalTime").innerHTML = "Loading...";
  document.getElementById("modalthree").innerHTML = "Loading...";
});
document.getElementById("previous").addEventListener("click", () => {
  if (activePane != 0) {
    document.getElementById("next").disabled = false;
    document.getElementById("week" + activePane).style.display = "none";
    activePane = activePane - 1;
    document.getElementById("week" + activePane).style.display = "flex";
    document.getElementById(
      "week" + (activePane + 1).toString()
    ).style.display = "none";
    if (activePane == 0) {
      document.getElementById("previous").disabled = true;
    }
  } else {
    console.log("back not possible");
  }
});
document.getElementById("next").addEventListener("click", () => {
  if (activePane != 10) {
    document.getElementById("previous").disabled = false;
    document.getElementById("week" + activePane).style.display = "none";
    activePane = activePane + 1;
    document.getElementById("week" + activePane).style.display = "flex";
    if (activePane == 10) {
      console.log("done");
      document.getElementById("next").disabled = true;
    } else {
      document.getElementById(
        "week" + (activePane + 1).toString()
      ).style.display = "none";
    }
  } else {
    console.log("plus not possible");
  }
});
// document.getElementById("more").addEventListener("click", () => {
//   document.querySelector(".modal2").classList.toggle("show-modal2");
// });
document.getElementById("close-button2").addEventListener("click", () => {
  document.querySelector(".modal2").classList.toggle("show-modal2");
});
var errorMessage = "Sorry, It's On Our End!";
var loginFrame = document.getElementById("sign-inDiv");
var mainContent = document.getElementById("MainContent");
var navBar = document.getElementById("navigation");
var tabbedColor = "#616161";
var themeColor = "#096F38";
var db;
var email;
var identity;
var activePane = 0;
var name;
var fullArray = [];
var modal = document.querySelector(".modal");
var infoModal = document.querySelector(".modal2");
function toggleInfoModal() {
  infoModal.classList.toggle("show-modal2");
}
function toggleModal() {
  modal.classList.toggle("show-modal");
}
function windowOnClick(event) {
  if (event.target === modal) {
    toggleModal();
  }
  if (event.target === infoModal) {
    toggleInfoModal();
  }
}
// firebase
//   .firestore()
//   .enablePersistence()
//   .then(function () {
db = firebase.firestore();
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    loginFrame.style.display = "none";
    navBar.style.display = "flex";
    email = user.email;
    name = user.displayName;
    // console.log(name);

    // var trigger = document.querySelector(".trigger");
    var closeButton = document.querySelector(".close-button");

    // trigger.addEventListener("click", toggleModal);
    closeButton.addEventListener("click", toggleModal);
    window.addEventListener("click", windowOnClick);
    if (
      email.toString().includes("golfcollege.edu") ||
      email.toString().includes("rajansd28@gmail.com")
    ) {
      initCalendar();
    } else {
      alert("Please sign in using your golfcollege account");
      firebase
        .auth()
        .signOut()
        .then(function () {
          mainContent.style.display = "none";
          loginFrame.style.display = "flex";
          navBar.style.display = "none";
        })
        .catch(function (error) {
          // An error happened.
        });
    }
    document.getElementById("logout").addEventListener("click", (sdv) => {
      firebase
        .auth()
        .signOut()
        .then(function () {
          mainContent.style.display = "none";
          loginFrame.style.display = "flex";
          navBar.style.display = "none";
        })
        .catch(function (error) {
          // An error happened.
        });
    });
  } else {
    // No user is signed in.
    mainContent.style.display = "none";
    loginFrame.style.display = "flex";
    navBar.style.display = "none";
    // Initialize the FirebaseUI Widget using Firebase.
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    var uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult: function (
          currentUser,
          credential,
          redirectUrl
        ) {
          // User successfully signed in.
          // Return type determines whether we continue the redirect automatically
          // or whether we leave that to developer to handle.
          return true;
        },
        uiShown: function () {
          // The widget is rendered.
          // Hide the loader.
          // document.getElementById("loader").style.display = "none";
        },
      },
      // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
      // signInFlow: "popup",
      signInSuccessUrl: "./",
      // signInSuccessWithAuthResult: "./",
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        {
          provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
          // Whether the display name should be displayed in the Sign Up page.
          requireDisplayName: true,
        },
        {
          provider: "microsoft.com",
          providerName: "Microsoft",
          buttonColor: "#2F2F2F",
          iconUrl: "/images/ms.png",
          loginHintKey: "login_hint",
          customParameters: {
            prompt: "consent",
          },
        },
      ],
      // Terms of service url.
      // tosUrl: "https://mycaddy.org/index.html",
    };
    // The start method will wait until the DOM is loaded.
    ui.start("#firebaseui-auth-container", uiConfig);
    // ui.start('#firebaseui-auth-container', {
    //   signInOptions: [
    //     'apple.com',
    //     'microsoft.com',
    //     'yahoo.com',
    //   ]
    // });
  }
});
// })
// .catch(function (err) {
//   if (err.code == "failed-precondition") {
//     // Multiple tabs open, persistence can only be enabled
//     // in one tab at a a time.
//     // ...
//     alert(
//       "You have multiple instances of this app open at the same time. In order for this app to work offline, you must close all other instances of this app."
//     );
//   } else if (err.code == "unimplemented") {
//     alert(
//       "The browser you are using does not support offline data for this app."
//     );
//   } else {
//     alert("Error: " + err);
//   }
// });
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("../service-worker.js").then(function () {
    console.log("Service Worker Registered");
  });
}

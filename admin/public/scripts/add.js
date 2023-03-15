var db = firebase.firestore();
var currentlySelectedEventOption = "lessonsOption";
document.getElementById("lessonsOption").classList.add("selectedEventButton");
document.getElementById("titleLabel").innerHTML = "Lesson Title:";
var pathToWrite = "database2/schedule/lessons";
var max = [];
var three = [];
var title = [];
var start = [];
var end = [];
var day = [];
var registered = [];
var ins = [];
function toggleEventRadioButtons(clickedButton) {
  document.getElementById("previewPane").innerHTML = "";
  document.getElementById("h3Date").innerHTML = "";
  document
    .getElementById("lessonsOption")
    .classList.remove("selectedEventButton");
  document.getElementById("ttOption").classList.remove("selectedEventButton");
  document.getElementById(clickedButton).classList.add("selectedEventButton");
  currentlySelectedEventOption = clickedButton;

  if (clickedButton == "lessonsOption") {
    pathToWrite = "database2/schedule/lessons";
    // document.getElementById("ttOption").classList.remove("selectedEventButton");
    document.getElementById("instructorDiv").style.display = "flex";
    document.getElementById("titleLabel").innerHTML = "Lesson Title:";
    document.getElementById("step3Title").innerHTML = "Lessons";
  } else {
    pathToWrite = "database2/schedule/TeeTimes";
    // document.getElementById("ttOption").classList.remove("selectedEventButton");
    document.getElementById("instructorDiv").style.display = "none";
    document.getElementById("titleLabel").innerHTML = "Tee Time Course:";
    document.getElementById("step3Title").innerHTML = "Tee Times";
  }
}

function compileEvents() {
  document.getElementById("previewPane").innerHTML = "";
  document.getElementById("h3Date").innerHTML = "";
  max = [];
  three = [];
  title = [];
  start = [];
  end = [];
  day = [];
  registered = [];
  ins = [];
  var testIns = document.getElementById("insDropdown").value;
  var occurrences = document.getElementById("occur").value;
  var hours = document.getElementById("elapsedHrs").value | 0;
  var minutes = document.getElementById("elapsedMins").value | 0;
  var intialTime = unParse(document.getElementById("time").value);
  var timeStep = (60 * hours + minutes) * 60;
  var raw = document
    .getElementById("date")
    .value.replaceAll("-", "")
    .toString();
  var date =
    raw.substring(raw.length - 2).toString() +
    raw.substring(4, 6).toString() +
    raw.substring(0, 4).toString();

  // console.log(date);
  var isLesson = true;
  if (currentlySelectedEventOption == "ttOption") {
    isLesson = false;
  }

  // Create arrays to write to firebase database and to preview
  for (var i = 0; i < occurrences; i++) {
    var internal_max = document.getElementById("max").value | 0;
    var internal_three = document.getElementById("desc").value;
    var internal_title = document.getElementById("title").value;
    var internal_start = intialTime + timeStep * i;
    var internal_end = internal_start + timeStep;
    var internal_day = date;
    var internal_registered = 0;
    if (currentlySelectedEventOption == "lessonsOption") {
      var internal_ins = testIns;
    }

    max.push(internal_max);
    three.push(internal_three);
    title.push(internal_title);
    start.push(internal_start);
    end.push(internal_end);
    day.push(internal_day);
    registered.push(internal_registered);
    try {
      ins.push(internal_ins);
    } catch (e) {
      ins.push("internal_ins");
    }
  }
  console.log(day);
  // Render preview
  if (isLesson) {
    document.getElementById("h3Date").innerHTML =
      "Creating " +
      occurrences +
      " Lessons</br>on " +
      document.getElementById("date").value +
      ":";
  } else {
    document.getElementById("h3Date").innerHTML =
      "Creating " +
      occurrences +
      " Tee Times</br>on " +
      document.getElementById("date").value +
      ":";
  }
  for (var i = 0; i < occurrences; i++) {
    renderEvent(title[i], start[i], end[i], three[i], max[i], ins[i], isLesson);
  }

  
  

  // db.collection("database2/schedule/TeeTimes").add({
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

function unParse(time) {
  return Date.parse("1-Jan-1970 " + time).getTime() / 1000;
}

function renderEvent(title, time, time2, desc, max, ins, isLesson) {
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
  var innerHTMLString =
    title +
    "</br>" +
    desc +
    "</br>" +
    parseTime(hours, minutes.slice(-2)) +
    " - " +
    parseTime(hours2, minutes2.slice(-2)) +
    "</br>" +
    max.toString() +
    " spot(s) left";
  // "<button class='reg' id='" +
  // id +
  // "' disabled>Register</button>";
  if (isLesson) {
    div.innerHTML = ins + " - " + innerHTMLString;
  } else {
    div.innerHTML = innerHTMLString;
  }

  div.className = "card";
  // var insDiv = document.createElement("div");
  // insDiv.id = ins.replace(/\s+/g, "").toLowerCase() + day;
  // insDiv.className = "insDiv";
  document.getElementById("previewPane").appendChild(div);
}

document.getElementById("create").addEventListener("click", () => {
  console.log("creating events...");
  var isLesson = true;
  if (currentlySelectedEventOption == "ttOption") {
    isLesson = false;
  }
  var batch = db.batch();
  for (var i = 0; i < document.getElementById("occur").value; i++) {
    var ref = db.collection(pathToWrite)
    var id = ref.doc().id;

    if (isLesson) {
      batch.set(ref.doc(id), {
        max: max[i],
        three: three[i],
        title: title[i],
        start: start[i],
        end: end[i],
        day: day[i],
        registered: 0,
        ins: ins[i],
      });
    } else {
      batch.set(ref.doc(id), {
        max: max[i],
        three: three[i],
        title: title[i],
        start: start[i],
        end: end[i],
        day: day[i],
        registered: 0,
      });
    }
  }
  batch.commit().then(() => {
    window.location.href = "/";
  });
});

document.getElementById("lessonsOption").addEventListener("click", () => {
  toggleEventRadioButtons("lessonsOption");
});
document.getElementById("ttOption").addEventListener("click", () => {
  toggleEventRadioButtons("ttOption");
});

db.collection("admin")
  .doc("instructorList")
  .get()
  .then((doc) => {
    var instructors = doc.data().instructors;
    for (var i = 0; i < instructors.length; i++) {
      var optn = instructors[i];
      var el = document.createElement("option");
      el.innerHTML = optn;
      el.value = optn;
      document.getElementById("insDropdown").appendChild(el);
    }
    // document.getElementById("insDropdown").
  });

document.getElementById("basicInfo").addEventListener("input", () => {
  compileEvents();
});

var loginFrame = document.getElementById("sign-inDiv");
var content = document.getElementById("mainContainer");
db = firebase.firestore();
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    loginFrame.style.display = "none";
    content.style.display = "flex";
  } else {
    loginFrame.style.display = "block";
    content.style.display = "none";
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    var uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult: function (
          currentUser,
          credential,
          redirectUrl
        ) {
          db.collection("admin")
            .doc("main")
            .get()
            .then((doc) => {
              if (doc.data()[currentUser.user.email]) {
                window.location.href = "/";
                return true;
              } else {
                alert("not authorized to access this site");
                firebase
                  .auth()
                  .signOut()
                  .then(function () {
                    // mainContent.style.display = "none";
                    // loginFrame.style.display = "flex";
                    // navBar.style.display = "none";
                    window.location.href = "/";
                  })
                  .catch(function (error) {
                    // An error happened.
                  });
                // return false;
              }
            });
          return false;
        },
        uiShown: function () {
          // document.getElementById("loader").style.display = "none";
        },
      },
      signInFlow: "popup",
      signInSuccessUrl: "./",
      // signInSuccessWithAuthResult: "./",
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        {
          provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
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
    };
    ui.start("#firebaseui-auth-container", uiConfig);
  }
});
// document.getElementById("b").addEventListener("click", () => {
//   var raw = document.getElementById("datePicker").value.replaceAll("-", "").toString();
//   var t = raw.substring(raw.length - 4).toString() + raw.substring(0, 4).toString()
//   // var t = document.getElementById("date").value.toString();
//   var one = t.substring(0, 2);
//   var two = t.substring(2, 4);
//   var three = t.substring(4, 8);
//   var db = firebase.firestore();
//   var ref = db.collection("database2/schedule/TeeTimes");
//   var repeatedNum = document.getElementById("repeatedNum").value;
//   for (var i = 0; i < repeatedNum; i++) {
//     var next = Date.parse(one + "-" + two + "-" + three)
//       .addDays(7 * i)
//       .toString("M/d/yyyy");
//     // console.log(next);
//     var dt = next.split("/");
//     var month = dt[0].padStart(2, "0");
//     var day = dt[1].padStart(2, "0");
//     var year = dt[2];
//     console.log(day + month + year);
//     ref.add({
//       max: document.getElementById("maxNum").value,
//       three: document.getElementById("desc").value,
//       title: document.getElementById("title").value,
//       start: unParse(document.getElementById("startInp").value),
//       end: unParse(document.getElementById("endInp").value),
//       day: day + month + year,
//       registered: 0,
//     });
//   }
//   // window.location = "/";
// });

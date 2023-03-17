function getMonday(d) {
  d = new Date(d);
  var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff - 1));
}
function clearCalendar() {
  // db.collection("database2")
  //   .doc("schedule")
  //   .get()
  //   .then((doc) => {
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
      // var date;
      // try {

      //  date = doc.data()[(
      //   String(day).padStart(2, "0") +
      //   String(month).padStart(2, "0") +
      //   year
      // ).toString()]}
      // catch (err) {
      //   console.log("nope");
      // }
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
  // });
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
        // String(month).padStart(2, "0") +
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
      });
    });
}
function addEvent(title, index, time, time2, id, array, max, regis, ins) {
  var exists = false;
  var available = true;
  try {
    if (array.indexOf(email) != -1) {
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
  // var date2 = ;
  var date2 = new Date(time2 * 1000);
  var hours2 = date2.getHours();
  var minutes2 = "0" + date2.getMinutes();
  var formattedTime2 = hours2 + ":" + minutes2.substr(-2);
  // console.log(formattedTime);
  var div = document.createElement("div");
  div.innerHTML =
    ins +
    " - " +
    title +
    "</br>" +
    parseTime(hours, minutes.substr(-2)) +
    " - " +
    parseTime(hours2, minutes2.substr(-2)) +
    "</br><button onclick='register(&quot;" +
    id +
    "&quot;);' class='reg' id='" +
    id +
    "'>Details</button>";
  div.className = "card";
  try {
    document.getElementById("day" + index).appendChild(div);
  } catch (err) {
    // console.log("index out of range");
  }
}
function register(iden) {
  docIDActive = iden;
  document.getElementById("manageUsers").href =
    "/manageLessonsUsers.html#" + iden;
  document.querySelector(".modal").classList.toggle("show-modal");
  document.getElementById("newSave").style.display = "none";
  document.getElementById("accept").style.display = "inline";
  document.getElementById("accept").disabled = true;
  var docRef = db.collection("database2/schedule/lessons").doc(iden);
  docRef
    .get()
    .then(function (doc) {
      var date = new Date(doc.data().start * 1000);
      var hours = date.getHours();
      var minutes = "0" + date.getMinutes();
      var formattedTime = hours + ":" + minutes.substr(-2);
      var date2 = new Date(doc.data().end * 1000);
      var hours2 = date2.getHours();
      var minutes2 = "0" + date2.getMinutes();
      var formattedTime2 = hours2 + ":" + minutes2.substr(-2);
      var maxNum = "<input id='maxNum' type='number'/>";
      var descInp = "<input id='descInp' type='text'/>";
      var signedUp;
      // var instructor = "<input type='text' id='instructorInp'>";
      var instructor = "<select id='instructorInp'></select>";
      var listDays = '<input id="days-select" type="date">';
      var originalString = doc.data().signedUp;
      var newThng = [];
      try {
        originalString.forEach((name) => {
          var regExp = /\(([^)]+)\)/;
          var matches = regExp.exec(name);
          // console.log(matches[1]);
          newThng.push(matches[1]);
        });
        signedUp = newThng.join(", ");
        actualDo = newThng.join("\r\n☐ ");
      } catch (err) {
        console.log("user isn;t signed up for event");
        signedUp = "none";
      }
      // try {
      //   // signedUp = doc.data().signedUp.toString();
      //   signedUp = doc.data().signedUp.join(", ");
      // } catch (err) {
      //   signedUp = "none";
      // }
      document.getElementById("modalTitle").innerHTML = "Edit Lesson";
      document.getElementById("modalTime").innerHTML =
      "<p>Course:</p><input id='titleInp' type='text' value='" +
      doc.data().title +
      "'/>" + 
        "<p>Date:</p>" +
        listDays +
        "<p>Start and End Time:</p><input id='startInp' type='time'><input id='endInp' type='time'></br><p>Max Participants:</p>" +
        maxNum +
        "<p>Description:</p>" +
        descInp +
        "<p>Registered Users: </p><p id='signedUp'>" +
        signedUp +
        "</p><p>Instructor:</p>" +
        instructor;
      for (var i = 0; i < instructorMasterArray.length; i++) {
        var optn = instructorMasterArray[i];
        var el = document.createElement("option");
        el.textContent = optn;
        el.value = optn;
        document.getElementById("instructorInp").appendChild(el);
      }
      // <a onclick='dwnload()' href='#' id='dwnld'>Download</a>
      document.getElementById("maxNum").value = doc.data().max;
      document.getElementById("descInp").value = doc.data().three;
      document.getElementById("startInp").value = parseDate(doc.data().start);
      document.getElementById("endInp").value = parseDate(doc.data().end);
      document.getElementById("days-select").value =
        doc.data().day.toString().substr(4, 4) +
        "-" +
        doc.data().day.toString().substr(2, 2) +
        "-" +
        doc.data().day.toString().substr(0, 2);
      document.getElementById("instructorInp").value = doc.data().ins;
      identity = iden;
      document.getElementById("accept").disabled = false;
    })
    .catch(function (error) {
      console.log("Error getting document:", error);
    });
}
function parseDate(start) {
  var date = new Date(start * 1000);
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  var formattedTime = hours + ":" + minutes.substr(-2) + ":00";
  // console.log(formattedTime);
  return formattedTime;
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
function newEntry() {
  var raw = document
    .getElementById("days-select")
    .value.replaceAll("-", "")
    .toString();
  var date =
    raw.substring(raw.length - 2).toString() +
    raw.substring(4, 6).toString() +
    raw.substring(0, 4).toString();
  db.collection("database2/schedule/lessons").add({
    max: document.getElementById("maxNum").value,
    three: document.getElementById("descInp").value,
    title: document.getElementById("titleInp").value,
    start: unParse(document.getElementById("startInp").value),
    end: unParse(document.getElementById("endInp").value),
    day: date,
    registered: 0,
    ins: document.getElementById("instructorInp").value,
  });
  document.querySelector(".modal").classList.toggle("show-modal");
}
function write() {
  var raw = document
    .getElementById("days-select")
    .value.replaceAll("-", "")
    .toString();
  var date =
    raw.substring(raw.length - 2).toString() +
    raw.substring(4, 6).toString() +
    raw.substring(0, 4).toString();
  var ref = db.collection("database2/schedule/lessons").doc(identity);
  ref.update({
    max: document.getElementById("maxNum").value,
    three: document.getElementById("descInp").value,
    title: document.getElementById("titleInp").value,
    start: unParse(document.getElementById("startInp").value),
    end: unParse(document.getElementById("endInp").value),
    day: date,
    ins: document.getElementById("instructorInp").value,
  });
  document.getElementById("modalTitle").innerHTML = "Loading...";
  document.getElementById("modalTime").innerHTML = "Loading...";
  // document.getElementById("modalthree").innerHTML = "Loading...";
  document.querySelector(".modal").classList.toggle("show-modal");
}
function download(file, text) {
  var element = document.createElement("a");
  element.setAttribute("href", text);
  element.setAttribute("download", file);
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
function dwnload() {
  var raw = document
    .getElementById("days-select")
    .value.replaceAll("-", "")
    .toString();
  var date =
    raw.substring(raw.length - 4).toString() +
    raw.substring(2, 2).toString() +
    raw.substring(0, 2).toString();
  var hours1 = document.getElementById("startInp").value.substr(0, 2);
  var mins1 = document.getElementById("startInp").value.substr(3, 2);
  // console.log(mins1);
  var hours2 = document.getElementById("endInp").value.substr(0, 2);
  var mins2 = document.getElementById("endInp").value.substr(3, 2);
  // console.log(mins2);
  var fileName =
    document.getElementById("instructorInp").value +
    " - " +
    document.getElementById("titleInp").value +
    " " +
    date.toString().substr(2, 2) +
    "-" +
    date.toString().substr(0, 2) +
    "-" +
    date.toString().substr(4, 4) +
    "_" +
    parseTime(hours1, mins1) +
    " - " +
    parseTime(hours2, mins2) +
    " Roster.txt";
  var fileContent =
    document.getElementById("titleInp").value +
    // " \r\n" +
    // description +
    "\r\n" +
    date.toString().substr(2, 2) +
    "-" +
    date.toString().substr(0, 2) +
    "-" +
    date.toString().substr(4, 4) +
    ": " +
    parseTime(hours1, mins1) +
    " - " +
    parseTime(hours2, mins2) +
    "\r\n" +
    ((actualDo.match(/\r\n/g) || []).length + 1).toString() +
    " Participant(s)\r\n-----------------------------\n\n☐ " +
    actualDo;
  var myFile = new Blob([fileContent], { type: "text/plain" });
  window.URL = window.URL || window.webkitURL;
  download(fileName, window.URL.createObjectURL(myFile));
}
function addName() {
  var namee = prompt("Enter name of guest to add: First and last name only!");
  var ref = db.collection("database2/schedule/lessons").doc(identity);
  ref.update({
    registered: firebase.firestore.FieldValue.increment(1),
    signedUp: firebase.firestore.FieldValue.arrayUnion(
      "(Guest - " + namee + ")"
    ),
  });
  document.querySelector(".modal").classList.toggle("show-modal");
}
function removeName() {
  var namee = prompt(
    "Enter name of guest to remove: type exactly as it's written!"
  );
  db.collection("database2/schedule/TeeTimes")
    .doc(docIDActive)
    .update({
      registered: firebase.firestore.FieldValue.increment(-1),
      signedUp: firebase.firestore.FieldValue.arrayRemove(
        "(Guest - " + namee + ")"
      ),
    });
  document.querySelector(".modal").classList.toggle("show-modal");
}
document.getElementById("accept").addEventListener("click", write);
document.getElementById("plus").addEventListener("click", () => {
  console.log("plus");
  var maxNum = "<input id='maxNum' type='number'/>";
  var descInp = "<input id='descInp' type='text' value='LESSON'/>";
  var listDays = '<input id="days-select" type="date">';
  var instructor = "<select id='instructorInp'></select>";
  document.getElementById("modalTitle").innerHTML = "Add Lesson";
  document.getElementById("modalTime").innerHTML =
  "<p>Course:</p> <input id='titleInp' type='text'/>" + 
    "<p>Day:</p>" +
    listDays +
    "<p>Start and End Time:</p><input id='startInp' type='time'><input id='endInp' type='time'></br><p>Max Participants:</p>" +
    maxNum +
    "<p>Description:</p>" +
    descInp +
    "<p>Instructor:</p>" +
    instructor;
  for (var i = 0; i < instructorMasterArray.length; i++) {
    var optn = instructorMasterArray[i];
    var el = document.createElement("option");
    el.textContent = optn;
    el.value = optn;
    document.getElementById("instructorInp").appendChild(el);
  }
  document.querySelector(".modal").classList.toggle("show-modal");
  document.getElementById("newSave").style.display = "inline";
  document.getElementById("accept").style.display = "none";
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
document.getElementById("deny").addEventListener("click", () => {
  document.querySelector(".modal").classList.toggle("show-modal");
  document.getElementById("modalTitle").innerHTML = "Loading...";
  document.getElementById("modalTime").innerHTML = "Loading...";
  // document.getElementById("modalthree").innerHTML = "Loading...";
});
document.getElementById("del").addEventListener("click", () => {
  db.collection("database2/schedule/lessons")
    .doc(docIDActive)
    .delete()
    .then(function () {
      console.log("Document successfully deleted!");
      document.querySelector(".modal").classList.toggle("show-modal");
      document.getElementById("modalTitle").innerHTML = "Loading...";
      document.getElementById("modalTime").innerHTML = "Loading...";
    })
    .catch(function (error) {
      console.error("Error removing document: ", error);
    });
});
// function deleteAtPath(path) {
//   var deleteFn = firebase.functions().httpsCallable('recursiveDelete');
//   deleteFn({ path: path })
//       .then(function(result) {
//           logMessage('Delete success: ' + JSON.stringify(result));
//       })
//       .catch(function(err) {
//           logMessage('Delete failed, see console,');
//           console.warn(err);
//       });
// }
// document.getElementById("delTT").addEventListener("click", () => {
//   deleteAtPath("database2/schedule/TeeTimes");
// });
// document.getElementById("delLesson").addEventListener("click", () => {
//   deleteAtPath("database2/schedule/lessons");
// });
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
var actualDo = "none";
var docIDActive = "";
var instructorMasterArray = [];
db = firebase.firestore();

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    loginFrame.style.display = "none";
    navBar.style.display = "flex";
    email = user.email;
    var modal = document.querySelector(".modal");
    // var trigger = document.querySelector(".trigger");
    var closeButton = document.querySelector("#close-button");

    function toggleModal() {
      modal.classList.toggle("show-modal");
    }

    function windowOnClick(event) {
      if (event.target === modal) {
        toggleModal();
      }
    }

    // trigger.addEventListener("click", toggleModal);
    closeButton.addEventListener("click", toggleModal);
    window.addEventListener("click", windowOnClick);
    // initCalendarStructure();
    db.collection("admin")
      .doc("instructorList")
      .get()
      .then((doc) => {
        instructorMasterArray = doc.data().instructors;
        initCalendar();
      })
      .catch((ee) => {
        console.log("couldn't contact database");
      });

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
          // console.log(currentUser.user.email);
          db.collection("admin")
            .doc("main")
            .get()
            .then((doc) => {
              if (doc.data()[currentUser.user.email]) {
                window.location.href = "/lessons";
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
          // User successfully signed in.
          // Return type determines whether we continue the redirect automatically
          // or whether we leave that to developer to handle.
          // return true;
        },
        uiShown: function () {
          // The widget is rendered.
          // Hide the loader.
          // document.getElementById("loader").style.display = "none";
        },
      },
      // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
      signInFlow: "popup",
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

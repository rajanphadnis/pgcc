var getOptions = {
  source: "cache",
};
var errorMessage = "Sorry, It's On Our End!";
var loginFrame = document.getElementById("sign-inDiv");
var mainContent = document.getElementById("MainContent");
var navBar = document.getElementById("navigation");
var tabbedColor = "#616161";
var themeColor = "#096F38";
var db;
var email;
var identity;
var cardDateCurrent;
var activePane = 0;
var name;
var infoModal = document.querySelector(".modal2");
var modal = document.querySelector(".modal");
var maxWeeksToShow = 5;
function getMonday(d) {
  // console.log(d);
  d = new Date(d);
  // console.log(d);
  var day = d.getDay();
  // console.log(day);
  var diff = d.getDate() - day + (day == 0 ? -6 : 1);
  // console.log(diff);
  return new Date(d.setDate(diff - 1));
}
function clearCalendar() {
  var items = "";
  for (var chunk = 0; chunk < maxWeeksToShow; chunk++) {
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
  for (var chunk = 0; chunk < maxWeeksToShow; chunk++) {
    var other = "";
    for (var calendarDay = 0; calendarDay < 7; calendarDay++) {
      var num = calendarDay + chunk * 7;
      var dayOne = getMonday(new Date());
      // console.log(dayOne);
      var tomorrow = new Date(dayOne);
      // console.log(tomorrow);
      tomorrow.setDate(tomorrow.getDate() + num);
      // console.log(tomorrow);
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
  db.collection("database2/schedule/TeeTimes")
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
          doc.data().registered
        );
        // overflow(doc.data().day);
      });
    });
}
function addEvent(title, index, time, time2, id, array, max, regis) {
  var exists = false;
  var available = true;
  try {
    if (array.indexOf("(" + name + ") " + email) != -1) {
      exists = true;
    }
  } catch (err) {
    // console.log("user is not registered for event");
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
  // console.log(formattedTime2);
  var div = document.createElement("div");
  var spotsLeft;
  var originalString = array;
  var newThng = [];
  var nameString = "";
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
  if (newThng.length > 0) {
    nameString = "Students: " + newThng.join(", ") + "</br>";
  }
  try {
    spotsLeft = max - array.length;
  } catch (err) {
    spotsLeft = max;
  }
  if (exists && available) {
    div.innerHTML =
      title +
      "</br>" +
      parseTime(hours, minutes.substring(minutes.length, minutes.length - 2)) +
      " - " +
      parseTime(
        hours2,
        minutes2.substring(minutes2.length, minutes2.length - 2)
      ) +
      "</br>" +
      nameString +
      spotsLeft +
      " spot(s) left</br><button class='reg' onclick='unRegister(&quot;" +
      id +
      "&quot;);' id='" +
      id +
      "'>Unregister</button>";
  } else if (!exists && available) {
    div.innerHTML =
      title +
      "</br>" +
      parseTime(hours, minutes.substring(minutes.length, minutes.length - 2)) +
      " - " +
      parseTime(
        hours2,
        minutes2.substring(minutes2.length, minutes2.length - 2)
      ) +
      "</br>" +
      nameString +
      spotsLeft +
      " spot(s) left</br><button class='reg' onclick='register(&quot;" +
      id +
      "&quot;);' id='" +
      id +
      "'>Register</button>";
  } else if (!exists && !available) {
    div.innerHTML =
      title +
      "</br>" +
      parseTime(hours, minutes.substring(minutes.length, minutes.length - 2)) +
      " - " +
      parseTime(
        hours2,
        minutes2.substring(minutes2.length, minutes2.length - 2)
      ) +
      "</br>" +
      nameString +
      "</br><button class='reg' onclick='register(&quot;" +
      id +
      "&quot;);' id='" +
      id +
      "' disabled>Full</button>";
  } else if (exists && !available) {
    div.innerHTML =
      title +
      "</br>" +
      parseTime(hours, minutes.substring(minutes.length, minutes.length - 2)) +
      " - " +
      parseTime(
        hours2,
        minutes2.substring(minutes2.length, minutes2.length - 2)
      ) +
      "</br>" +
      nameString +
      spotsLeft +
      " spot(s) left</br><button class='reg' onclick='unRegister(&quot;" +
      id +
      "&quot;);' id='" +
      id +
      "'>Unregister</button>";
  }
  div.className = "card";
  try {
    document.getElementById("day" + index).appendChild(div);
  } catch (err) {
    // console.log("index out of range");
  }
}
function unRegister(iden) {
  if (confirm("Do you want to unregister for this event?")) {
    var dayOne = new Date();
    var tomorrow = new Date(dayOne);
    tomorrow.setDate(tomorrow.getDate() + 1);
    var ref = db.collection("database2/schedule/TeeTimes").doc(iden);
    ref.get().then((doc) => {
      // ga('send', 'event', 'data', 'get', email);
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
function register(iden) {
  document.querySelector(".modal").classList.toggle("show-modal");
  document.getElementById("accept").disabled = true;
  var docRef = db.collection("database2/schedule/TeeTimes").doc(iden);
  var dayOne = new Date();
  var tomorrow = new Date(dayOne);
  tomorrow.setDate(tomorrow.getDate() + 1);
  docRef
    .get()
    .then(function (doc) {
      if (doc.exists) {
        var date = new Date(doc.data().start * 1000);
        var hours = date.getHours().toString().padStart(2, "0");
        var minutes = date.getMinutes().toString().padStart(2, "0");
        var formattedTime = hours + ":" + minutes.substr(-2);
        var date2 = new Date(doc.data().end * 1000);
        var hours2 = date2.getHours();
        var minutes2 = "0" + date2.getMinutes();
        var formattedTime2 = hours2 + ":" + minutes2.substr(-2);
        var originalString = doc.data().signedUp;
        var newThng = [];
        var day =
          doc.data().day.substr(2, 2) +
          "/" +
          doc.data().day.substr(0, 2) +
          "/" +
          doc.data().day.substr(4, 4);
        var dat =
          doc.data().day.substr(4, 4) +
          "-" +
          doc.data().day.substr(2, 2) +
          "-" +
          doc.data().day.substr(0, 2);
        var cardDate = Date.parse(dat + "T" + hours + ":" + minutes + ":00");
        console.log(cardDate);
        try {
          originalString.forEach((name) => {
            var regExp = /\(([^)]+)\)/;
            var matches = regExp.exec(name);
            // console.log(matches[1]);
            newThng.push(matches[1]);
          });
        } catch (err) {
          console.log("user isn't registered for event");
        }
        document.getElementById("modalTitle").innerHTML =
          "<h1>Tee Time</h1><h3>@ " + doc.data().title + "</h3>";
        document.getElementById("modalTime").innerHTML =
          day +
          "</br></br>Lesson Time: " +
          parseTime(
            hours,
            minutes.substring(minutes.length, minutes.length - 2)
          ) +
          " - " +
          parseTime(
            hours2,
            minutes2.substring(minutes2.length, minutes2.length - 2)
          );
        document.getElementById("modalthree").innerHTML =
          "<p>Description: " +
          doc.data().three +
          "</p><p>Golfer(s): " +
          (newThng.join(", ") == ""
            ? "None yet - but you could be the first!"
            : newThng.join(", ")) +
          "</p>";
        var tom = tomorrow.getTime() / 1000;
        var cardD = cardDate.getTime() / 1000;
        identity = iden;
        cardDateCurrent = cardD;
        document.getElementById("accept").disabled = false;
        document.getElementById("accept").style.display =
          cardD < tom ? "none" : "inline-block";
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
  var dayOne = new Date();
  var tomorrow = new Date(dayOne);
  tomorrow.setDate(tomorrow.getDate() + 1);
  var ref = db.collection("database2/schedule/TeeTimes").doc(identity);
  var cardD = cardDateCurrent;
  var tom = tomorrow.getTime() / 1000;
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
  document.querySelector(".modal").classList.toggle("show-modal");
  document.getElementById("modalTitle").innerHTML = "Loading...";
  document.getElementById("modalTime").innerHTML = "Loading...";
  document.getElementById("modalthree").innerHTML = "Loading...";
}
// function overflow(dayToCheck) {
//   db.collection("database2/schedule/TeeTimes")
//     .where("day", "==", dayToCheck)
//     .orderBy("start", "asc")
//     .onSnapshot(function (querySnapshot) {
//       var main = [];
//       var maxAr = [];
//       var registeredAr = [];
//       var signedUpAr = [];
//       querySnapshot.forEach(function (doc) {
//         if (doc.data().max != doc.data().registered) {
//           main.push(doc.id);
//           maxAr.push(doc.data().max);
//           registeredAr.push(doc.data().registered);
//           signedUpAr.push(doc.data().signedUp);
//         }
//       });
//       var exists = false;
//       var available = true;
//       try {
//         if (signedUpAr[0].indexOf("(" + name + ") " + email) != -1) {
//           exists = true;
//         }
//       } catch (err) {
//         console.log(err);
//         exists = false;
//       }
//       if (maxAr[0] == registeredAr[0]) {
//         available = false;
//       } else {
//         available = true;
//       }
//       try {
//         if (exists && available) {
//           document.getElementById(main[0]).disabled = false;
//           document.getElementById(main[0]).innerText = "Unregister";
//         } else if (!exists && available) {
//           document.getElementById(main[0]).disabled = false;
//           document.getElementById(main[0]).innerText = "Register";
//         } else if (!exists && !available) {
//           document.getElementById(main[0]).disabled = true;
//           document.getElementById(main[0]).innerText = "Full";
//         } else if (exists && !available) {
//           document.getElementById(main[0]).disabled = false;
//           document.getElementById(main[0]).innerText = "Unregister";
//         }
//       } catch (err) {
//         console.log("last item not fully registered event");
//       }
//       console.log(main);
//       main.slice(1).forEach((item) => {
//         try {
//           console.log("closed");
//           document.getElementById(item).innerText = "Closed";
//           document.getElementById(item).disabled = true;
//         } catch (err) {
//           console.log("couldn't add closed tag");
//         }
//       });
//       // console.log("Current cities in CA: ", cities.join(", "));
//     });
// }
function nextWeek() {
  if (activePane != maxWeeksToShow - 1) {
    document.getElementById("previous").disabled = false;
    document.getElementById("week" + activePane).style.display = "none";
    activePane = activePane + 1;
    document.getElementById("week" + activePane).style.display = "flex";
    if (activePane == maxWeeksToShow - 1) {
      // console.log("done");
      document.getElementById("next").disabled = true;
    } else {
      document.getElementById(
        "week" + (activePane + 1).toString()
      ).style.display = "none";
    }
  } else {
    console.log("plus not possible");
  }
}
function previousWeek() {
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
}
document.getElementById("accept").addEventListener("click", write);
document.onkeydown = checkKey;
document.getElementById("infoButton").addEventListener("click", () => {
  document.querySelector(".modal2").classList.toggle("show-modal2");
  // document.getElementById("newSave").style.display = "inline";
  // document.getElementById("accept").style.display = "none";
});
window.addEventListener("click", windowOnClick);
document.getElementById("close-button2").addEventListener("click", () => {
  document.querySelector(".modal2").classList.toggle("show-modal2");
});
document.getElementById("close-button").addEventListener("click", () => {
  document.querySelector(".modal").classList.toggle("show-modal");
});
document.getElementById("deny").addEventListener("click", () => {
  document.querySelector(".modal").classList.toggle("show-modal");
  document.getElementById("modalTitle").innerHTML = "Loading...";
  document.getElementById("modalTime").innerHTML = "Loading...";
  document.getElementById("modalthree").innerHTML = "Loading...";
});
document.getElementById("previous").addEventListener("click", () => {
  previousWeek();
});
document.getElementById("next").addEventListener("click", () => {
  nextWeek();
});
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
function checkKey(e) {
  e = e || window.event;
  if (e.keyCode == "37") {
    // left arrow
    previousWeek();
  } else if (e.keyCode == "39") {
    // right arrow
    nextWeek();
  }
}
db = firebase.firestore();
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    loginFrame.style.display = "none";
    navBar.style.display = "flex";
    email = user.email;
    name = user.displayName;
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
  }
});

function toggleMoreInfo() {
  if (document.getElementById("moreInfoDiv").style.display == "none") {
    document.getElementById("moreInfo").innerHTML = "Less &and;";
    document.getElementById("moreInfoDiv").style.display = "inline-block";
    document.getElementById("vNum").innerHTML =
      dataCacheName + " cache: " + cacheName;
  } else {
    document.getElementById("moreInfo").innerHTML = "More &or;";
    document.getElementById("moreInfoDiv").style.display = "none";
  }
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js").then(function (reg) {
    console.log("Service Worker Registered");
    console.log(reg);

    document.getElementById("updateCheck").addEventListener("click", () => {
      console.log("checking for updates");
      reg.update().then(() => {
        console.log("Service Worker Updated");
        alert("If there were any available updates, they've been downloaded.");
        window.location = "/";
      });
    });
  });
}

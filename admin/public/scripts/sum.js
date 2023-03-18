var db = firebase.firestore();
var currentlySelectedEventOption = "lessonsOption";
var currentlySelectedDateOption = "tomorrow";
var pathToSearch = "database2/schedule/lessons";

document.getElementById("tomorrow").classList.add("selectedDateButton");
document.getElementById("lessonsOption").classList.add("selectedEventButton");

function toggleDateRadioButtons(clickedButton) {
  document.getElementById("today").classList.remove("selectedDateButton");
  document.getElementById("tomorrow").classList.remove("selectedDateButton");
  document.getElementById("custom").classList.remove("selectedDateButton");
  document.getElementById(clickedButton).classList.add("selectedDateButton");
  currentlySelectedDateOption = clickedButton;
}
function toggleEventRadioButtons(clickedButton) {
  document
    .getElementById("lessonsOption")
    .classList.remove("selectedEventButton");
  document.getElementById("ttOption").classList.remove("selectedEventButton");
  document.getElementById(clickedButton).classList.add("selectedEventButton");
  currentlySelectedEventOption = clickedButton;

  if (clickedButton == "lessonsOption") {
    document.getElementById("pullEvents").innerHTML = "Search Lessons";
    pathToSearch = "database2/schedule/lessons";
  } else {
    document.getElementById("pullEvents").innerHTML = "Search Tee Times";
    pathToSearch = "database2/schedule/TeeTimes";
  }
}

document.getElementById("today").addEventListener("click", () => {
  toggleDateRadioButtons("today");
});
document.getElementById("tomorrow").addEventListener("click", () => {
  toggleDateRadioButtons("tomorrow");
});
document.getElementById("custom").addEventListener("click", () => {
  toggleDateRadioButtons("custom");
});
document.getElementById("lessonsOption").addEventListener("click", () => {
  toggleEventRadioButtons("lessonsOption");
});
document.getElementById("ttOption").addEventListener("click", () => {
  toggleEventRadioButtons("ttOption");
});
var masterRoster = "";
var tdy = new Date();
var tdy_dd = String(tdy.getDate()).padStart(2, "0");
var tdy_mm = String(tdy.getMonth() + 1).padStart(2, "0"); //January is 0!
var tdy_yyyy = tdy.getFullYear();
tdy = tdy_mm + "/" + tdy_dd + "/" + tdy_yyyy;

var tmrw = new Date();
tmrw.setDate(tmrw.getDate() + 1);
tmrw_dd = String(tmrw.getDate()).padStart(2, "0");
tmrw_mm = String(tmrw.getMonth() + 1).padStart(2, "0"); //January is 0!
tmrw_yyyy = tmrw.getFullYear();
tmrw = tmrw_mm + "/" + tmrw_dd + "/" + tmrw_yyyy;

document.getElementById("today").innerHTML = "Today</br>(" + tdy + ")";
document.getElementById("tomorrow").innerHTML = "Tomorrow</br>(" + tmrw + ")";

document.getElementById("pullEvents").addEventListener("click", () => {
  try {
    document.getElementById("optionSelect").innerHTML = "";
  } catch (er) {
    // nothing
  }

  var searchingDate = false;

  if (currentlySelectedDateOption == "today") {
    searchingDate = tdy.replaceAll("/", "");
  }
  if (currentlySelectedDateOption == "tomorrow") {
    searchingDate = tmrw.replaceAll("/", "");
  }
  if (currentlySelectedDateOption == "custom") {
    if (!document.getElementById("customDateSelect").value) {
      console.log("empty date!");
      searchingDate = false;
    } else {
      var raw = document
        .getElementById("customDateSelect")
        .value.replaceAll("-", "")
        .toString();
      var date =
        raw.substring(raw.length - 2).toString() +
        raw.substring(4, 6).toString() +
        raw.substring(0, 4).toString();
      searchingDate = date;
    }
  }
  if (searchingDate) {
    console.log(searchingDate);
    console.log(currentlySelectedEventOption);
    console.log(pathToSearch);
    var ins = [];
    var users = [];
    var title = [];
    var desc = [];
    var startTime = [];
    var endTime = [];
    db.collection(pathToSearch)
      .where("day", "==", searchingDate)
      .orderBy("start", "asc")
      .get()
      .then((snap) => {
        snap.forEach((doc) => {
          try {
            ins.push(doc.data().ins.toString());
          } catch (errr) {
            // nothing
          }
          users.push(doc.data().signedUp);
          title.push(doc.data().title.toString());
          desc.push(doc.data().three.toString());
          startTime.push(parseTime(doc.data().start).toString());
          endTime.push(parseTime(doc.data().end).toString());
        });
        document.getElementById("optionDiv").style.display = "block";
        queryDataAndCompile(
          ins,
          users,
          title,
          desc,
          startTime,
          endTime,
          currentlySelectedEventOption,
          searchingDate
        );
      });
  }
});

function parseTime(time) {
  var date = new Date(time * 1000);
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  return hours + ":" + minutes.slice(-2);
}

function queryDataAndCompile(
  ins,
  users,
  title,
  desc,
  startTime,
  endTime,
  eventOption,
  date
) {
  if (eventOption == "ttOption") {
    // Compare titles
    document.getElementById("optionDivHeader").innerHTML =
      "Step 3: Select Course:";
    uniqueTitles = [...new Set(title)];
    for (var i = 0; i < uniqueTitles.length; i++) {
      var optn = uniqueTitles[i];
      var el = document.createElement("option");
      el.innerHTML = optn;
      el.value = optn;
      document.getElementById("optionSelect").appendChild(el);
    }
    compileRoster(
      ins,
      users,
      title,
      desc,
      startTime,
      endTime,
      eventOption,
      date,
      document.getElementById("optionSelect").value
    );
    document
      .getElementById("optionSelect")
      .replaceWith(document.getElementById("optionSelect").cloneNode(true));
    document.getElementById("optionSelect").addEventListener("change", () => {
      compileRoster(
        ins,
        users,
        title,
        desc,
        startTime,
        endTime,
        eventOption,
        date,
        document.getElementById("optionSelect").value
      );
    });
    document
      .getElementById("download")
      .replaceWith(document.getElementById("download").cloneNode(true));
    document.getElementById("download").addEventListener("click", () => {
      var myFile = new Blob([masterRoster], { type: "text/plain" });
      window.URL = window.URL || window.webkitURL;
      download(
        document.getElementById("optionSelect").value,
        window.URL.createObjectURL(myFile)
      );
    });
    document
      .getElementById("print")
      .replaceWith(document.getElementById("print").cloneNode(true));
    document.getElementById("print").addEventListener("click", () => {
      var divContents = document.getElementById("right-panel").innerHTML;
      var a = window.open("", "", "height=500, width=500");
      a.document.write("<html>");
      a.document.write("<body>");
      a.document.write(divContents);
      a.document.write("</body></html>");
      a.document.close();
      a.print();
    });
  }
  if (eventOption == "lessonsOption") {
    // compare instructors
    document.getElementById("optionDivHeader").innerHTML =
      "Step 3: Select Instructor:";
    uniqueInstructors = [...new Set(ins)];
    console.log(uniqueInstructors);
    for (var i = 0; i < uniqueInstructors.length; i++) {
      var optn = uniqueInstructors[i];
      var el = document.createElement("option");
      el.textContent = optn;
      el.value = optn;
      document.getElementById("optionSelect").appendChild(el);
    }
    compileRoster(
      ins,
      users,
      title,
      desc,
      startTime,
      endTime,
      eventOption,
      date,
      document.getElementById("optionSelect").value
    );
    document
      .getElementById("optionSelect")
      .replaceWith(document.getElementById("optionSelect").cloneNode(true));
    document.getElementById("optionSelect").addEventListener("change", () => {
      compileRoster(
        ins,
        users,
        title,
        desc,
        startTime,
        endTime,
        eventOption,
        date,
        document.getElementById("optionSelect").value
      );
    });
    document
      .getElementById("download")
      .replaceWith(document.getElementById("download").cloneNode(true));
    document.getElementById("download").addEventListener("click", () => {
      var myFile = new Blob([masterRoster], { type: "text/plain" });
      window.URL = window.URL || window.webkitURL;
      download(
        document.getElementById("optionSelect").value,
        window.URL.createObjectURL(myFile)
      );
    });
    document
      .getElementById("print")
      .replaceWith(document.getElementById("print").cloneNode(true));
    document.getElementById("print").addEventListener("click", () => {
      var divContents = document.getElementById("right-panel").innerHTML;
      var a = window.open("", "", "height=500, width=500");
      a.document.write("<html>");
      a.document.write("<body>");
      a.document.write(divContents);
      a.document.write("</body></html>");
      a.document.close();
      a.print();
    });
  }
}

function compileRoster(
  ins,
  users,
  title,
  desc,
  startTime,
  endTime,
  eventOption,
  date,
  header
) {
  var checkMaster = document.getElementById("optionSelect").value;
  var roster = "";
  var thingToCheck = "";

  if (eventOption == "ttOption") {
    roster = "";
  }
  if (eventOption == "lessonsOption") {
    roster = header + "\r\n-----------------------------\r\n\r\n";
  }

  for (var i = 0; i < title.length; i++) {
    if (eventOption == "ttOption") {
      thingToCheck = title[i];
    }
    if (eventOption == "lessonsOption") {
      thingToCheck = ins[i];
    }
    if (thingToCheck == checkMaster) {
      var description = desc[i];
      var start_time = startTime[i];
      var end_time = endTime[i];
      var userString = "";
      if (users[i] == undefined) {
        userString = "None";
      } else {
        var nameString = "";
        users[i].forEach((userName) => {
          nameString =
            nameString + "☐ " + userName.substring(1).split(")")[0] + "\r\n";
        });
        userString = nameString;
      }
      roster =
        roster +
        title[i] +
        " \r\n" +
        description +
        "\r\n" +
        date.toString().substr(2, 2) +
        "-" +
        date.toString().substr(0, 2) +
        "-" +
        date.toString().substr(4, 4) +
        ": " +
        start_time +
        " - " +
        end_time +
        "\r\n" +
        (userString.match(/\r\n/g) || []).length.toString() +
        " Participant(s)\r\n-----------------------------\r\n" +
        userString +
        "\r\n\r\n\r\n";
    }
  }
  translateToHTML(roster);
  masterRoster = roster;
}

function download(file, text) {
  var element = document.createElement("a");
  element.setAttribute("href", text);
  element.setAttribute("download", file);
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
function translateToHTML(text) {
  document.getElementById("right-panel").innerHTML = text.replaceAll(
    "\r\n",
    "</br>"
  );
}

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
          document.getElementById("loader").style.display = "none";
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
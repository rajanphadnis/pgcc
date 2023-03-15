var loginFrame = document.getElementById("sign-inDiv");
var content = document.getElementById("mainContainer");
var totalIns = 0;
var totalAccess = 0;
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

function newInsEntry(content) {
  var optn = "";
  if (content) {
    optn = content;
  }
  var textBox = document.createElement("input");
  var remove =
    "<button id='insButton" +
    (totalIns + 1) +
    "' onclick='removeIns(" +
    (totalIns + 1) +
    ")'>Delete</button>";
  var div = document.createElement("div");
  var div2 = document.createElement("div");
  div2.innerHTML = remove;
  textBox.type = "text";
  textBox.id = "insTextBox" + (totalIns + 1).toString();
  textBox.value = optn;
  div.classList.add("insDiv");
  div.id = "divIns" + (totalIns + 1);
  div.appendChild(textBox);
  div.appendChild(div2);
  document.getElementById("ins").appendChild(div);
  totalIns += 1;
}

function newAccessEntry(email, active) {
  var optn = "";
  if (email) {
    optn = email;
  }
  var textBox = document.createElement("input");
  var remove =
    "<button id='accessButton" +
    (totalAccess + 1) +
    "' onclick='removeAccess(" +
    (totalAccess + 1) +
    ")'>Delete</button>";
  var div = document.createElement("div");
  var div2 = document.createElement("div");
  div2.innerHTML = remove;
  textBox.type = "text";
  textBox.id = "accessTextBox" + (totalAccess + 1).toString();
  textBox.value = optn;
  div.classList.add("accessDiv");
  div.id = "divAccess" + (totalAccess + 1);
  div.appendChild(textBox);
  div.appendChild(div2);
  document.getElementById("access").appendChild(div);
  totalAccess += 1;
}

function initFirebase() {
  db.collection("admin")
    .doc("instructorList")
    .get()
    .then((doc) => {
      var instructors = doc.data().instructors;
      for (var i = 0; i < instructors.length; i++) {
        newInsEntry(instructors[i]);
      }
    });

  db.collection("admin")
    .doc("main")
    .get()
    .then((doc) => {
      const users = new Map(Object.entries(doc.data()));
      //   totalAccess = users.size;
      users.forEach((val, key) => {
        newAccessEntry(key, val);
      });
    });
}

document.getElementById("addIns").addEventListener("click", () => {
  newInsEntry(false);
});

document.getElementById("addAccess").addEventListener("click", () => {
  newAccessEntry(false, true);
});

function removeAccess(num) {
  div = document.getElementById("divAccess" + num);
  div.parentNode.removeChild(div);
  totalAccess -= 1;
}

function removeIns(num) {
  div = document.getElementById("divIns" + num);
  div.parentNode.removeChild(div);
  totalIns -= 1;
}

initFirebase();

document.getElementById("save").addEventListener("click", () => {
  var ins = [];
  var access = [];
  var batch = db.batch();
  var insRef = db.collection("admin").doc("instructorList");
  var accessRef = db.collection("admin").doc("main");

  for (let i = 1; i <= totalIns; i++) {
    try {
      ins.push(document.getElementById("insTextBox" + i).value);
    } catch (error) {}
  }
  batch.update(insRef, { instructors: ins });
  for (let i = 1; i <= totalAccess; i++) {
    try {
      var firestoreString = {};
      console.log(i);
      var toEdit = document.getElementById("accessTextBox" + i).value;
      access.push(toEdit);
      batch.set(accessRef, {[`${toEdit.toString()}`]: true});
      console.log({[`${toEdit.toString()}`]: true});
    } catch (error) {}
  }
  console.log(ins);
  console.log(access);
  if (confirm("Are you sure you want to save?")) {
    batch.commit().then(() => {
      window.location.href = "/edit.html";
    });
  }
});

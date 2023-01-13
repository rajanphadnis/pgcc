const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
/**
 * Initiate a recursive delete of documents at a given path.
 *
 * The calling user must be authenticated and have the custom "admin" attribute
 * set to true on the auth token.
 *
 * This delete is NOT an atomic operation and it's possible
 * that it may fail after only deleting some documents.
 *
 * @param {string} data.path the document or collection path to delete.
 */
exports.recursiveDelete = functions
    .runWith({
        timeoutSeconds: 540,
        memory: "2GB",
    })
    .https.onCall((data, context) => {
        // Only allow admin users to execute this function.
        if (!(context.auth && context.auth.token && context.auth.token.admin)) {
            throw new functions.https.HttpsError(
                "permission-denied",
                "Must be an administrative user to initiate delete."
            );
        }

        const path = data.path;
        console.log(
            `User ${context.auth.uid} has requested to delete path ${path}`
        );

        // Run a recursive delete on the given document or collection path.
        // The 'token' must be set in the functions config, and can be generated
        // at the command line by running 'firebase login:ci'.
        return firebase_tools.firestore
            .delete(path, {
                project: process.env.GCLOUD_PROJECT,
                recursive: true,
                yes: true,
                token: functions.config().fb.token,
            })
            .then(() => {
                return {
                    path: path,
                };
            });
    });

// 1 of jan,feb,mar,apr,may,jun,jul,aug,sep,oct,nov,dec 00:00
exports.monthlyDelete = functions.pubsub.schedule("1 of jan,feb,mar,apr,may,jun,jul,aug,sep,oct,nov,dec 00:00").onRun(async(context) => {
    const db = admin.firestore();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const teeRef = db.collection("database2/schedule/TeeTimes");
    const lessonsRef = db.collection("database2/schedule/lessons");
    var teeGet = await teeRef.get();
    var lessonsGet = await lessonsRef.get();
    const batch = db.batch();
    const deleteOps = [];
    teeGet.forEach(async (doc) => {
        // console.log("got tees");
        const month = parseInt(doc.data().day.toString().substring(2, 4));
        const year = parseInt(doc.data().day.toString().substring(4, 8));
        if (((month <= currentMonth) && (year <= currentYear)) || (year < currentYear)) {
            // batch.delete(doc.ref);
            deleteOps.push(doc.ref.delete());
            // const res = await db.collection("database2/schedule/TeeTimes").doc(doc.id).delete();
            console.log(`Tee: ${doc.id} - ${month}/${year}`);
        }
        // else {
        //     console.log(`DND Tee: ${doc.id} - ${month}/${year}`);
        // }
    });
    lessonsGet.forEach(async(doc) => {
        // console.log("got lessons");
        const month = parseInt(doc.data().day.toString().substring(2, 4));
        const year = parseInt(doc.data().day.toString().substring(4, 8));
        if (((month <= currentMonth) && (year <= currentYear)) || (year < currentYear)) {
            // batch.delete(doc.ref);
            deleteOps.push(doc.ref.delete());
            // const res = await db.collection("database2/schedule/lessons").doc(doc.id).delete()
            console.log(`lesson: ${doc.id} - ${month}/${year}`);
        }
        // else {
        //     console.log(`DND lessons: ${doc.id} - ${month}/${year}`);
        // }
    });
    return Promise.all(deleteOps);
    // batch.commit().then(() => {
    //     console.log("committed");
    //     return true;
    // });
});
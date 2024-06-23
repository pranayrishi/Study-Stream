import { child, get, getDatabase, ref } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const db = getDatabase();
const dbRef = ref(db);

function fetchAssignments() {
    get(child(dbRef, 'user')).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            console.log(data);
            // Now you can pass this data to the GPT-3 API
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

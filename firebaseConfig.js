import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBDfvh0iCOVaju5QU4xmaDW6TIqOg0DFZs",
    authDomain: "creativetutorials-15936.firebaseapp.com",
    projectId: "creativetutorials-15936",
    storageBucket: "creativetutorials-15936.appspot.com",
    messagingSenderId: "731200604822",
    appId: "1:731200604822:web:6e58a485abda0ea0e990b7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get ref to database services
const db = getDatabase(app);

document.getElementById("assignmentForm").addEventListener('submit', function(e) {
    e.preventDefault();
    set(ref(db, 'user/' + document.getElementById("assignment-title").value), {
        username: document.getElementById("assignment-title").value,
        //email: document.getElementById("email").value,
        //phone: document.getElementById("phone").value,
    });
    alert("Login Successful");
});

async function retrieveData() {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `user`));
    if (snapshot.exists()) {
        console.log(snapshot.val());
        return snapshot.val();
    } else {
        console.log("No data available");
        return {};
    }
}

// Function to send data to the backend
async function sendDataToBackend(data) {
    const response = await fetch('http://localhost:3000/generate-schedule', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ assignments: data })
    });

    const result = await response.json();
    console.log(result.schedule);

    // Send the generated schedule to the Python script
    const confirmation = await fetch('http://localhost:3000/send-schedule', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ schedule: result.schedule })
    });

    const confirmationText = await confirmation.text();
    console.log(confirmationText);
}

// Fetch data when the page loads and send to backend
document.addEventListener('DOMContentLoaded', async () => {
    const data = await retrieveData();
    console.log(data);
    await sendDataToBackend(data);

});

// Send data to the backend to generate the schedule
const response = await fetch('http://localhost:3000/generate-schedule', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ assignments: data })
});

const result = await response.json();
console.log(result.schedule);

// Send the generated schedule to the Python script
const confirmation = await fetch('http://localhost:3000/send-schedule', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ schedule: result.schedule })
});

const confirmationText = await confirmation.text();
console.log(confirmationText);

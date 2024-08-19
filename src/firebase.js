// Import the necessary Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import Firebase Storage

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAFaxjiNwFhGIZjAMGODqW_Cl2sn9yGJMw",
    authDomain: "audirab-44b07.firebaseapp.com",
    databaseURL: "https://audirab-44b07-default-rtdb.firebaseio.com",
    projectId: "audirab-44b07",
    storageBucket: "audirab-44b07.appspot.com",
    messagingSenderId: "337764060105",
    appId: "1:337764060105:web:666bd271b41dce74583618"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);  // Initialize Firebase Storage

// Export the services for use in your app
export { app, auth, db, storage };

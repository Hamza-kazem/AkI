// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAWePaRLXEuztyj2nyPpFzJMmBXw5CsoK0",
    authDomain: "aki-sql-6d4ae.firebaseapp.com",
    projectId: "aki-sql-6d4ae",
    storageBucket: "aki-sql-6d4ae.firebasestorage.app",
    messagingSenderId: "291227896972",
    appId: "1:291227896972:web:31bdd2dd1fe1c12a16ffa9",
    measurementId: "G-Y8PNXV1CBP"
};

// Initialize Firebase
console.log('[INFO] جاري تهيئة Firebase...');
firebase.initializeApp(firebaseConfig);
console.log('[OK] تم تهيئة Firebase App بنجاح');

// Initialize Firebase Auth
const auth = firebase.auth();
console.log('[OK] تم تهيئة Firebase Auth بنجاح');

// Initialize Firestore
const db = firebase.firestore();
console.log('[OK] تم تهيئة Firebase Firestore بنجاح');
console.log('[INFO] Project ID:', firebaseConfig.projectId);

// Export for use in other files
window.firebaseAuth = auth;
window.firebaseDb = db;

console.log('[OK] تم تصدير Firebase للنافذة العامة بنجاح');
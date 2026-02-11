import { initializeApp, getApps } from 'firebase/app'

const firebaseConfig = {
  apiKey: "AIzaSyBDYSWZhjjn_v4qXHReuyUmSk3X3zBcEZU",
  authDomain: "kedup-9rc91.firebaseapp.com",
  projectId: "kedup-9rc91",
  storageBucket: "kedup-9rc91.firebasestorage.app",
  messagingSenderId: "404458695056",
  appId: "1:404458695056:web:146d7953552dba3be7eb15"
}

export const firebaseApp = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0]

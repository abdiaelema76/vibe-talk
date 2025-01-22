import { initializeApp } from "firebase/app";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";


const firebaseConfig = {
  apiKey: "AIzaSyAZ1klvdn8qJV1zGaRFm04978lZuyytv0Y",
  authDomain: "vibe-talk-d70fa.firebaseapp.com",
  projectId: "vibe-talk-d70fa",
  storageBucket: "vibe-talk-d70fa.firebasestorage.app",
  messagingSenderId: "12287180008",
  appId: "1:12287180008:web:066283f7e9fe086990dd5d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);



const signup =  async(username, email, password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth,email, password);
        const user = res.user;
        await setDoc(doc(db, "users", user.uid),{
        id: user.uid,
        username:username.toLowerCase(),
        email,
        name:"",
        avatar:"",
        bio:"Hey there! I am using vibe talk",
        lastSeen:Date.now()
        });
        await setDoc(doc(db, "chats", user.uid),{
            chatData:[]
        });
    }catch (error) {
        console.error(error);
        toast.error(error.code);
    }
}
const  login = async (email,password) =>{
try {
    await signInWithEmailAndPassword(auth, email, password);
    
} catch (error) {
    console.error(error);
    toast.error(error.code);
    
}
}
export {signup,login}
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { createContext, useState } from "react";
import { db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";

export const AppContext = createContext();


const AppContextProvider = (props) =>{
    
    const  navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [chatData, setChatData] = useState(null);

    const loadUserData = async (uid) =>{
        try {
           const  useRef = doc(db,'users',uid)
           const userSnap = await getDoc(useRef);
           const userData = userSnap.data();
           console.log(userData);
           setChatData(userData);
           if(userData.avatar && userData.name){
            navigate('/chat');
           }
           else{
            navigate('/profile');
           }
           await updateDoc(useRef,{
            lastSeen:Date.now()
           });
           setInterval(async ()=>{
            if(auth.chatUser){
                await updateDoc(useRef,{
            lastSeen:Date.now()
           }); 
            }
           },60000)
        } catch (error) {
            
        }
    }


    const value = {
        userData,setUserData,
        chatData,setChatData,
        loadUserData

    }
    return(
        <AppContext.Provider value = {value}>
            {props.children}
        </AppContext.Provider>
    )

}
export default AppContextProvider
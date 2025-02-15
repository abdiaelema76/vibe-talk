import React, { useContext } from "react";
import "./LeftSidebar.css";
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { arrayUnion, collection, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useState } from "react";
import { AppContext } from "../../context/AppContext";
import { doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { getFirestore } from "firebase/firestore";


const LeftSidebar = () => {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const {chatsData} = useContext(AppContext);

  const inputHandler = async (e) => {
    try {
      const input = e.target.value;
      if (input) {
        setShowSearch(true);
        const userRef = collection(db, "users");
        const q = query(userRef, where("username", "==", input.toLowerCase()));
        const querySnap = await getDocs(q);
        if (!querySnap.empty && querySnap.docs[0].id !== userData.id) {
          let userExist =false;
          chatsData.map((user) =>{
            if(user.rId === querySnap.docs[0].data().id){
              userExist = true;
            }
          })
          if(!userExist){
            setUser(querySnap.docs[0].data());

          }
        }
        else{
          setUser(null);
        }
      }
      else{
        setShowSearch(false);
      }
    } catch (error) {}
  }
  const addChat = async () => {
    const messagesRef = collection(db,"messages");
    const chatsRef = collection(db,"chats");
    try {
      const newMessageRef = doc(messagesRef);

      await setDoc(newMessageRef,{
        createAt:serverTimestamp(),
        messages:[]

      })

      await setDoc(doc(chatsRef,userData.id),{
        chatsData:[{
          messageId:newMessageRef.id,
          lastMessage:"",
          rId:user.id,
          updatedAt:Date.now(),
          messageSeen:true
        }]
      })
      
await setDoc(doc(chatsRef,user.id),{
        chatsData:[{
          messageId:newMessageRef.id, 
          lastMessage:"",
          rId:userData.id,
          updatedAt:Date.now(),
          messageSeen:true
        }]
      })

      await updateDoc(doc(chatsRef,user.id),{
        chatsData:arrayUnion({
          messageId:newMessageRef.id,
          lastMessage:"",
          rId:userData.id,
          updatedAt:Date.now(),
          messageSeen:true
        })
      })

      await updateDoc(doc(chatsRef,userData.id),{
        chatsData:arrayUnion({
          messageId:newMessageRef.id,
          lastMessage:"",
          rId:user.id,
          updatedAt:Date.now(),
          messageSeen:true
        })
      })
    } catch (error) {
      toast.error(error.message)
      console.error(error);
    }
  }
  return (
    <div className="ls">
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo} className="logo" />
          <div className="menu">
            <img src={assets.menu_icon} alt="" />
            <div className="sub-menu">
              <p onClick={() => navigate("/profile")}>Edit profile</p>
              <hr />
              <p>Logout</p>
            </div>
          </div>
        </div>
        <div className="ls-search">
          <img src={assets.search_icon} alt="" />
          <input
            onChange={inputHandler}
            type="text"
            placeholder="Search here.."
          />
        </div>
      </div>
      <div className="ls-list">
        {showSearch && user
        ? <div onClick={addChat} className="friends add-user">
          <img src={user.avatar} alt="" />
          <p>{user.name}</p>
        </div>
        : chatsData.map((item, index) => (
          <div key={index} className="friends">
            <img src={item.userData.avatar} alt="" />
            <div>
              <p>{item.userData.name}</p>
              <span>{item.lastMessage}</span>
            </div>
          </div>
        ))
        }
      </div>
    </div>
  );
};

export default LeftSidebar;

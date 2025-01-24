import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Chat from './pages/chat/chat';
import { useEffect } from 'react';
import Login from './pages/login/login';
import ProfileUpdate from './pages/profileUpdate/profileUpdate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import { useContext } from 'react';
import { AppContext } from './context/AppContext';

<script src="http://localhost:8097"></script>
const App = () => {

  const navigate = useNavigate();
  const {loadUserData} = useContext(AppContext);

  useEffect(()=>{
    onAuthStateChanged(auth, async(user)=>{
      if(user){
        navigate('/chat');
        await loadUserData(user.uid);
      }
      else{
        navigate('/');
      }
    })
  },[])

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<ProfileUpdate />} /> 

      </Routes>
    </>
  );
}

export default App;

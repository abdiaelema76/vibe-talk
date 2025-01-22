import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Chat from './pages/chat/chat';
import Login from './pages/login/login';
import ProfileUpdate from './pages/profileUpdate/profileUpdate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

<script src="http://localhost:8097"></script>
const App = () => {
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

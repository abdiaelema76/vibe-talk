import React, { useContext, useEffect } from "react";
import { useState } from "react";
import "./profileUpdate.css";
import assets from "../../assets/assets";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../config/firebase";
import { toast } from "react-toastify";
import upload from "../../lib/upload";
import { AppContext } from "../../context/AppContext";
import { getFirestore } from "firebase/firestore";
import axios from "axios";

const profileUpdate = () => {
  const db = getFirestore();
  const navigate = useNavigate();

  const [image, setimage] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [uid, setUid] = useState("");
  const [prevImage, setPrevImage] = useState("");
  const { setUserData } = useContext(AppContext);

  // Function to upload image to Cloudinary
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "upload"); // Replace with your preset
    formData.append("cloud_name", "de719cntc"); // Replace with your Cloudinary cloud name

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/de719cntc/image/upload", // Replace with your Cloudinary upload URL
        formData
      );
      return response.data.secure_url; // Return the image URL
    } catch (error) {
      console.error("Error uploading image to Cloudinary", error);
      toast.error("Failed to upload image");
      return null;
    }
  };

  const profileUpdate = async (event) => {
    event.preventDefault();
    try {
      if (!prevImage && !image) {
        toast.error("Please upload profile picture");
      }
      const docRef = doc(db, "users", uid);
      if (image) {
        const imageUrl = await uploadToCloudinary(image);
        setPrevImage(imageUrl);
        await updateDoc(docRef, {
          avatar: imageUrl,
          bio: bio,
          name: name,
        });
      } else {
        await updateDoc(docRef, {
          bio: bio,
          name: name,
        });
      }
      const snap = await getDoc(docRef);
      setUserData(snap.data());
      navigate("/chat");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.data().name) {
          setName(docSnap.data().name);
        }
        if (docSnap.data().bio) {
          setBio(docSnap.data().bio);
        }
        if (docSnap.data().avatar) {
          setPrevImage(docSnap.data().avatar);
        }
      } else {
        navigate("/");
      }
    });
  }, []);

  return (
    <div>
      <div className="profile">
        <div className="profile-container">
          <form onSubmit={profileUpdate}>
            <h3>Profile Details</h3>
            <label htmlFor="avatar">
              <input
                onChange={(e) => setimage(e.target.files[0])}
                type="file"
                id="avatar"
                accept=".png, .jpg, .jpeg"
                hidden
              />
              <img
                src={image ? URL.createObjectURL(image) : assets.avatar_icon}
                alt=""
              />
              upload profile image
            </label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              placeholder="Your name"
              required
            />
            <textarea
              onChange={(e) => setBio(e.target.bio)}
              value={bio}
              placeholder="Write profile bio"
              required
            ></textarea>
            <button type="submit">Save</button>
          </form>
          <img
            className="profile-pic"
            src={image ? URL.createObjectURL(image) : prevImage ? prevImage : assets.logo_icon}
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default profileUpdate;

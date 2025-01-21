import React from "react";
import { useState } from "react";
import "./profileUpdate.css";
import assets from "../../assets/assets";

const profileUpdate = () => { 
    const [image,setimage] = useState(false);
  

  return (
    <div>
      <div className="profile">
        <div className="profile-container">
          <form >
            <h3>Profile Details</h3>
            <label htmlFor="avatar">
              <input  onChange={(e)=>setimage(e.target.files[0])} type="file"  id='avatar' accept=".png, .jpg, .jpeg" hidden/>
              <img src={image? URL.createObjectURL(image) : assets.avatar_icon} alt="" />
              upload profile image
            </label>
            <input type="text" placeholder="Your name" required />
            <textarea  placeholder="Write profile bio" required></textarea>
            <button type="submit">Save</button>
          </form>
          <img className="profile-pic" src={image?URL.createObjectURL(image) : assets.logo_icon} alt="" />
        </div>
      </div>
    </div>
  );
}

export default profileUpdate;
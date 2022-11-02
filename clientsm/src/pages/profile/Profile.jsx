import React from 'react'
import './profile.css'
import Topbar from '../../components/topbar/Topbar';
import Sidebar from '../../components/sidebar/Sidebar';
import Feed from '../../components/feed/Feed';
import Rightbar from '../../components/rightbar/Rightbar';
import axios from "axios"
import { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router';
export default function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({})
  const username = useParams().username
  
  //to get any user, not only current user
  useEffect(()=>{
    const fetchUser = async ()=>{
      const res =await axios.get(`/api/users?username=${username}`)
      setUser(res.data)
  
    }
    fetchUser();
  },[username])
  return (
    <>
    <Topbar/>
    <div className="profile">
    <Sidebar/>
    <div className="profileRight">
        <div className="profileRightTop">
            <div className="profileCover">
            <img src={user.coverPicture ? PF+"/post/"+user.coverPicture :`${PF}fCover.png` } alt="" className="profileCoverImg" />
            <img src={user.profilePicture ? PF+"/person/"+user.profilePicture : `${PF}person/noAvatar.png` }  alt="" className="profileUserImg" />
            </div>
            <div className="profileInfo">
                <h4 className="profileInfoName">{user.username}</h4>
                <span className="profileInfoDesc">{user.desc}</span>
            </div>
        </div>
        <div className="profileRightBottom">
            <Feed username= {username} />
            <Rightbar user={user}/>
        </div>
    </div>
  </div>
    
    </>
  )
}

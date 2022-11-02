import React from 'react'
import './rightbar.css'
import Online from '../online/Online'
import { useEffect } from 'react';
import { useState } from 'react';
import axios from "axios"
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Add, Remove ,Celebration, Cake } from '@mui/icons-material';


export default function Rightbar({user}) {
  const {user:currentUser, dispatch} = useContext(AuthContext)
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends,setFriends] = useState([])
  const uId = user?._id   //<--SOLUTION FOR MALFUNCTIONING HOMERIGHTBAR
  const [followed, setFollowed] = useState(currentUser.followings.includes(uId))

  useEffect(()=> {
    setFollowed(currentUser.followings.includes(uId))
  },[currentUser,uId]);  //it should hsve been [user._id], but instead causing errors
  
  useEffect(()=>{
    const getFriends= async()=>{
      try {
        const friendList = await axios.get(`/api/users/friends/${uId}`)
        setFriends(friendList.data)

      } 
      catch (err) {
        //console.log(err)
      }
    };
    getFriends()
  },[uId])    //it should hsve been [user._id], but instead causing errors; IT CAN ALSO BE JUST user 
    
  const handleClick = async()=>{
      try {
        if(followed){
          await axios.put("/api/users/" + uId + "/unfollow",{userId: currentUser._id})
          dispatch({type:"UNFOLLOW" ,payload:uId})
        }else{
          await axios.put("/api/users/" + uId + "/follow",{userId: currentUser._id})
          dispatch({type:"FOLLOW" ,payload:uId})
        }
      } catch (err) {
        console.log(err)
      }
      setFollowed(!followed)
  }
        
  const HomeRightbar = ()=>{
    return(
      <>
        <div className="birthdayContainer">
          <Cake style={{color:"#FFA1CF"}}/>
          <Celebration style={{color:"#FFD384"}}/>
           <span className="birthdayText">
            <b>Rick Grimes</b> and <b>3 other friends</b> have birthday today.
          </span>
        </div>
        <img src={PF+"kfcad.jpg"} alt="" className="rightbarAd" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <Online/>
      </>
    )
  }
 
  
  const ProfileRightbar =()=>{
    
    return(
      <>
      {user.username !== currentUser.username && (
        <button className="rightbarFollowButton"
        onClick={handleClick}>
          {followed ? "Unfollow" : "Follow"}
          {followed ? <Remove/> : <Add/>}
        </button>
      )}
    <h4 className='rightbarTitle'>User Information</h4>
    <div className="rightbarInfo">
      <div className="rightbarInfoItem">
        <span className="rightbarInfoKey">City:</span>
        <span className="rightbarInfoValue">{user.city}</span>
      </div>
      <div className="rightbarInfoItem">
        <span className="rightbarInfoKey">From:</span>
        <span className="rightbarInfoValue">{user.from}</span>
      </div>
      <div className="rightbarInfoItem">
        <span className="rightbarInfoKey">Relationship:</span>
        <span className="rightbarInfoValue">{user.relationship === 1 ? "Single" 
        :user.relationship ===2 ? "Married" : ""}</span>
      </div>
    </div>
    <h4 className="rightbarTitle">User Friends</h4>
    <div className="rightbarFollowings">
      {friends.map((friend)=>(
          <Link to={`/profile/${friend.username}`} style={{textDecoration:"none"}}>
            <div className="rightbarFollowing">
            <img src={friend.profilePicture ? (PF+"person/"+friend.profilePicture) : (PF + "person/noAvatar.png")} 
            alt="" className="rightbarFollowingImg" />
            <span className="rightbarFollowingName">{friend.username}</span>
          </div>
          </Link>
      ))}
      
      
    </div>
    </>
    )
  }

  return (
    <div className='rightbar'>
      <div className="rightbarWrapper">
         {user ? <ProfileRightbar/> : <HomeRightbar/>} 
      </div>
    </div>
  )
}

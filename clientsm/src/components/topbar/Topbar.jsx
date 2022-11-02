import React from 'react'
import './topbar.css'
import {Search,Settings,Person,Chat,Notifications} from "@mui/icons-material";
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import {AuthContext} from "../../context/AuthContext"
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Select from 'react-select';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Navigate } from "react-router-dom";

export default function Topbar() {
  const {user ,dispatch} = useContext(AuthContext)
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [frndDetails, setFrndDetails] = useState([])
  const [friend, setFriend] = useState("")

  const handleLogout =()=>{
    dispatch({type:"LOGOUT"})
  }
  const aquaticCreatures = [
    { label: 'Shark', value: 'Shark' },
    { label: 'Dolphin', value: 'Dolphin' },
    { label: 'jith', value: 'jith' },
    { label: 'Octopus', value: 'Octopus' },
    { label: 'strell', value: 'strell' },
    { label: 'Lobster', value: 'Lobster' },
  ];
  useEffect(()=>{
    const getFollowings = async()=>{
      try {
        const res = await axios.get("/api/users/friends/" + user._id)
        setFrndDetails(res.data)
        console.log(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    getFollowings()
  },[])
  const frndNames = frndDetails.map((f)=> ({label: f.username, value: f.username}) )
 
  console.log(frndNames)
  return (
    <div className='topbarContainer'>
        <div className="topbarLeft">
          <Link to="/" style={{textDecoration:"none"}}>
          <span className='logo'>SocialMedia</span>
          </Link>
        </div>
        <div className="topbarCenter">
          <div className="searchbar">
              
              <Select className="searchInput" placeholder={'Search for friends,posts or videos'}
               options={frndNames}
               onChange={opt => setFriend(opt.value)}/>
               <Link to={friend && `/profile/${friend}`} style={{color:"inherit"}}>
              <Search className='searchIcon'/>
              </Link>

          </div>
        </div>
        <div className="topbarRight">
          <div className="topbarLinks">
            <Link style={{textDecoration:"none", color:"inherit"}} to="/">
            <span className="topbarLink">Homepage</span>
            </Link>
            <Link style={{textDecoration:"none", color:"inherit"}} to={`/profile/${user.username}`}>
            <span className="topbarLink">Profile</span>
            </Link>
            
          </div>
          <div className="topbarIcons">
            <div className="topbarIconItem">
              <Person/>
              <span className="topbarIconBadge">1</span>
            </div>
            <div className="topbarIconItem">
              <Link style={{color:'inherit'}} to="/messenger">
              <Chat/>
              <span className="topbarIconBadge">2</span>
              </Link>
            </div>
            <div className="topbarIconItem">
              <Notifications/>
              <span className="topbarIconBadge">3</span>
            </div>
            <div className="topbarIconItem">
            <DropdownButton id="dropdown-basic-button" size='sm' >
            <Dropdown.Item href="">Settings</Dropdown.Item>
            <Dropdown.Item href="">Favorites</Dropdown.Item>
            <Dropdown.Item href="" onClick={handleLogout}>Logout</Dropdown.Item>
            </DropdownButton> 
              
            </div>
          </div>
          <Link to={`/profile/${user.username}`} >
          <img src={user.profilePicture ? PF+"/person/"+user.profilePicture : `${PF}person/noAvatar.png` } alt="" className="topbarImg" />
          </Link>
        </div>
    </div>
  )
}

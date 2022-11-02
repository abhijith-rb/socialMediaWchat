import {React, useContext,useRef,useEffect} from 'react'
import "./online.css"
import { AuthContext } from '../../context/AuthContext';
import { useState } from 'react';
import {io} from "socket.io-client"
import axios from 'axios';


export default function Online() {
  const {user} = useContext(AuthContext)
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  
  console.log()
  
  return (
    <div>
        
            <li className="rightbarFriend" >
            <div className="rightbarProfileImgContainer">
              <img src={(PF+"/person/noAvatar.png") } 
              alt="" className="rightbarProfileImg" />
              <span className="rightbarOnline"></span>
            </div>
            <span className="rightbarUsername"></span>
        </li>
        
      
        
    </div>
  )
}

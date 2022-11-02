import React, { useContext } from 'react'
import './message.css'
import {format} from "timeago.js"
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
import { useEffect } from 'react'
import { useState } from 'react'

export default function Message({message,own,recId}) {
  const {user} = useContext(AuthContext)
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [receiver,setReceiver] = useState(null)
 
  useEffect(()=>{
    const getReceiver = async()=>{
      try {
        const res = await axios.get("/api/users?userId=" + recId)
        //console.log(res.data)
        setReceiver(res.data)
      } catch (err) {
        console.log(err)
      }
  }
  getReceiver()
  },[recId])
  //console.log(receiver)
  return (
    <div className={own ? "message own" : "message"}>
       <div className="messageTop">
       <img src={own ? (user?.profilePicture ? PF + "/person/" + user.profilePicture : PF + "/person/noAvatar.png") 
       : (receiver?.profilePicture ? PF + "/person/" + receiver.profilePicture : PF + "/person/noAvatar.png")} 
       alt="" className="messageImg" />
       <p className='messageText'>
        {message.text}
       </p>
       </div>
       <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  )
}

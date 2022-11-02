import React, { useRef } from 'react'
import './share.css'
import {PermMedia,Label,Room,EmojiEmotions, Cancel} from "@mui/icons-material"
import { useEffect } from 'react';
import axios from "axios"
import { useState } from 'react';
import { useContext } from 'react';
import {AuthContext} from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Share() {
    const {user} = useContext(AuthContext)
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const desc = useRef()
    const[file,setFile] = useState(null)

    const submitHandler = async(e)=>{
        e.preventDefault()
        const newPost = {
            userId: user._id,
            desc: desc.current.value,
        }
        if(file){
            const data = new FormData();
            const filename = Date.now() + file.name;
            data.append("name", filename);
            data.append("file", file);
            newPost.img = filename;
            try {
                await axios.post("/api/upload", data)

            } catch (err) {
                console.log(err)
            }
        }
        try {
           const res = await axios.post("/api/posts", newPost)
           window.location.reload()  //or create a post context and update post state
        } catch (err) {
            
        }
    }
  return (
    <div className='share'>
        <div className="shareWrapper">
            <div className="shareTop">
                <Link to={`/profile/${user.username}`}>
                <img src={user.profilePicture ? PF+'/person/'+user.profilePicture : `${PF}person/noAvatar.png` } 
                alt="" className="shareProfileImg" />
                </Link>
                <input placeholder={"what's in your mind "+ user.username +" ?"} 
                className="shareInput" ref={desc}/>
            </div>
            <hr className="shareHr" />
            {file && (
                <div className="shareImgContainer">
                    <img src={URL.createObjectURL(file)} alt="" className="shareImg" />
                    <Cancel className='shareCancelImg' onClick={()=> setFile(null)}/>
                </div>
            )

            }
            <form className="shareBottom" onSubmit={submitHandler}>
                <div className="shareOptions">
                    <label htmlFor='file' className="shareOption">
                    <PermMedia htmlColor='tomato' className='shareIcon'/>
                    <span className="shareOptionText">Photo or Video</span>
                    <input type="file" id="file" style={{display:"none"}}
                    accept=".jpg,.jpeg,.png" onChange={(e)=> setFile(e.target.files[0])}/>
                    </label>
                    <div className="shareOption">
                    <Label  htmlColor='blue' className='shareIcon'/>
                    <span className="shareOptionText">Tag</span>
                    </div>
                    <div className="shareOption">
                    <Room  htmlColor='green' className='shareIcon'/>
                    <span className="shareOptionText">Location</span>
                    </div>
                    <div className="shareOption">
                    <EmojiEmotions  htmlColor='goldenrod' className='shareIcon'/>
                    <span className="shareOptionText">Feelings</span>
                    </div>
                </div>
                <button className="shareButton" type='submit'>Share</button>
            </form>
        </div>
    </div>
  )
}

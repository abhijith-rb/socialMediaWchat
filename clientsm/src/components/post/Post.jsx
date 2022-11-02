import React, { useContext } from 'react'
import { useState } from 'react';
import "./post.css";
import { MoreVert, Comment,FavoriteBorder,Favorite} from '@mui/icons-material';
import { useEffect } from 'react';
import axios from "axios"
import { format } from 'timeago.js';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Dropdown from 'react-bootstrap/Dropdown';

export default function Post({post}) {
    const[like,setLike] = useState(post.likes.length);
    const[isLiked,setIsLiked] = useState(false);
    const [user, setUser] = useState({})
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const {user:currentUser} = useContext(AuthContext);
    const [commentBox,setCommentBox] = useState(false)
    const [newComment,setNewComment] = useState("")
    const [comments, setComments] = useState([])
    const [commenters, setCommenters] = useState([])
    const [combo, setCombo] = useState([])

    useEffect(()=>{
        const getComments= async()=>{
            try {
                const res = await axios.get("/api/comments/" + post._id)
                setComments(res.data)
            } catch (err) {
                console.log(err)
            }
        }
        getComments()
    },[post._id])

    useEffect(()=>{
        const getCommenters = async()=>{
            try {
                const res = await axios.get("/api/comments/commenters/" + post._id)
                setCommenters(res.data)
            } catch (err) {
                console.log(err)
            }
        }
        getCommenters()
    },[post._id])
    

    const handleSubmit = async(e)=>{
        e.preventDefault()
        const comment = {
            postId : post._id,
            senderId :currentUser._id,
            text:  newComment,
        }
        try {
            const res = await axios.post("/api/comments" , comment)
            setComments([...comments, res.data])
            setCombo([...combo,{proPic:currentUser.profilePicture,
                userName:currentUser.username,ctext:res.data.text}])
            setNewComment("")
        } catch (err) {
            console.log(err)
        }

    }
    
    const postDelete = ()=>{
        try {
            axios.delete(`/api/posts/${post._id}`,{data:{userId:currentUser._id}})
            window.location.reload()
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        setIsLiked(post.likes.includes(currentUser._id))
    },[post.likes, currentUser._id])
    
    useEffect(()=>{
        const fetchUser = async ()=>{
          const res =await axios.get(`/api/users?userId=${post.userId}`)
          setUser(res.data)
        }
        fetchUser();
      },[post.userId])
    const likeHandler = ()=>{
        try {
                axios.put("/api/posts/"+post._id+"/like", {userId:currentUser._id})
              
        } catch (err) {
            console.log(err)
        }
        setLike(isLiked ? like-1 : like+1)
        setIsLiked(!isLiked)
    }
 
   let commArray =[]
   useEffect(()=>{
    
    const array =()=>{
    for (let i = 0; i < commenters.length; i++) {
                     if(comments[i].senderId === commenters[i]._id){
                   commArray.push({proPic:commenters[i].profilePicture,
                    userName:commenters[i].username,
                     ctext:comments[i].text})  
                   setCombo(commArray)               
             }      
    }}
    array()
   },[commentBox])
   
  console.log(post)
  return (
    <div className='post'>
        <div className="postWrapper">
            <div className="postTop">
                <div className="postTopLeft">
                    <Link to={`/profile/${user.username}`}>
                    <img src={user.profilePicture ? PF+"/person/"+user.profilePicture : `${PF}person/noAvatar.png` } 
                    alt="" className="postProfileImg" />
                    </Link>
                    <span className="postUsername">{user.username}</span>
                    <span className="postDate">{format(post.createdAt)}</span>          
                </div>
                <div className="postTopRight">
                {post.userId === currentUser._id && 
                    <Dropdown>
                    <Dropdown.Toggle variant="secondary" id="dropdown-basic" size="sm">
                    
                    </Dropdown.Toggle>
    
                    <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1">Edit</Dropdown.Item>
                        <Dropdown.Item href="#/action-2">action</Dropdown.Item>
                        <Dropdown.Item onClick={postDelete}>Delete</Dropdown.Item>
                    </Dropdown.Menu>
                    </Dropdown>
                    }
                
                </div>
            </div>
            <div className="postcenter">
                <span className="postText">{post?.desc}</span>
                <img src={post.img && PF +post.img} alt="" className="postImg" />
            </div>
            <div className="postBottom">
                <div className="postBottomLeft">
                    {isLiked ? <Favorite className='likeIcon' onClick={likeHandler} style={{color:"red"}}/>
                    : <FavoriteBorder className='likeIcon' onClick={likeHandler}/>
                    }
                    
                    
                  <span className="postLikeCounter">
                    {like > 0 && (like===1 ? ("1 like") : (like+" likes"))} 

                  </span>
                </div>
                <div className="postBottomRight" onClick={()=> setCommentBox(!commentBox)}>
                    <Comment/>
                </div>
            </div>
            {commentBox && 
                <div className='commentBoxContainer'>
                <hr/>   
                <div className="commentBox">
                  
               {combo.map((c)=>(
                        <div className='commentWrapper'>
                            <div className="proPicDiv">
                                <img src={c.proPic ? PF+"person/"+ c.proPic 
                                : PF+"/person/noAvatar.png"} 
                                alt="" className="proPicture" />
                            </div>
                            <div className="username">
                            <span><b>{c.userName}</b></span>
                            </div>
                            <div className="comment">
                            <p>{c.ctext}</p>
                            </div>
                          <hr/>
                        </div>
                    )

                )}              
                     
                </div>
                <div className="typeBox">
                    <textarea className='typeComment' placeholder='Type your comment...'
                    onChange={(e)=> setNewComment(e.target.value)} value={newComment}></textarea>
                    <button type="button" className='btn btn-success commentSubmitButton' 
                    onClick={handleSubmit}>Send</button>
                    
                </div>

            </div>
            }
            
        </div>
    </div>
  )
}

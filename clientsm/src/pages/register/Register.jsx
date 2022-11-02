import React from 'react'
import './register.css'
import { useRef } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";

export default function Register() {
    const username = useRef()
    const email = useRef()
    const password = useRef()
    const passwordAgain = useRef()
    const navigate = useNavigate();

    const handleClick = async (e)=>{
        e.preventDefault()
        if(passwordAgain.current.value !== password.current.value){
            passwordAgain.current.setCustomValidity("Passwords don't match!")
        }else{
            const user = {
                username: username.current.value,
                email:email.current.value,
                password:password.current.value,
            };
            try {
                await axios.post("/api/auth/register",user)
                navigate("/login")
            } catch (err) {
                console.log(err)
            }
        }

    }

  return (
    <div className='register'>
        <div className="registerWrapper">
            <div className="registerLeft">
                <h3 className="registerLogo">JithBook</h3>
                <span className="registerDesc">Connect with friends on JithBook</span>
            </div>
            <div className="registerRight">
                <form className="registerBox" onSubmit={handleClick}>
                    <input placeholder='Username' type="text" 
                    className="registerInput" ref={username} required/>
                    <input placeholder='Email' type="email" 
                    className="registerInput" ref={email} required/>
                    <input placeholder='Password' type="password" 
                    className="registerInput" ref={password} required minLength="6"/>
                    <input placeholder='Password again' type="password" 
                    className="registerInput" ref={passwordAgain} required minLength="6"/>
                    <button className="registerButton" type='submit'>Sign Up</button>
                    
                    <button className='registerLoginButton'>Log into your account</button>
                </form>
            </div>
        </div>

    </div>
  )
}

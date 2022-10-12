import axios from 'axios'
import React, { useRef } from 'react'
import './register.css';
import { useHistory } from 'react-router-dom';

export default function Register() {
  const username = useRef()
  const email = useRef()
  const password = useRef()
  const passwordAgain = useRef()
  const history = useHistory()

  const handleClick = async(e) => {
    e.preventDefault()
    console.log("clc")
    if(passwordAgain.current.value !== password.current.value){
        passwordAgain.current.setCustomValidity("Password not matched")
    }
    else{
        const user = {
            username : username.current.value,
            email : email.current.value,
            password : password.current.value
        }
        try{
            const response = await axios.post(`http://localhost:8085/api/auth/register`, user)
            console.log("from register::", response.data)
            history.push("/login")         
        }
        catch(err){
            console.log(err)
        }
    }
  } 


  return (
    <div className="register">
      <div className="registerWrapper">
        <div className="registerLeft">
          <h3 className="registerLogo">SocialBethak</h3>
          <span className="registerDesc">
            Connect with friends and the world around you on SocialBethak
          </span>
        </div>

        <div className="registerRight">
         
          <form className="registerBox" onSubmit={handleClick}>
            <input 
                placeholder="Username" 
                className="registerInput"
                required
                ref={username} 
                />
            <input 
                placeholder="Email" 
                type='email'
                className="registerInput"
                required
                ref={email}
                />
            <input 
                placeholder="Password" 
                // type='password'
                className="registerInput" 
                required
                minLength='6'
                ref={password}
                />
            <input 
                placeholder="Password again " 
                className="registerInput" 
                required
                minLength='6'
                ref={passwordAgain}
                />
            
            <button className="registerButton" type='submit'>Sign Up</button>
            <span className="registerForgot">Forgot Password?</span>
            <button className="registerRegisterButton">Log into Account</button>
          </form>

        </div>
      </div>
    </div>
  )
}

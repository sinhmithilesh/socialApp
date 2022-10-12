import React from 'react'
import { useRef } from 'react'
import './login.css'
import { logiCall } from '../apiCalls'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import CircularProgress from '@mui/material/CircularProgress';



/* I am using useRef for my email and password inputs, I can use state as well, but in states, componet will re render on every key press
  so i am just avoiding it */

export default function Login() {
  const email = useRef()
  const password = useRef()
  const { user, isFetching, error, dispatch } = useContext(AuthContext)

  const handleClick = (e) => {
    e.preventDefault()
    logiCall(
      {
        email: email.current.value,
        password: password.current.value,
      },
      dispatch,
    )
  }


  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">SocialBethak</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on SocialBethak
          </span>
        </div>

        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input
              placeholder="Email"
              type="email"
              className="loginInput"
              required
              ref={email}
            />
            <input
              placeholder="Password"
              type="password"
              className="loginInput"
              minLength="6"
              required
              ref={password}
            />
            <button className="loginButton" type='submit' disabled={isFetching}>
               {isFetching ?   <CircularProgress style={{color : "white"}}  /> : 'Login'}
            </button>
            <span className="loginForgot"></span>
            <button className="loginRegisterButton">
                {isFetching ?  "wait.. " : 'Create a New Account'}  
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

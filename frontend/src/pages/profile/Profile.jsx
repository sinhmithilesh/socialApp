import React, {useState, useEffect} from 'react';
import "./profile.css";
import Feed from '../../components/feed/Feed'
import Rightbar from '../../components/rightbar/Rightbar'
import Sidebar from '../../components/sidebar/Sidebar'
import Topbar from '../../components/topbar/Topbar'
import axios from 'axios';
import { useParams } from 'react-router-dom';

/* pass the props to "Rightbar" componet. we are using it for both pages profile and home. in profile page rightbar's content will be 
different and in home page it will have different content. */  

export default function Profile() {

  const [user , setUser] = useState({})
  const PF = process.env.REACT_APP_PUBLIC_FOLDER
  const username = useParams().username

  useEffect(()=>{
    const fetchUser = async() =>{ 
      try{
        const response = await axios.get(`http://localhost:8085/api/users?username=${username}`) 
        if(response){
          setUser(response.data) 
        }
      }
      catch(err){
        console.log(err)
      }    
    }
    fetchUser()
  },[username]) 
  


  return ( 
    <>
    <Topbar/>
    <div className="profile">
      <Sidebar/>
      <div className="profileRight">
            <div className="profileRightTop">
                <div className="profileCover">
                  
                    <img className='profileCoverImg' src={user.coverPicture  ? PF + user.coverPicture   :  PF+"person/noCover.jpg"} alt=""/>
                    <img className='profileUserImg' src={user.profilePicture ? PF + user.profilePicture :  PF+"person/noAvatar.jpg "} alt="" />    
                </div>
                <div className="profileInfo">
                    <h4 className='profileInfoName'>{user ? user.username : ""}</h4>
                    <span className="profileInfoDesc">{user ? user.desc : ""}</span>
                </div>

            </div>
            <div className="profileRightBottom">
                <Feed username={username}/>          
                <Rightbar user={user}/> 
            </div> 
      </div>
    </div>
    </>
  )
}

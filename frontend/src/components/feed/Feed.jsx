import React, {useState, useEffect, useContext} from 'react';
import axios from "axios"
import Post from '../post/Post';
import Share from '../share/Share';
import "./feed.css";
import { AuthContext } from '../../context/AuthContext';
// import {Posts} from "../../dummyData.js"

/* suppose if i am viewing another user or my friend's profile, I can see certain details for usre
but I can not do post from his account. right??   that's why if click on any of my friend, 
share componet should not be visible to me. many more things can be done. right now remember this
*/


export default function Feed({username}) {

  const [posts, setPosts] = useState([])
  const {user} = useContext(AuthContext)

  useEffect(()=>{
    const fethPosts = async() =>{
      try{
        const response = username 
        ? await axios.get("http://localhost:8085/api/posts/profile/" + username)
        : await axios.get("http://localhost:8085/api/posts/timeline/" + user._id )
        if(response){
          setPosts(response.data.sort((p1,p2) => {
            return new Date(p2.createdAt) - new Date(p1.createdAt) // we can do sorting direclty in backend also, but it is okay for now  
          }))
        }
      } 
      catch(err){
        console.log(err)
      }    
    }

    fethPosts()
  },[username, user._id]) 

  return (
    <div className='feed'>
        <div className="feedWrapper">
          
           {(!username  || username === user.username) && <Share/> }  
                   
             {posts.map((post) => (
             <Post key={post._id} post={post}/>
            ))}
            
           
        </div>  
    </div>
  )
}



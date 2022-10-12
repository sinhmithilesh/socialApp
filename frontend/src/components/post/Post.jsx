import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import "./post.css";
import {MoreVert} from '@mui/icons-material/';
import {format} from "timeago.js"
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';


 
export default function Post({post}) {
 
  const [ like, setLike] = useState(post.likes.length)
  const [isLiked, setIsLiked] = useState(false)
  const [user , setUser] = useState({})
  const {user : currentUser} = useContext(AuthContext)
  const PF = process.env.REACT_APP_PUBLIC_FOLDER

  useEffect(()=>{
    setIsLiked(post.likes.includes(currentUser._id))
  },[currentUser._id, post.likes])

  useEffect(()=>{
    const fetchUser = async() =>{ 
      try{
        const response = await axios.get(`http://localhost:8085/api/users?userId=${post.userId}`)
        if(response){
          setUser(response.data) 
        }
      }
      catch(err){
        console.log(err)
      }    
    }
    fetchUser()
  },[post.userId]) 
  

  const likeHandler = async() =>{
    try{
      const response = await axios.put(`http://localhost:8085/api/posts/${post._id}/like`, {userId : currentUser._id})

    }
    catch(err){

    }
    setLike(isLiked ?  like - 1 : like + 1)
    setIsLiked(!isLiked)
  }
  
//   const user = Users.filter( user => user.id === 1)
  
  return (
    <div className='post'>
        <div className="postWrapper">

            <div className="postTop">
                <div className="postTopLeft">
                    <Link to={`profile/${user.username}`}>
                       <img 
                          className='postProfileImg' 
                          src={ user.profilePicture ? PF + user.profilePicture : PF+"person/noAvatar.jpg"} alt='PIC'/>
                    </Link>
                    <span className="postUserName">{user.username}</span>
                    <span className='postDate'>{format(post.createdAt)}</span>
                </div>
                <div className="postTopRight">  
                    <MoreVert className=''/>
                </div>
            </div>



            <div className="postCenter">
                <span className='postText'>{post.desc}</span>
                <img className='postImg' src={PF+post.img} alt=''/>
            </div>



            <div className="postBottom">
                <div className="postBottomLeft">
                    <img className='likeIcon' src={`${PF}like.png`} alt='img' onClick={likeHandler}/>
                    <img className='likeIcon' src={`${PF}heart.png`} alt='img'  onClick={likeHandler}/>
                    <span className='postLikeCounter'>{like}</span>

                </div>
                <div className="postBottomRight">
                    <span className="postCommentText">{post.comment} comments</span>
                </div>

            </div>
        </div>
    </div>
  )
}

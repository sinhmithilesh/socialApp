import React, { useContext, useRef, useState } from 'react';
import axios from 'axios'
import "./share.css";
import {PermMedia, Label, Room, EmojiEmotions, Cancel } from '@mui/icons-material/';
import { AuthContext } from '../../context/AuthContext';


export default function Share() {

    const {user} = useContext(AuthContext)
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const desc = useRef()
    const [file, setFile] = useState(null)


    //when I click on share button 
    const submitHandler = async(e) => {
        e.preventDefault()
        const newPost = {
            userId : user._id,
            desc : desc.current.value
        }
        if(file){   // file is image upload
            const data = new FormData()
            const filename = file.name     //make unique to avoid file name conflict. when users upload file/photo, they may upload with same name co-incidently 
            data.append("file", file)
            data.append("name", filename )
            newPost.img = filename

              
            try{
                await axios.post(`http://localhost:8085/api/upload`, data)
            }
            catch(err){
                console.log(err)
            }
        }
        try{
            await axios.post(`http://localhost:8085/api/posts`, newPost)
            window.location.reload()
        }
        catch(err){
             console.log(err)
        }
    }
 


  return (
    <div className='share'> 
        <div className="shareWrapper">
            <div className="shareTop">
                <img 
                    className='shareProfileImg' 
                    src={user.profilePicture ? PF+user.profilePicture : PF+"person/noAvatar.jpg" } alt="img"/>
                <input 
                    placeholder={"what's in your mind " + user.username + " ?"}
                    className="shareInput"
                    ref={desc}
                     />
            </div> 
           
            <hr className='shareHr'/>

            {file && (
                <div className='shareImgContainer'>
                    <img className='shareImg'  src={URL.createObjectURL(file)} alt=''/>
                    <Cancel className='shareCancel' onClick={()=>setFile(null)}/>
                </div>
            )}

            {/* this below whole form data will be shared as a post */}
           
            <form className="shareBottom" onSubmit={submitHandler}>
                <div className="shareOptions">
                    <label htmlFor='file' className="shareOption"> 
                        <PermMedia htmlColor='tomato' className='shareIcon'/>
                        <span className="shareOptionText">Photo or Video</span>
                        <input 
                            type='file' 
                            style={{display : "none"}}  // i don't want to show "choose file" on UI, lable will do the same 
                            id='file' 
                            accept='.png, .jpeg, .jpg'
                            onChange={(e) => setFile(e.target.files[0])}  // i don't want to choose multiple file, I just want one file for upload
                            />
                    </label>
                    <div className="shareOption"> 
                        <Label  htmlColor='teal' className='shareIcon'/>
                        <span className="shareOptionText">Tag</span>
                    </div>
                    <div className="shareOption"> 
                        <Room  htmlColor='blue' className='shareIcon'/>
                        <span className="shareOptionText">Location</span>
                    </div>
                    <div className="shareOption"> 
                        <EmojiEmotions  htmlColor='goldenrod' className='shareIcon'/>
                        <span className="shareOptionText">mood</span>
                    </div>
                </div>
                <button className="shareButton" type='submit' >Share</button>
            </form>
        </div>
    </div> 
  )
}

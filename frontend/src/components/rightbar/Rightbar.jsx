import React, { useContext, useEffect , useState} from 'react';
import "./rightbar.css";
import {Users} from '../../dummyData';
import Online from '../online/Online';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import AddIcon from '@mui/icons-material/Add';
import { Remove } from '@mui/icons-material';



export default function Rightbar({user}) {

    const {user : currentUser , dispatch } = useContext(AuthContext) // user which is currently logged in
    const [friends , setFriends] = useState([])
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const [followed , setFollowed] = useState(isFriend)
    
    // console.log("current::", currentUser)
   

    function isFriend(){
        if(user){
            const ans = currentUser.following.includes(user._id)
            console.log("ans::", ans)
            return ans;
        }
        else{
            return false
        }
    }

    console.log("followed:", followed)

    // logic for when to show "follow" button. if already following hide the button 
    // useEffect(()=> {
    //     if(user){
    //     setFollowed(currentUser.following.includes(user.id))
    //     }
    // }, [currentUser, user ?  user.id : ""])

    
    
     
   // to show all friends in right bar when user in profile page. it is not for  home page where we have said "online freinds" which need sockets and all those setup, 
   // we will leave that online firends section , in future we will might make it functional, so now just doing for profile page
    useEffect(()=> {
        const getFriends = async() =>{
            try{
                const response = await axios.get(`http://localhost:8085/api/users/friends/${user._id}`)
                setFriends(response.data)
            }
            catch(err){
                console.log(err)   
            }
        }

        getFriends()
            
    }, user ? [user._id] : [])    // in initial rendering it "_id" will not be available from props, so it might throw err. we can simply pass just 'user'


    const handleClick = async() => {
        try{
            if(followed){
                await axios.put(`http://localhost:8085/api/users/${user._id}/unfollow`, {userId : currentUser._id})
                dispatch({type : "UNFOLLOW" , payload : user._id})
         
            }else{
                await axios.put(`http://localhost:8085/api/users/${user._id}/follow`, {userId :  currentUser._id})
                dispatch({type : "FOLLOW" , payload : user._id})    
            }

        }
        catch(err){
            console.log(err )
        }
        setFollowed(!followed)
    }



    const HomeRightbar = () => {
        return (
            <>
                <div className="birthdayContainer">
                    <img className='birthdayImg' src='/assets/gift.png' alt="img"/>
                    <span className="birthdayText">
                        <b>Raju don</b> and <b>2 others freinds</b> have birthday today
                    </span>
                </div>
                <img className='rightbarAd' src='/assets/ad.png' alt=''/>
                <h4 className="rightbarTitle">Online Friends</h4>
                <ul className="rightbarFriendList">

                    {
                    Users.map(user => (
                        <Online key={
                                user.id
                            }
                            user={user}/>
                    ))
                } </ul>
            </>
        )
    };



    const ProfileRightBar = () => {
        return (<>

            {user.username !== currentUser.username &&  (
                <button className='rightbarFollowButton' onClick={handleClick}>
                    {followed ? "unfollow" : "Follow"}
                    {followed ? <Remove/>  : <AddIcon/> }
                </button> 
            )}

            <h4 className="rightbarTitle">User Information</h4>

            <div className="rightbarInfo">
                <div className="rightbarInfoItem">
                    <span className="rightbarInfoKey">City:</span>
                    <span className="rightbarInfoValue">{user ? user.city : ""}</span>
                </div>
                <div className="rightbarInfoItem">
                    <span className="rightbarInfoKey">From :</span>
                    <span className="rightbarInfoValue">{user ? user.from : ""}</span>
                </div>
                <div className="rightbarInfoItem">
                    <span className="rightbarInfoKey">Relationship :</span>
                    <span className="rightbarInfoValue">{user.relationship === 1 ? "Single" : user.relationship  === 1 ? "Married" : "- "}</span>
                </div>
            </div>

            <h4 className="rightbarTitle">User Friends</h4>
            <div className="rightbarFollowings">


                {friends.map(friend => (
                
                <Link to={`/profile/${friend.username}`} style={{textDecoration:"none"}}>
               
                <div key={friend._id} className="rightbarFollowing">
                    <img 
                        className="rightbarFollowingImg" 
                        src={friend.profilePicture ? PF+friend.profilePicture : PF+"person/noAvatar.jpg"} alt=""
                        />
                    <span className="rightbarFollowingName">{friend ? friend.username : ""}</span>
                </div>  

                </Link>
             
                ))} 

            </div>

        </>
        )
             }
                
        
        
        return (

        <div className='rightbar '>
            <div className="rightbarWrapper">
                {user ? <ProfileRightBar/> :  <HomeRightbar/>}
            </div>
        </div>
       
        )
                
                    
}

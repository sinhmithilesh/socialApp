import React from 'react'
import "./home.css"
import Feed from '../../components/feed/Feed'
import Rightbar from '../../components/rightbar/Rightbar'
import Sidebar from '../../components/sidebar/Sidebar'
import Topbar from '../../components/topbar/Topbar'

/*
we are calling RightBar in Profile page also, we want to display Rightbar with some changes. so we are provinding it a prop
but we are also calling Rightbar in home page. If u will see her in home page, we are not passing any prop. If Rightbar recieves
a prop means it is in profile page, it no prop means simply home page.
*/

export default function Home() {
  return (
    <>
    <Topbar/>
    <div className="homeContainer">
      <Sidebar/>
      <Feed/>
      <Rightbar /> 
    </div>
    </>
  )
}
  
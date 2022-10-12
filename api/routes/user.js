const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const fs = require('fs')
const User = require('../models/user')
const { json } = require('express')
const user = require('../models/user')

//update user
router.put('/:id', async (req, res) => {
  //check id from both param and body
  //user sends new password , hash it before updating
  if (req.params.id === req.body.userId || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10)
        const hashing = await bcrypt.hash(req.body.password, salt)
        req.body.password = hashing
      } catch (err) {
        return res.status(500).json(err)
      }
    }

    // to update user account
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true },
      )
      res.status(200).json({ message: 'Account has been updated', data: user })
    } catch (err) {
      res.status(500).json(err)
    }
  } else {
    return res.status(403).json({ message: 'you can update only your account' })
  }
})

//delete user
router.delete('/:id', async (req, res) => {
  if (req.params.id === req.body.userId || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndRemove(req.params.id)
      if (!user) {
        res.status(404).json({ message: 'user not found' })
      }
      res.status(200).json({ message: 'Account has been deleted', data: user })
    } catch (err) {
      res.status(500).json(err)
    }
  } else {
    res.status(403).json({ message: 'You can delete only your account' })
  }
})

//get a user
router.get('/', async (req, res) => {
  const userId = req.query.userId
  const username = req.query.username
  console.log('userId ::', userId)
  console.log('username::', username)

  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username })

    if (!user) {
      return res.status(404).json({ message: 'user not found' })
    }
    // if u will do only "user" it wil send big obj, so use "user._doc", and we do want password and createdAt to send back
    const { password, updatedAt, ...others } = user._doc
    res.status(200).json(others)
  } catch (err) {
    res.json(500).json(err)
  }
})



// get friends List
// we have store ids of all followers. please look at user model.
// first check whoose friend list we need to send. find the user first from params.userid
// ids of freinds is stored in array, one by one fetch details of those friends, return it to client
router.get('/friends/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
    if (!user) {
      return res
        .status(404)
        .json('either _id is no valid or you are not sendig id itself')
    }

    const friends = await Promise.all(
      user.following.map((friendId) => {
        return User.findById(friendId)
      }),
    )
    let friendList = []
    friends.map((freind) => {
      const { _id, username, profilePicture } = freind // we dont want to send all data, sending only needed part
      friendList.push({ _id, username, profilePicture })
    })
    res.status(200).json(friendList)
  } catch (err) {
    res.status(500).json(err)
  }
})

//follow a user
/*--here if param.id === body.id , it means user is same, it should not be same
- we need id of the user whom we want to follow
- fetch the ids of both users 
- push my id inside that user's followers list, 
- push his id into my following list  
 --- */

router.put('/:id/follow', async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const FollowThisUser = await User.findById(req.params.id) //for user whom want to follow
      const currentUser = await User.findById(req.body.userId) //this is for my self, ( I mean whoever is using the app)

      if (!FollowThisUser.followers.includes(req.body.userId)) {
        await FollowThisUser.updateOne({
          $push: { followers: req.body.userId },
        })
        await currentUser.updateOne({ $push: { following: req.params.id } })
        res.status(200).json({ message: 'User has been followed' })
      } else {
        res.status(403).json({ message: 'You already follow this user' })
      }
    } catch (err) {
      res.status(500).json(err) // if both id is same , or incorred type or missing `
    }
  } else {
    res.status(403).json({ message: 'You can not follow your self' })
  }
})

//unfollow a user

router.put('/:id/unfollow', async (req, res) => {
  if (req.params.id !== req.body.userId) {
    try {
      const userIamFollowing = await User.findById(req.params.id)
      const currentUser = await User.findById(req.body.userId)

      if (userIamFollowing.followers.includes(req.body.userId)) {
        await userIamFollowing.updateOne({
          $pull: { followers: req.body.userId },
        })
        await currentUser.updateOne({ $pull: { following: req.params.id } })
        res.status(200).json({ message: 'User has been unfollowed' })
      } else {
        res.status(403).json({ message: "You don't follow this user" })
      }
    } catch (err) {
      res.status(500).json(err)
    }
  } else {
    res.status(403).json({ message: 'You can not unFollow your self' })
  }
})

// router.get("/", (req,res) =>{
//     const getFile = fs.readFileSync("./text.txt", 'utf-8')
//     res.send(getFile)
// })

module.exports = router

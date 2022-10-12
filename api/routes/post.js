const express = require('express')
const router = express.Router()
const Post = require('../models/post')
const User = require('../models/user')

// create a post
router.post('/', async (req, res) => {
  try {
    const newPost = await Post.create(req.body)
    res.status(200).json(newPost)
  } catch (err) {
    res.status(500).json(err)
  }
})



// update a post
router.put('/:id', async (req, res) => {
  try {
    const user = await Post.findById(req.params.id)

    if (user.userId === req.body.userId) {
      await Post.findByIdAndUpdate(req.params.id, { $set: req.body }) // we can use "update one", but then we have do it with "user" not model "Post"
      res.status(200).json('the post has been updated')
    } else {
      res.status(403).json('you can update only your post')
    }
  } catch (err) {
    res.status(500).json(err)
  }
})



// delete a post

router.delete('/:id', async (req, res) => {
  try {
    const user = await Post.findById(req.params.id)

    if (user.userId === req.body.userId) {
      await user.deleteOne() // if you want to use findByIdAndRemove then do => Post.findByIdAndDelete(id)
      res.status(200).json('Post has been deleted')
    } else {
      res.status(403).json('You can delete only your post')
    }
  } catch (err) {
    res.status(500).json(err)
  }
})



//  like / dislike a post

router.put('/:id/like', async (req, res) => {
  try {
    const user = await Post.findById(req.params.id)

    if (!user.likes.includes(req.body.userId)) {
      await user.updateOne({ $push: { likes: req.body.userId } }) // if I like a post, my userId will be in his like array
      res.status(200).json('Post has been liked')
    } else {
      await user.updateOne({ $pull: { likes: req.body.userId } }) // remove my id from his like array
      res.status(200).json('Post has been disliked')
    }
  } catch (err) {
    res.status(500).json(err)
  }
})



// get a post
router.get('/:id', async (req, res) => {
  try {
    const user = await Post.findById(req.params.id)
    if (!user) {
      return res.status(404).json('can not fetch post')
    }
    res.status(200).json(user)
  } catch (err) {
    res.status(500).json(err)
  }
})

// get timeline
/*
suppose I am a user, whenver I will create a post I will attach my id within it
If I like or commet, then I will attach thier id into my like list
If I follow, I will attach his id into my following and my id into his followers
it is general idea how we will keep track of your activity

-- here I will find all post created by me and whatever my freinds are postin,

If i want to see my all post, I just have to find all the post list which has my id attached.
If I want to see the list of post i liked, I would just grab my following array. It will have ids of all people whom i liked.
   
  currentUser => it is me (whoever is using the app)
  userPosts => posts done by me
  friendPosts => I will go and check my follower Array. It has ids of all my followers. 

use "promise.all" whenever u r usig loop, otherwise it will not properly
----- */

router.get('/timeline/:userId', async (req, res) => {
  console.log('reaching here')

  try {
    const currentUser = await User.findById(req.params.userId)
    const userPosts = await Post.find({ userId: currentUser._id })

    const frinedPosts = await Promise.all(
      currentUser.following.map((freindId) => {
        return Post.find({ userId: freindId })
      }),
    )
    res.status(200).json(userPosts.concat(...frinedPosts))
  } catch (err) {
    res.status(500).json(err)
  }
})



// get particular user's all post

router.get('/profile/:username', async (req, res) => {
  try {
    const getUser = await User.findOne({ username: req.params.username }) // first find the matching user from User collections
    const userPosts = await Post.find({ userId: getUser._id }) // if this user would have posted anything, Post model will have his _id inside document as userId
    res.status(200).json(userPosts)
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router

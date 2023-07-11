const router = require('express').Router();
const User = require('../../models/User');

router.get('/', (req, res) => {
  User.find({}).populate({ path: 'friends', select: '-__v' }).populate({ path: 'thoughts', select: '-__v' }).then((result) => {
    if (result) {
      res.status(200).json(result);
    } else {
      console.log('Uh Oh, something went wrong');
      res.status(500).json({ error: 'Something went wrong' });
    }
  });
})

router.get('/:id', (req, res) => {
  User.findOne({ _id: req.params.id }, (err, result) => {
    if (result) {
      res.status(200).json(result);
    } else {
      console.log('Uh Oh, something went wrong');
      res.status(500).json({ error: 'Something went wrong' });
    }
  });
})

router.post('/', (req, res) => {
  const newUser = new User({ username: req.body.username, email: req.body.email });
  newUser.save();
  if (newUser) {
    res.status(201).json(newUser);
  } else {
    console.log('Uh Oh, something went wrong');
    res.status(500).json({ error: 'Something went wrong' });
  }
})

router.post('/:userId/friends/:friendId', async (req, res) => {
  const friend = await User.findOne({ _id: req.params.friendId })
  const user = await User.findOne({ _id: req.params.userId })

  user.friends.push(friend._id)

  User.findOneAndUpdate(
    { id: user.id },
    { friends: user.friends },
    { new: true },
    (err, result) => {
      if (result) {
        res.status(200).json(result);
        console.log(`Updated: ${result}`);
      } else {
        console.log('Uh Oh, something went wrong');
        res.status(500).json({ message: 'something went wrong' });
      }
    }
  );
})


router.put('/:id', async (req, res) => {
  const updatedUser = await User.findOneAndUpdate(
    { _id: req.params.id },
    { username: req.body.username, email: req.body.email },
    { new: true }
  );
  res.status(200).json(updatedUser)
})

router.delete('/:id', async (req, res) => {
  await User.findOneAndDelete({ _id: req.params.id });
  res.send('User Deleted')
})

router.delete('/:userId/friends/:friendId', async (req, res) => {
  const userId = req.params.userId
  const friendId = req.params.friendId

  console.log(friendId)
  console.log(userId)
  try {
    const result = await User.updateOne(
      { _id: userId },
      { $pull: { friends: friendId } },
      { new: true },
    )

    if (!result) {
      return res.status(404).send('user not found')
    }

    res.send('friend removed succ')
  } catch (err) {
    console.log(err)
    res.status(500).send('500 err')
  }
})

module.exports = router;

const router = require('express').Router();
const Thought = require('../../models/Thought');
const User = require('../../models/User');
const Reaction = require('../../models/Reaction');

router.get('/', (req, res) => {
  Thought.find({}, (err, result) => {
    if (result) {
      res.status(200).json(result);
    } else {
      console.log('Uh Oh, something went wrong');
      res.status(500).json({ error: 'Something went wrong' });
    }
  });
})

router.get('/:id', (req, res) => {
  Thought.findOne({ id: req.params.id }, (err, result) => {
    if (result) {
      res.status(200).json(result);
    } else {
      console.log('Uh Oh, something went wrong');
      res.status(500).json({ error: 'Something went wrong' });
    }
  });
})

router.post('/', async (req, res) => {
  const newThought = new Thought({ username: req.body.username, thoughtText: req.body.thoughttext });
  await newThought.save();


  await User.findOneAndUpdate(
    { username: req.body.username },
    { $addToSet: { thoughts: newThought._id } },
    { new: true })

  const tt = await User.findOne({ username: req.body.username }).populate({ path: 'thoughts', select: '-__v' }).populate({ path: 'friends', select: '-__v' })
  if (tt) {
    res.status(200).json(tt)
  }
  else {
    res.send('Something went wrong')
  }

})


router.post('/:thoughtId/reactions', async (req, res) => {

  const user = await Thought.findOne({ _id: req.params.thoughtId })

  console.log()
  const newReaction = {
    username: req.body.username,
    reactionBody: req.body.reactionBody
  }

  try {
    const result = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $push: { reactions: newReaction } },
      { new: true },
    )

    if (!result) {
      return res.status(404).send('user not found')
    }

    res.status(200).json(result)
  } catch (err) {
    console.log(err)
    res.status(500).send('500 err')
  }
})

router.put('/:id', async (req, res) => {
  const updatedThought = await Thought.findOneAndUpdate(
    { _id: req.params.id },
    {
      username: req.body.username,
      thoughtText: req.body.thoughtText,
    },
    {new: true}
    ).populate({path:'reactions', select: '-__v' })
    if(updatedThought)
    {
      res.status(200).json(updatedThought)
    }

    else{res.send('Something went wrong')}

})

router.delete('/:id', async (req, res) => {
  Thought.findOneAndDelete({ _id: req.params.id }).then(()=>{res.send('Thought removed successfully')})
})

router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {

    const result = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: {_id: req.params.reactionId} } },
      { new: true },
    )
    if (!result) {
      return res.status(404).send('Thought not found')
    }

    res.send('Reaction removed successfully')


})

module.exports = router;

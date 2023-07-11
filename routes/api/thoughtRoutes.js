const router = require('express').Router();
const {
  getThoughts,
  getSingleThought,
  createThought,
  deleteThought,
  addReaction,
  removeReaction,
  updateThought,
} = require('../../controllers/thoughtController');

router.route('/').get(getThoughts).post(createThought);

router.route('/:thoughtId').get(getSingleThought).delete(deleteThought).put(updateThought);

// /api/students/:studentId/assignments
router.route('/:thoughtId/reactions').post(addReaction);

// /api/students/:studentId/assignments/:assignmentId
router.route('/:thoughtId/reactions/:reactionId').delete(removeReaction);

module.exports = router;

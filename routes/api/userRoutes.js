const router = require('express').Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  deleteUser,
  updateUser,
  addfriend,
  removeFriend,
} = require('../../controllers/userController');

router.route('/').get(getUsers).post(createUser);

router.route('/:userId').get(getSingleUser).delete(deleteUser).put(updateUser);

router.route('/:userId/friends').post(addfriend);

// /api/students/:studentId/assignments/:assignmentId
router.route('/:userId/friends/:friendId').delete(removeFriend);

module.exports = router;
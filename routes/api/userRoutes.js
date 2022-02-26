const router = require('express').Router()
const {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  deleteFriend } = require("../../controllers/userController")

router.route("/")
        .get(getUsers)
        .post(createUser)

router.route("/:id")
        .get(getSingleUser)
        .delete(deleteUser)
        .put(updateUser)

router.route("/:id/friends/:friend_id")
        .post(addFriend)
        .delete(deleteFriend)

module.exports = router
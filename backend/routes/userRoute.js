import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

import { 
  register, 
  login, 
  logout, 
  searchUser, 
  addFriend, 
  OtherUsers, 
  getChatHistory, 
  removeFriend,
  updateProfile
} from "../controllers/userController.js";

const router = express.Router();

router.route("/register").post(register);
router.route('/login').post(login);
router.route('/logout').post(logout);
router.route('/search').get(searchUser);
router.route('/friends/add/:id').post(isAuthenticated, addFriend);
router.route('/friends/remove/:id').post(isAuthenticated, removeFriend)
router.route('/friends').get(isAuthenticated, OtherUsers);
router.route('/profile/update').put(isAuthenticated, updateProfile)
router.route('/').get(isAuthenticated, getChatHistory);

export default router;
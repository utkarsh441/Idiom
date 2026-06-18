import express from "express"
import {register} from "../controllers/userController.js"
import { login } from "../controllers/userController.js"
import { logout } from "../controllers/userController.js"
import { OtherUsers } from "../controllers/userController.js"
import { isAuthenticated } from "../middleware/isAuthenticated.js"
const router = express.Router() 
console.log(router)
router.route("/register").post(register)

router.route('/login').post(login)

router.route('/logout').post(logout)

router.route('/').get(isAuthenticated, OtherUsers)
export default router // because we need specific names in index.js
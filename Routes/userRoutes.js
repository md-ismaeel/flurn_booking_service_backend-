import express from "express";
import { userRegistration, userLogin, userLogOut } from "../Controller/userController.js"
import { authenticateUsers } from "../Middleware/authenticateUsers.js"

const userRouter = express.Router();

userRouter.post("/register", userRegistration);
userRouter.post("/login", userLogin);
userRouter.get("/logout", authenticateUsers, userLogOut)

export default userRouter;
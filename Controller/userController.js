import { userModel } from "../Model/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt, { compare, genSalt, hash } from "bcrypt"

const secretKey = process.env.SECRET_KEY

export const userRegistration = async (req, res) => {
    const { userName, firstName, lastName, email, password, mobileNumber } = req.body;
    // console.log(req.body);

    if (!userName || !firstName || !lastName || !email || !password || !mobileNumber) {
        return res.status(400).json({
            success: false,
            message: "All field is required!!"
        })
    }

    try {
        const isRegistered = await userModel.findOne({ email })
        if (isRegistered) {
            return res.status(409).json({
                success: false,
                message: "user email already registered!!"
            })
        }

        const isRegisteredMobileNumber = await userModel.findOne({ mobileNumber })
        if (isRegisteredMobileNumber) {
            return res.status(409).json({
                success: false,
                message: "user number already registered!!"
            })
        }

        const salt = await genSalt(10)
        const hashedPassword = await hash(password, salt);

        const user = await userModel.create({
            ...req.body,
            password: hashedPassword
        })

        res.status(201).json({
            success: true,
            message: "user registered successfully!!",
            user: user._id
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

export const userLogin = async (req, res) => {
    const { userName, email, password } = req.body;

    if ((!userName && !email) || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required!!"
        })
    }
    try {
        const user = await userModel.findOne({
            $or: [{ userName: userName }, { email: email }]
        })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "user not fount! please register first!!"
            })
        }

        const isValidPassword = await compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: "UnAuthorized user!!"
            })
        }

        const payLoad = {
            userId: user.id,
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        }

        const token = jwt.sign(payLoad, secretKey, { expiresIn: "7d" })
        user.token = token;
        await user.save()

        const miliSecondIn7Days = 7 * 24 * 60 * 60 * 1000;
        res.cookie("token", token, {
            secure: true,
            sameSite: "none",
            path: "/",
            maxAge: miliSecondIn7Days
        })

        res.status(200).json({
            success: true,
            message: "user logedIn successfully!!",
            token: `Bearer ${token}`
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }

}

export const userLogOut = async (req, res) => {

    try {
        await userModel.findByIdAndUpdate(req.user._id, { token: null })
        res.clearCookie("token", {
            secure: true,
            sameSite: "none",
            path: "/",
        })
        res.status(200).json({
            success: true,
            message: "user logout successfully!!"
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }

}

import { userModel } from "../Model/userModel.js";
import "dotenv/config";
import jwt from "jsonwebtoken";

const secretKey = process.env.SECRET_KEY;

export const authenticateUsers = async (req, res, next) => {

    /*
     * Points to be validated in token
     * 1. Token should be present
     * 2. Secret key validation with jwt.verify (This is the same token that we have generated)
     * 3. Token expiry date should not be passed
     * 4. Validate the issued at date (Optional)
     * 5. Validate the user id if it is present in database
     */

    const token = req.cookies.token;
    // console.log(token);

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized user => token is required!!",
        });
    }

    let tokenData;

    try {
        tokenData = jwt.verify(token, secretKey);
        // console.log(tokenData);
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }

    const currentTime = Math.floor(Date.now() / 1000);

    if (currentTime > tokenData.exp) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized user => token has expired!!",
        });
    }

    try {
        const user = await userModel.findById(tokenData.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized user => user not found!!",
            });
        }

        req.user = user;
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }

    next();
};

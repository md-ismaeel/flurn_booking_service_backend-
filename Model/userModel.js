import mongoose, { Types } from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: [true, "userName is required!!"],
            unique: true
        },
        firstName: {
            type: String,
            required: [true, "first Name is require!!"],
            minLength: [2, "minimum length 2 is required"],
        },
        lastName: {
            type: String,
            required: [true, "last Name is require!!"],
        },
        email: {
            type: String,
            required: [true, "Email is required!!"],
            unique: true,
            validate: {
                validator: (value) => validator.isEmail(value),
                message: "please provide a valid email",
            },
        },
        password: {
            type: String,
            required: [true, "password is required!!"],
            minLength: [8, "password minimum length should be 8 character!!"],
        },
        mobileNumber: {
            type: Number,
            required: [true, "number is required!!"],
            maxLength: [10, "mobile number is required!!"],
            unique: true
        },
        role: {
            type: String,
            required: [true, "role is required!!"],
            default: "standard-user"
        },
        token: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

export const userModel = mongoose.model("user", userSchema);

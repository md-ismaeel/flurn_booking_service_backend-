import mongoose from "mongoose";
import validator from "validator";

const bookingSchema = new mongoose.Schema({
    bookedByUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    name: {
        type: String,
        required: [true, "name is required!!"],
    },
    mobileNumber: {
        type: String,
        required: [true, "number is required!!"],
        validate: {
            validator: (number) => validator.isMobilePhone(number, 'any'),  // Validates mobile numbers for any locale
            message: props => `${props.value} is not a valid phone number!`,
        },
    },
    totalAmount: {
        type: Number,
        required: [true, "total amount is required!!"],
    },
    currencySymbol: {
        type: String,
        enum: ["₹", "$", "€"], // Define allowed currency symbols
        default: "₹",
    },
}, { timestamps: true });

// Adding an index to optimize user-based queries
bookingSchema.index({ bookedByUserId: 1 });

export const bookingModel = mongoose.model("booking", bookingSchema);

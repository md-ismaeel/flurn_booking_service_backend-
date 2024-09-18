import mongoose from "mongoose";

const priceSchema = new mongoose.Schema({
    seatClass: {
        type: String,
        required: [true, "Seat class is required!!"],
        enum: ["economy", "business", "first class"],  // Restrict to predefined seat classes
    },
    normalPrice: {
        type: Number,
        required: [true, "Normal price is required!!"],
        min: [0, "Price must be greater than or equal to 0"],
    },
    minPrice: {
        type: Number,
        validate: {
            validator: function (value) {
                // Ensure minPrice is less than or equal to normalPrice
                return !this.normalPrice || value <= this.normalPrice;
            },
            message: "Minimum price must be less than or equal to normal price",
        },
        min: [0, "Price must be greater than or equal to 0"],
    },
    maxPrice: {
        type: Number,
        validate: {
            validator: function (value) {
                // Ensure maxPrice is greater than or equal to normalPrice
                return !this.normalPrice || value >= this.normalPrice;
            },
            message: "Maximum price must be greater than or equal to normal price",
        },
        min: [0, "Price must be greater than or equal to 0"],
    },
}, { timestamps: true });

// Adding index to optimize queries by seat class
priceSchema.index({ seatClass: 1 });

export const priceModel = mongoose.model("price", priceSchema);

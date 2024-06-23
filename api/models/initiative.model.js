import mongoose from "mongoose";

const initiativeSchema = new mongoose.Schema(
  {
    projecttitle: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      default: "/defaultimg.jpg",
    },

    startdate: {
      type: Date,
      required: true,
    },
    enddate: {
      type: Date,
      // required: true,
    },
    category: {
      type: String,
      required: true,
      default: "All",
    },
    city: {
      type: String,
    },
    locality: {
      type: String,
    },
    country: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    map: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    mapLat: {
      type: Number,
    },
    mapLng: {
      type: Number,
    },
    joinedPersonId: [],
  },

  { timestamps: true }
);

export const Initiative = mongoose.model("Initiative", initiativeSchema);

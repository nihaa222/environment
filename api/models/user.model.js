import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    initiatives: {
      type: [mongoose.Schema.Types.ObjectId],
    },
    bio: {
      type: String,
      default: "Hello I'm an environmentalist",
    },
    instaLink: {
      type: String,
    },
    linkdinLink: {
      type: String,
    },
    facebookLink: {
      type: String,
    },
    named: {
      type: String,
      required: true,
    },
    title: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "/Profile.png",
    },
    joinedInitiativeId: [],
    joinedUser: [],
  },

  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;

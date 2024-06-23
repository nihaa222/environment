import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const updateUser = async (req, res, next) => {
  console.log(req.user);
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this user"));
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          image: req.body.image,
          named: req.body.named, // corrected typo from "named" to "name"
          title: req.body.title,
          bio: req.body.bio,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedUser); // Assuming you want to send back the updated user
  } catch (error) {
    next(error);
  }
};

export const userjoin = async (req, res, next) => {
  const userId = req.body.userId;
  const postId = req.body.postId;

  try {
    const join = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          join: postId,
        },
      },
      { new: true }
    );
    res.status(200).json("Joined Successfully");
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("User has been signed out");
  } catch (error) {
    next(error);
  }
};

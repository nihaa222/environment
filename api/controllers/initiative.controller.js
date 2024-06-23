import { Initiative } from "../models/initiative.model.js";
import Pulp from "../models/peopleJoined.model.js";
import User from "../models/user.model.js";

const createInitiative = async (req, res, next) => {
  const {
    projecttitle,
    image,
    map,
    startdate,
    enddate,
    category,
    description,
    userId,
    locality,
    country,
    city,
    mapLat,
    mapLng,
  } = req.body;

  const imageurl = image ? image : "/defaultimgresize.jpg";
  const initiative = new Initiative({
    projecttitle,
    image: imageurl,
    map,
    startdate,
    enddate,
    category,
    description,
    userId,
    locality,
    country,
    city,
    mapLat,
    mapLng,
  });

  try {
    // Step 1: Save the new initiative
    const savedInitiative = await initiative.save();

    // Step 2: Update the user with the new initiative ID
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { $push: { initiatives: savedInitiative._id } },
      { new: true } // To return the updated user document
    );

    // Respond with JSON containing both saved initiative and updated user
    res.status(200).json({ savedInitiative, updateUser });
  } catch (error) {
    // console.error("Error creating initiative and updating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
    next(error);
  }
};

export { createInitiative };

export const getainitiative = async (req, res, next) => {
  const { id } = req.params;
  try {
    const initiative = await Initiative.findById(id);
    if (!initiative) {
      return res.status(404).json({ message: "Initiative not found" });
    }
    res.status(200).json(initiative);
  } catch (error) {
    next(error);
  }
};

export const joinornot = async (req, res, next) => {
  const currnentUserId = req.user.id;
  const userId = req.params.userId;
  console.log("the curent user id:", currnentUserId);
  // console.log("User ID received in request:", userId);
  if (currnentUserId === userId) {
    res.status(200).json({ join: false });
  } else {
    res.status(200).json({ join: true });
  }
};

export const getInitiatives = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex || 0);
    const limit = parseInt(req.query.limit) || 0;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    const initiatives = await Initiative.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.searchTerm && {
        $or: [
          { projecttitle: { $regex: req.query.searchTerm, $options: "i" } },
          { description: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalInitiatives = await Initiative.countDocuments();

    res.status(200).json({
      initiatives,
      totalInitiatives,
    });
  } catch (error) {
    next(error);
  }
};

export const category = async (req, res, next) => {
  try {
    const { category } = req.params;
    if (category == "All") {
      const cateiniall = await Initiative.find();
      res.status(200).json(cateiniall);
    } else {
      const cateini = await Initiative.find({ category: category });
      res.status(200).json(cateini);
    }
  } catch (error) {
    next(error);
  }
};

export const joining = async (req, res, next) => {
  const { initiative } = req.body;
  const { userId } = req.body;
  const { initiativeId } = req.body;
  const { creatorId } = req.body;
  console.log(initiativeId);
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $addToSet: { joinedInitiativeId: initiativeId },
    },

    { new: true }
  );

  const creatorUser = await User.findByIdAndUpdate(
    creatorId,
    {
      $addToSet: { joinedUser: userId },
    },
    { new: true }
  );
  const updatedInitiative = await Initiative.findByIdAndUpdate(
    initiativeId,
    {
      $addToSet: { joinedPersonId: userId },
    },
    { new: true }
  );
  const people = new Pulp({
    userId: userId,
    initiativeId: initiativeId,
  });

  await people.save();
  res.status(200).json({
    updatedUser,
    updatedInitiative,
    people,
    creatorUser,
  });
};

// export const deleteInitiative = async (req, res, next) => {
//   const { userId, initiativeId } = req.body;
//   console.log(userId, initiativeId);

//   try {
//     // Remove initiativeId from initiatives array in User document
//     const updatedUserDelete = await User.findByIdAndUpdate(
//       userId,
//       { $pull: { initiatives: initiativeId } },
//       { new: true } // Return the updated document
//     );

//     // Delete the Initiative document
//     await Initiative.findByIdAndDelete(initiativeId);

//     // Handle case where user was not found
//     if (!updatedUserDelete) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Respond with success message and updated user document
//     res
//       .status(200)
//       .json({ message: "Initiative has been deleted", updatedUserDelete });
//   } catch (error) {
//     next(error); // Pass any caught errors to the error handling middleware
//   }
// };

export const notjoining = async (req, res, next) => {
  try {
    const { userId, initiativeId } = req.body;

    console.log("Removing userId", userId, "from initiativeId", initiativeId);

    const joinInitiative = await Initiative.findByIdAndUpdate(
      initiativeId,
      { $pull: { joinedPersonId: userId } },
      { new: true }
    );

    const joinUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { joinedInitiativeId: initiativeId } },
      { new: true }
    );

    res.status(200).json({ joinInitiative, joinUser });
  } catch (error) {
    // console.error("Error in notjoining:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const flowerInitiative = async (req, res, next) => {
  const { userId, initiativeId } = req.body;
  console.log(userId, initiativeId);

  try {
    // Update the User document to pull the initiativeId from the initiatives array
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { initiatives: initiativeId } },
      { new: true } // Return the modified document after update
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const deleteInitiative = await Initiative.findByIdAndDelete(initiativeId);

    res.status(200).json({ updatedUser, initiativeId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getPulp = async (req, res, next) => {
  try {
    const limit = parseInt(req.params) || 9;
    const skip = parseInt(req.params) || 0;

    const getPeople = await Pulp.find().skip(skip).limit(limit);
    res.status(200).json(getPeople);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch Pulps" });
  }
};

export const getPeople = async (req, res, next) => {
  const { userId } = req.query;
  const limit = parseInt(req.query.limit) || 9;
  const skip = parseInt(req.query.skip) || 0;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Assuming joinedUser is an array of user IDs
    const joinedUserIds = user.joinedUser.slice(skip, skip + limit); // Get slice of IDs based on skip and limit

    // Fetch users corresponding to the IDs
    const peopleJoined = await User.find({ _id: { $in: joinedUserIds } });

    res.status(200).json(peopleJoined);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteJoinedInitiatives = async (req, res, next) => {
  const { userId } = req.params; // Extract userId from request parameters

  try {
    // Update the user document to remove all joinedInitiativeId entries
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $unset: { joinedInitiativeId: "" } }, // Remove joinedInitiativeId field
      { new: true }
    );

    // Respond with a JSON message and updated user document
    res
      .status(200)
      .json({ message: "Removed all joined initiatives", updatedUser });
  } catch (error) {
    console.error("Error removing joined initiatives:", error);
    res.status(500).json({ error: "Failed to remove joined initiatives" });
  }
};

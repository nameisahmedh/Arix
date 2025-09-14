// Make sure to import your Creation model and clerkClient at the top
import Creation from "../models/Creation.js";
import { clerkClient } from "@clerk/express";


export const getUserCreations = async (req, res) => {
  try {
    const { userId } = req.auth();

   
    const creations = await Creation.find({ userId: userId }).sort({ createdAt: -1 });

    res.json({ success: true, creations });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getPublishedCreations = async (req, res) => {
  try {
    // Fetch all creations from MongoDB where 'publish' is true
    const creationsFromDB = await Creation.find({ publish: true }).sort({ createdAt: -1 });

    // Fetch author details for each creation from Clerk
    const creations = await Promise.all(
      creationsFromDB.map(async (creation) => {
        const user = await clerkClient.users.getUser(creation.userId);
        return {
          // Spread the original creation data (_id, prompt, content, etc.)
          ...creation.toObject(),
          // Add the author object that the frontend needs
          author: {
            name: user.firstName || user.username,
            avatarUrl: user.imageUrl,
          },
        };
      })
    );

    res.json({ success: true, creations });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const toggleLikeCreations = async (req, res) => {
  try {
    const { userId } = req.auth();
    // The ID of the creation to like/unlike comes from the request body
    const { id } = req.body; 

    // 1. Find the specific creation by its unique ID
    const creation = await Creation.findById(id);

    // If no creation is found with that ID, return an error
    if (!creation) {
      return res.status(404).json({ success: false, message: "Creation not found" });
    }

    let message;

    // 2. Check if the user's ID is already in the 'likes' array
    const isLiked = creation.likes.includes(userId);

    if (isLiked) {
      // If it is, remove the userId from the 'likes' array using $pull
      await Creation.findByIdAndUpdate(id, { $pull: { likes: userId } });
      message = 'Creation Unliked';
    } else {
      // If it's not, add the userId to the 'likes' array using $addToSet
      // ($addToSet is better than $push because it prevents duplicate likes)
      await Creation.findByIdAndUpdate(id, { $addToSet: { likes: userId } });
      message = 'Creation Liked';
    }

    res.json({ success: true, message });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

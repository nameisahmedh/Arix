import { clerkClient } from "@clerk/express";
import OpenAI from "openai";
import Creation from "../models/Creation.js";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import FormData from "form-data";
import multer from 'multer';
import cloudinaryConfig from '../configs/cloudinary.js';
import { unlink } from 'fs/promises';
// NOTE: The static import for pdf-parse has been REMOVED from here.

// --- Configurations ---

const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "Premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to continue.",
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: length,
    });

    const content = response.choices[0].message.content;

    await Creation.create({
      userId: userId,
      prompt: prompt,
      content: content,
      type: "article",
    });

    if (plan !== "Premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }
    res.json({ success: true, content });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "Premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to continue.",
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 100,
    });

    const content = response.choices[0].message.content;

    await Creation.create({
      userId: userId,
      prompt: prompt,
      content: content,
      type: "blog-title",
    });

    if (plan !== "Premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }
    res.json({ success: true, content });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const generateImage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, publish } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "Premium" && free_usage >= 3) {
      return res.json({
        success: false,
        message: "You've reached your free limit of 3 images. Upgrade to Premium for unlimited image generation and access to all features!",
        upgrade: true
      });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);
    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          ...formData.getHeaders(), // This is the important part
          "x-api-key": process.env.CLIPDROP_API_KEY,
        },
        responseType: "arraybuffer",
      }
    );

    const base64Image = `data:image/png;base64,${Buffer.from(
      data,
      "binary"
    ).toString("base64")}`;

    const { secure_url } = await cloudinary.uploader.upload(base64Image);

    await Creation.create({
      userId: userId,
      prompt: prompt,
      content: secure_url,
      type: "image",
      publish: publish ?? false,
    });

    if (plan !== "Premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({ success: true, secure_url });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};



export const removeImageBackground = async (req, res) => {
    try {
        const { userId } = req.auth();
        const plan = req.plan;
        const free_usage = req.free_usage;

        if (plan !== "Premium" && free_usage >= 3) {
            return res.json({
                success: false,
                message: "You've reached your free limit of 3 images. Upgrade to Premium for unlimited background removal and access to all features!",
                upgrade: true
            });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image file provided' });
        }

        // Upload original image
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
            folder: 'original-images'
        });

        // Create background removal transformation
        const transformation = [
            { effect: "background_removal" },
            { quality: "auto" },
            { format: "png" }
        ];

        // Generate transformed URL
        const processedImageUrl = cloudinary.url(uploadResult.public_id, {
            transformation: transformation,
            sign_url: true
        });

        await unlink(req.file.path);

        if (plan !== "Premium") {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: free_usage + 1,
                },
            });
        }

        res.status(200).json({
            success: true,
            secure_url: processedImageUrl,
            message: 'Background removed successfully'
        });

    } catch (error) {
        if (req.file) {
            await unlink(req.file.path).catch(console.error);
        }
        console.error('Background removal error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to remove background',
            error: error.message
        });
    }
};




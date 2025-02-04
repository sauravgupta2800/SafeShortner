import { NextResponse } from "next/server";
import connect from "../../db";
import { request } from "http";
import PostModel from "../../../../models/PostModel";
import { nanoid } from "nanoid";
import { text } from "stream/consumers";

export const GET = async (request) => {
  console.log("GET request received");
  try {
    console.log("Attempting to connect to the database...");
    await connect();
    console.log("DB Connection successful!");
    return new NextResponse(
      JSON.stringify({
        text: "DB Connection successful!",
      }),
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error in connecting to DB:", error);
    return new NextResponse("Error in connecting to DB: " + error.message, {
      status: 402,
    });
  }
};

export const POST = async (request) => {
  console.log("POST request received");
  try {
    await connect();
    const { originalUrl: originalUrlName } = await request.json();
    const shortPathName = nanoid(6); // Generate a unique short path
    const newPost = new PostModel({
      originalUrl: originalUrlName,
      shortPath: shortPathName,
    });
    await newPost.save();
    const { _id: id, shortPath, originalUrl } = newPost.toObject();
    const resp = { id, shortPath, originalUrl };

    return new NextResponse(JSON.stringify(resp), {
      status: 201,
    });
  } catch (error) {
    return new NextResponse("Error in creating post: " + error.message, {
      status: 500,
    });
  }
};

export const PUT = async (request) => {
  console.log("PUT request received");
  try {
    await connect();
    const { id, ...updateData } = await request.json();
    const updatedPost = await PostModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedPost) {
      return new NextResponse("Post not found", {
        status: 404,
      });
    }
    return new NextResponse(JSON.stringify(updatedPost), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse("Error in updating post: " + error.message, {
      status: 500,
    });
  }
};

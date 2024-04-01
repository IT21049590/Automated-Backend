import express from "express";
import BlogModel from "../Models/Blog-model.js";
import asyncHandler from "express-async-handler";

export const addBlog = async (req, res) => {
  //let userId = req.params.id;
  let file = "N/A";
  if (req.file) {
    file = req.file.filename;
  }
  const prefix = "BID";
  const B_ID = prefix + Date.now();
  const title = req.body.title;
  const shortDescription = req.body.shortDescription;
  const fullDescription = req.body.fullDescription;
  const blogId = B_ID;
  console.log(req.body);

  const newBlog = new BlogModel({
    title,
    shortDescription,
    fullDescription,
    image: file,
    blogId,
  });
  console.log(newBlog);
  newBlog
    .save()
    .then(() => {
      res.json("Blog Added");
    })
    .catch((err) => {
      console.log(err);
    });
};
export const viewBlogs = async (req, res, next) => {
  let userId1 = req.params.id;
  await BlogModel.find({ SellerId: userId1 })
    .then((BlogModel) => {
      res.json(BlogModel);
      //console.log(x);
      //res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
    });
};
export const viewAll = async (req, res, next) => {
  await BlogModel.find()
    .then((BlogModel) => {
      res.json(BlogModel);
    })
    .catch((err) => {
      console.log(err);
    });
};
export const updateBlog = async (req, res) => {
  let userId = req.params.id;
  const { title, shortDescription, fullDescription } = req.body;

  const updateBlog = {
    title,
    shortDescription,
    fullDescription,
  };
  if (req.file) {
    updateBlog.image = req.file.filename;
  }
  const update = await BlogModel.findByIdAndUpdate(userId, updateBlog)
    .then(() => {
      res.status(200).send({ status: "Blog updated " });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .send({ status: "Error with updating data", error: err.message });
    });
};
export const deleteBlog = async (req, res) => {
  let userId = req.params.id;
  await BlogModel.findByIdAndDelete(userId)
    .then(() => {
      res.status(200).send({ status: "Product deleted" });
    })
    .catch((err) => {
      console.log(err.message);
      res
        .status(500)
        .send({ status: "Error with delete Product", error: err.message });
    });
};

export const getBlogById = async (req, res) => {
  let id = req.params.id;
  await BlogModel.findById(id)
    .then((response) => {
      res.status(200).json(response);
      console.log(res);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ status: "Error with get product", error: err.message });
    });
};
export const addFeedback = async (req, res) => {
  try {
    const { firstName, lastName, rating, comment } = req.body;
    const blogId = req.params.id;
    const blog = await BlogModel.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const newFeedback = {
      firstName,
      lastName,
      rating,
      comment,
    };

    blog.feedbacks.push(newFeedback);
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const addRating = async (req, res) => {
  try {
    const { rating } = req.body;
    const blogId = req.params.id;
    const blog = await BlogModel.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    blog.rating.push(rating);
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getBlogFeedbacks = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await BlogModel.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog.feedbacks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const handleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await BlogModel.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    if (!blog.likes.includes(req.userId)) {
      blog.likes.push(req.userId);
      await blog.save();
    }
    res.json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const likePost = asyncHandler(async (req, res) => {
  const postId = req.body.bid;
  const userId = req.body.id;

  try {
    // Find the post by its ID
    const post = await BlogModel.findById(postId);

    // Check if the user has already liked the post
    if (post.likes.includes(userId)) {
      // User has already liked the post, remove the like
      post.likes.pull(userId);
      post.isLiked = false;
    } else {
      // Add the user's ID to the likes array
      post.likes.push(userId);
      post.isLiked = true;
    }

    // Remove the user's ID from the disLikes array if present
    post.dislikes.pull(userId);
    post.isDisliked = false;

    // Save the updated post
    await post.save();

    // Return the updated post
    res.json({
      post,
      likes: post.likes.length,
      dislikes: post.dislikes.length,
    });
  } catch (error) {
    throw new Error(error.message);
  }
});
export const dislikePost = asyncHandler(async (req, res) => {
  const postId = req.body.bid;
  const userId = req.body.id;

  try {
    // Find the post by its ID
    const post = await BlogModel.findById(postId);

    // Check if the user has already liked the post
    if (post.likes.includes(userId)) {
      // User has already liked the post, remove the like
      post.likes.pull(userId);
      post.isLiked = false;
    }

    // Check if the user has already disliked the post
    if (post.dislikes.includes(userId)) {
      // User has already disliked the post, remove the dislike
      post.dislikes.pull(userId);
      post.isDisliked = false;
    } else {
      // Add the user's ID to the disLikes array
      post.dislikes.push(userId);
      post.isDisliked = true;
    }

    // Save the updated post
    await post.save();

    // Return the updated post
    res.json({
      post,
      likes: post.likes.length,
      dislikes: post.dislikes.length,
    });
  } catch (error) {
    throw new Error(error.message);
  }
});
export const getAverageRatingForBlog = async (req, res) => {
  let id = req.params.id;

  try {
    const blog = await BlogModel.findById(id);
    //await BlogModel.findById(id)

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    let totalRating = 0;
    for (const feedback of blog.feedbacks) {
      totalRating += feedback.rating;
    }
    const averageRating =
      blog.feedbacks.length > 0
        ? Math.round(totalRating / blog.feedbacks.length)
        : 0;

    res.json({ averageRating: averageRating });
  } catch (error) {
    console.error("Error retrieving average rating:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

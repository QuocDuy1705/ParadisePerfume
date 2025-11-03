import Blog from "../models/Blog.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure multer for blog image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Lưu vào client/public/images/blog/ giống như product images
    const uploadPath = path.join(__dirname, "../../client/public/images/blog");
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      "blog-" + uniqueSuffix + path.extname(file.originalname).toLowerCase()
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp|svg/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  },
}).single("image");

// @desc    Get all blogs (public)
// @route   GET /api/blogs
// @access  Public
export const getAllBlogs = async (req, res) => {
  try {
    const { category, published, search } = req.query;
    let query = {};

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by published status
    if (published !== undefined) {
      query.published = published === "true";
    } else {
      // Only show published blogs for public
      query.published = true;
    }

    // Search by title or content
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .select("-content"); // Exclude content for list view

    res.json({
      success: true,
      count: blogs.length,
      blogs: blogs,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get single blog by slug
// @route   GET /api/blogs/:slug
// @access  Public
export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Increment view count
    await blog.incrementViews();

    res.json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get blog by ID (admin)
// @route   GET /api/blogs/id/:id
// @access  Private/Admin
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private/Admin
export const createBlog = async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const {
        title,
        slug,
        category,
        excerpt,
        content,
        author,
        tags,
        published,
        metaDescription,
        metaKeywords,
      } = req.body;

      // Check if slug already exists
      if (slug) {
        const existingBlog = await Blog.findOne({ slug });
        if (existingBlog) {
          return res.status(400).json({ message: "Slug already exists" });
        }
      }

      const blogData = {
        title,
        slug,
        category,
        excerpt,
        content,
        author,
        published: published === "true" || published === true,
      };

      // Add image if uploaded
      if (req.file) {
        blogData.image = `/images/blog/${req.file.filename}`;
      }

      // Parse tags if string
      if (tags) {
        blogData.tags =
          typeof tags === "string"
            ? tags.split(",").map((t) => t.trim())
            : tags;
      }

      // Parse keywords if string
      if (metaKeywords) {
        blogData.metaKeywords =
          typeof metaKeywords === "string"
            ? metaKeywords.split(",").map((k) => k.trim())
            : metaKeywords;
      }

      if (metaDescription) {
        blogData.metaDescription = metaDescription;
      }

      const blog = await Blog.create(blogData);

      res.status(201).json({
        message: "Blog created successfully",
        blog,
      });
    } catch (error) {
      console.error("Error creating blog:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
export const updateBlog = async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const blog = await Blog.findById(req.params.id);

      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }

      const {
        title,
        slug,
        category,
        excerpt,
        content,
        author,
        tags,
        published,
        metaDescription,
        metaKeywords,
      } = req.body;

      // Check if new slug conflicts with existing blog
      if (slug && slug !== blog.slug) {
        const existingBlog = await Blog.findOne({ slug });
        if (existingBlog) {
          return res.status(400).json({ message: "Slug already exists" });
        }
        blog.slug = slug;
      }

      // Update fields
      if (title) blog.title = title;
      if (category) blog.category = category;
      if (excerpt) blog.excerpt = excerpt;
      if (content) blog.content = content;
      if (author) blog.author = author;
      if (metaDescription) blog.metaDescription = metaDescription;

      if (published !== undefined) {
        blog.published = published === "true" || published === true;
      }

      // Update image if uploaded
      if (req.file) {
        // Lưu đường dẫn giống như product images (/images/blog/)
        blog.image = `/images/blog/${req.file.filename}`;
      }

      // Update tags
      if (tags) {
        blog.tags =
          typeof tags === "string"
            ? tags.split(",").map((t) => t.trim())
            : tags;
      }

      // Update keywords
      if (metaKeywords) {
        blog.metaKeywords =
          typeof metaKeywords === "string"
            ? metaKeywords.split(",").map((k) => k.trim())
            : metaKeywords;
      }

      await blog.save();

      res.json({
        message: "Blog updated successfully",
        blog,
      });
    } catch (error) {
      console.error("Error updating blog:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    await blog.deleteOne();

    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Toggle publish status
// @route   PATCH /api/blogs/:id/publish
// @access  Private/Admin
export const togglePublish = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    blog.published = !blog.published;
    await blog.save();

    res.json({
      message: `Blog ${
        blog.published ? "published" : "unpublished"
      } successfully`,
      blog,
    });
  } catch (error) {
    console.error("Error toggling publish status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

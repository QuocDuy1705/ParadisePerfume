import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "brands",
        "fragrance-types",
        "how-to-choose",
        "perfume-care",
        "luxury-brands",
        "general",
      ],
    },
    excerpt: {
      type: String,
      required: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "/images/blog/brands.svg",
    },
    author: {
      type: String,
      default: "Paradise Team",
    },
    tags: [
      {
        type: String,
      },
    ],
    published: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    metaDescription: {
      type: String,
      maxlength: 160,
    },
    metaKeywords: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Generate slug from title
blogSchema.pre("save", function (next) {
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }
  next();
});

// Increment view count
blogSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

export default mongoose.model("Blog", blogSchema);

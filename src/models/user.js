const mongoose = require("mongoose");
const validator = require("validator");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      sparse: true,
      minLength: 3,
      maxLength: 24,
      unique: true,
      trim: true,
      match: /^[a-zA-Z0-9]+$/, //no spaces/HTML/special chars
    },
    firstName: {
      type: String,
      minLength: 3,
      maxLength: 50,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      minLength: 3,
      maxLength: 50,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "Invalid email address",
      },
    },
    password: {
      type: String,
      minLength: 8,
      select: false,
      required: true,
    },
    age: {
      type: Number,
      min: [12, "Must be at least 12"],
      max: [70, "Must be 70 or younger"],
    },
    gender: {
      type: String,
      enum: ["male", "female", "non-binary", "prefer-not-to-say"],
      default: "prefer-not-to-say",
    },
    bio: {
      type: String,
      trim: true,
      maxLength: 500,
    },
    avatarUrl: String,
    techStack: [
      {
        type: String,
        trim: true,
        maxLength: 30,
        lowercase: true,
      },
    ],
    interests: [
      {
        type: String,
        enum: [
          "web",
          "blockchain",
          "mobile",
          "ai-ml",
          "other",
          "devops",
          "game-dev",
        ],
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    githubUrl: {
      type: String,
      trim: true,
      validate: {
        validator: (v) => !v || validator.isURL(v, { protocols: ["https"] }),
        message: "Must be a valid HTTPS URL",
      },
    },
    portfolioUrl: {
      type: String,
      trim: true,
      validate: {
        validator: (v) => !v || validator.isURL(v, { protocols: ["https"] }),
        message: "Must be a valid HTTPS URL",
      },
    },
    experienceLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "professional"],
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
module.exports = User;

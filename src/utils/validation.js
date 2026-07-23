const validator = require("validator");

function validateSignupData(req) {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("firstName and lastName are required");
  }
  if (!validator.isLength(firstName, { min: 2, max: 50 })) {
    throw new Error("firstName must be 2-50 characters");
  }
  if (!email || !validator.isEmail(email)) {
    throw new Error("A valid email is required");
  }
  if (!password || !validator.isStrongPassword(password)) {
    throw new Error(
      "Password must be at least 8 characters, with lowercase, uppercase, numbers and symbol",
    );
  }
}

const validateLoginData = (req) => {
  const { email } = req.body;

  if (!email || !validator.isEmail(email)) {
    throw new Error("Enter a valid Email-Id");
  }
};

function validateUpdateData(req) {
  const requestedUpdates = Object.keys(req.body);
  const ALLOWED_UPDATES = [
    "username",
    "firstName",
    "lastName",
    "gender",
    "bio",
    "techStack",
    "experienceLevel",
    "interests",
    "githubUrl",
    "portfolioUrl",
    "avatarUrl",
  ];
  const isEveryFieldAllowed = requestedUpdates.every((field) => {
    return ALLOWED_UPDATES.includes(field);
  });
  if (!isEveryFieldAllowed) {
    throw new Error(
      "Invalid update: contains a field you're not allowed to change",
    );
  }

  const { githubUrl, portfolioUrl, bio } = requestedUpdates;
  if (githubUrl && !validator.isURL(githubUrl, { protocols: ["https"] })) {
    throw new Error("githubUrl must be a valid HTTPS URL");
  }
  if (
    portfolioUrl &&
    !validator.isURL(portfolioUrl, { protocols: ["https"] })
  ) {
    throw new Error("portfolioUrl must be a valid HTTPS URL");
  }
  if (bio && bio.length > 500) {
    throw new Error("bio must be under 500 characters");
  }
}

module.exports = {
  validateSignupData,
  validateUpdateData,
  validateLoginData,
};

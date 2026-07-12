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

function validateUpdateData(req) {
  const ALLOWED_UPDATES = [
    "username",
    "firstName",
    "lastName",
    "bio",
    "techStack",
    "experienceLevel",
    "interests",
    "githubUrl",
    "portfolioUrl",
    "avatarUrl",
  ];
  const isEveryFieldAllowed = Object.keys(req).every((k) =>
    ALLOWED_UPDATES.includes(k),
  );
  if (!isEveryFieldAllowed) {
    throw new Error(
      "Invalid update: contains a field you're not allowed to change",
    );
  }

  const { githubUrl, portfolioUrl, bio } = req.body;
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

module.exports = { validateSignupData, validateUpdateData };

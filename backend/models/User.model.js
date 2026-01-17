const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 12
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    /* Security Fields */
    failedLoginAttempts: {
      type: Number,
      default: 0
    },

    lockUntil: {
      type: Date
    },

    mfaEnabled: {
      type: Boolean,
      default: false
    },

    mfaCode: {
      type: String
    },

    mfaCodeExpiry: {
      type: Date
    },

    passwordChangedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

/* Hash password before saving */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/* Compare password during login */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/* Check if account is locked */
userSchema.methods.isLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now();
};

module.exports = mongoose.model("User", userSchema);

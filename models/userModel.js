const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address!",
      ],
    },
    dob: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          const date = new Date(v);
          const today = new Date();
          return (
            date <= today &&
            date >
              new Date(
                today.getFullYear() - 120,
                today.getMonth(),
                today.getDate(),
              )
          );
        },
        message: "Please enter a valid date of birth!",
      },
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index({ name: 1 });
userSchema.index({ dob: 1 });

const User = mongoose.model("User", userSchema);

module.exports = User;

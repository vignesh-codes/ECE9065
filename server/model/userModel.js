const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"], 
    },
    address: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
    },
    userType: {
      type: Number,
      required: true,
      enum: [0, 1],
      default: 0, // 0-> User, 1-> Admin

    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// gpt generated
// Static Helper Functions
userSchema.statics = {
  /**
   * Fetch all users
   */
  async getAllUsers() {
    return this.find();
  },

  /**
   * Fetch a user by email
   * @param {String} email - User's email
   */
  async getUserByEmail(email) {
    return this.findOne({ email });
  },

  /**
   * Fetch a user by ID
   * @param {String} id - User's MongoDB ID
   */
  async getUserById(id) {
    return this.findById(id);
  },

  /**
   * Create a new user
   * @param {Object} userData - User data
   */
  async createUser(userData) {
    console.log("creating new user")
    const user = new this(userData);
    return user.save();
  },

  /**
   * Update a user's details
   * @param {String} id - User's MongoDB ID
   * @param {Object} updateData - Data to update
   */
  async updateUser(id, updateData) {
    return this.findByIdAndUpdate(id, updateData, { new: true });
  },

  /**
   * Delete a user by ID
   * @param {String} id - User's MongoDB ID
   */
  async deleteUser(id) {
    return this.findByIdAndDelete(id);
  },
};

// Connecting with the Collection/Model
const UserModel = mongoose.model("Users", userSchema);

module.exports = UserModel;

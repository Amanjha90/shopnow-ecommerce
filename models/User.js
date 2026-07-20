const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true    // every user must have a name
  },
  email: {
    type: String,
    required: true,
    unique: true      // no two users can have same email
  },
  password: {
    type: String,
    required: true    // every user must have a password
  },
  isAdmin: {
    type: Boolean,
    default: false    // by default every new user is a normal user, not admin
  }
}, { timestamps: true })

// Why this function: before saving user to database, encrypt their password
// 'pre' means this runs BEFORE saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next() // if password not changed, skip encryption
  }
  const salt = await bcrypt.genSalt(10) // generate random salt
  this.password = await bcrypt.hash(this.password, salt) // encrypt password
})

// Why this function: when user logs in, compare entered password with encrypted one
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model('User', userSchema)
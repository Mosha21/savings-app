const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true,
        validate(value){
            if(!validator.isEmail(value)) throw new Error('Invalid email')
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        trim: true
    }
}, {
    timestamps: true
})

//userSchema.virtual()

userSchema.methods.toJSON = function () { // Modifies response
    const user = this
    const userObject = user.toObject()

    delete userObject.password

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    //user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

//userSchema.statics
//userSchema.methods
//userSchema.pre('save')  //save, remove, etc

const User = mongoose.model('User', userSchema)

module.exports = User
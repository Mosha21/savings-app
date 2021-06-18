const mongoose = require('mongoose')

const modelSchema = new mongoose.Schema({
    fieldOne: {
        type: String,
        required: true,
        trim: true,
        unique: false,
        lowercase: false,
        minlength: 3,
        validate(value){
            if(value.length > 25) throw new Error('Error')
        }
    },
    fieldTwo: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

//modelSchema.virtual()

modelSchema.methods.toJSON = function () {
    const model = this
    const modelObject = model.toObject()

    //  delete modelObject.fieldTwo

    return modelObject
}

//modelSchema.statics
//modelSchema.methods
//modelSchema.pre('save')  //save, remove, etc

const Model = mongoose.model('Model', modelSchema)

module.exports = Model
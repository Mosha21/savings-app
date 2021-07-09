const mongoose = require('mongoose')

const distributionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    quantity: Number,
    percentage: {
        type: Number,
        required: function() { return this.quantity == null }
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

/*distributionSchema.pre('save', function(next) {
    const dist = this


})*/

const Distribution = mongoose.model('Distribution', distributionSchema)

module.exports = Distribution
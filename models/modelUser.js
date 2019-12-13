const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema(
    {   
        firstname: String,
        lastname: String,
        email: String,
        password: String,
        sugarLevel:
        [
            {
                level: Number,
                date: {type: Date, default: Date.now}
            }
        ]
    }
)

const modelClass = mongoose.model('modelUser', userSchema)

module.exports = modelClass
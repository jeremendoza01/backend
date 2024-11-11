const mongoose = require('mongoose')

const schema = mongoose.Schema

const userSchema = new schema({
    username:{
        type: String,
        require: true
    },
    password:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true
    },
    name:{
        first:{
            type: String,
            require: false
        },
        last:{
            type: String,
            require: false
        }
    }
})

module.exports = mongoose.model('user', userSchema)
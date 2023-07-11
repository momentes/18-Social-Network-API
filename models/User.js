const { Schema, model } = require ('mongoose');
const {isEmail} = require('validator');

// Schema to create User model
const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trimmed:true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate:[
                isEmail, 'invalid email'
            ]
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'thought'
            },
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'user'
            }
        ]      
    },
    {
        toJSON: {
            getters: true,
        },
        id: false,
    }
);

//create  a virtual property 'friendCount' that get the amount of friends length
userSchema.virtual('friendCount').get(function(){
    return this.friends.length;
});

const User = model('user', userSchema);

module.exports = User;

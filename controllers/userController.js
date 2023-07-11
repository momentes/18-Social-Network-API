const { User, Thought } = require('../models');

module.exports = {
    async getUsers(req, res) {
        try{
            userData = await User.find()
            res.json(userData);
        } catch (err) {
            res.status(500).json(err)
        }
    },

    async createUser(req,res) {
        try{
            userData = await User.create(req.body);
            res.json(userData)
        } catch(err) {
            res.status(500).json(err)
        }
    },

    async getSingleUser(req,res) {
        try{
            userData = await User.findOne(
                {
                    _id: req.params.userId
                }
            )
            .select('-__v')
            .populate([
                {   
                    path:'friends',
                    select:'-__v',
                },
                {
                    path: 'thoughts',
                    select:'-__v'
                }
            ]);
            

            if(!userData){
                res.status(404).json({ message: 'No user with that ID'})
            }else{
                res.json(userData);
            };
        } catch(err) {
            res.status(500).json(err);
        }
    },

    async updateUser(req,res) {
        try{
            userData = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body },
                { runValidators: true, new: true }
            );
            if(!userData){
                res.status(404).json({message:'No User with this id'});
            }else{
                res.json(userData);
            }
        }catch(err){
            res.status(500).json(err);
        }
    },

    async deleteUser(req,res) {
        try{
            userData = await User.findOneAndDelete(
                {_id: req.params.userId},
            );
            if(!userData){
                res.status(404).json({message:'No User with this id'})
            }else{
                thoughtData = await Thought.deleteMany({ _id: { $in: userData.thoughts}});
                res.json(thoughtData);
            }
        }catch(err){
            res.status(500).json(err);
        }
    },

    async addFriend(req,res) {
        try{
            userData = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: req.params.friendId }},
                { new: true }
            )
            res.json(userData);
        }catch(err){
            res.tatus(500).json(err);
        }
    },
    async removeFriend(req,res) {
        try{
            userData = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: {friends: req.params.friendId}},
                { runValidators: true, new: true}
            )
            res.json(userData);
        }catch(err){
            res.tatus(500).json(err);
        }
    }
};
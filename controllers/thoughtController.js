const { User,Thought } = require('../models')

module.exports = {
    async getThoughts(req,res){
        try{
            thoughtsData = await Thought.find();
            res.json(thoughtsData);
        }catch(err) {
            res.status(500).json(err);
        }
    },
    async createThought(req,res){
        try{
            thoughtsCreateData = await Thought.create(req.body);
            
            thoughtData = await User.findOneAndUpdate(
                { _id:req.body.userId},
                { $addToSet: {thoughts: thoughtsCreateData._id}},
                { new: true}
            )
            res.json(thoughtData);
                
        }catch(err) {
            return res.status(500).json(err);
        }
    },
    async getSingleThought(req,res){
        try{
            thoughtData = await Thought.findOne(
                {
                    _id: req.params.thoughtId
                }
            )
            .select('-__v')
            if(!thoughtData){
                res.status(404).json({ message:'No thought with that ID'})
            }else{
                res.json(thoughtData);
            };
        }catch(err){
            res.status(500).json(err);
        }
    },
    async updateThought(req,res){
        try{
            thoughtData = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId},
                { $set: req.body},
                { runValidators: true, new: true}
            );
            if(!thoughtData){
                res.status(404).json({message:'No Thought with id'})
            }else{
                res.json(thoughtData);
            }
            
        }catch(err){
            res.status(500).json(err);
        }
    },

    async deleteThought(req,res) {
        try{
            thoughtData = await Thought.findOneAndRemove(
                {_id: req.params.thoughtId},
            );
            if(!thoughtData){
                res.status(404).json({message:'No thought with this id'})
            }else{
                userData = await User.findOneAndUpdate(
                    { thoughts: req.params.thoughtId },
                    { $pull: { thoughts: req.params.thoughtId}},
                    { new: true }
                );
                if(!userData){
                    res.status(404).json({message:'No User with this thought'});
                }else{
                    res.json(thoughtData);
                }
            }
        }catch(err){
            res.status(500).json(err);
        }
    },

    async createReaction(req,res){
        try{
            thoughtData = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: req.body }},
                { runValidators: true, new: true }
            );
            if(!thoughtData){
                res.status(404).json({ message: 'No thought found with that ID'});
            }else{
                res.json(thoughtData);
            }
        }catch(err){
            res.status(500).json(err);
        }
    },
    async deleteReaction(req,res){
        try{
            thoughtData = await Thought.findOneAndUpdate(
                { _id:req.params.thoughtId },
                { $pull: { reactions: {reactionID: req.params.reactionId }}},
                { runValidators: true, new: true }
            );
            if(!thoughtData){
                res.status(404).json({message: 'No thought found with that ID'})
            }else{
                res.json(thoughtData);
            }
        }catch(err){
            res.status(500).json(err);
        }
    }
}
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
    question:{
        type:String,
        required:true,
        trim:true
    },
    answer:{
        type:String,
        required:true,
        trim:true
    },
    points:{
        type:Number,
        required:true
       
    },
    user:[{
        type:Schema.Types.ObjectId,
        ref:'user'
    }],
    isDeleted:{
        type:Boolean,
        default:false
    },
    deletedAt:{
        type:Date,
    }

},{timestamps:true});
module.exports = mongoose.model('feedback',feedbackSchema);
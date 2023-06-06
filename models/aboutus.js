const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const aboutusSchema = new Schema({
    title:{
        type:String,
        trim:true,
    },
    description:{
        type:String,
        trim:true
    },
    image:{
        type:String,
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    deletedAt:{
        type:Date
    }

},{timestamps:true});
module.exports = mongoose.model('aboutus',aboutusSchema);
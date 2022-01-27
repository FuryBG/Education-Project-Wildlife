const { Schema, model } = require("mongoose");


const schema = new Schema({
    title: {type: String, required: true},
    keyword: {type: String, required: true},
    location: {type: String, required: true},
    date: {type: String, required: true},
    imgUrl: {type: String, required: true},
    description: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, ref: "User", required: true},
    votes: [{type: Schema.Types.ObjectId, ref: "User"}],
    rating: {type: Number, default: 0}
});


module.exports = model("Post", schema);
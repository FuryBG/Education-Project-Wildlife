const Post = require("../models/Post");


    async function create(data) {
        let newItem = new Post(data);

        await newItem.save();
        return newItem;
    };

    async function getAll(criteria) {
        let search = {};

        if(criteria != undefined) {
            search = criteria;
        };

        let allPosts = await Post.find(search).populate("author").lean();
        return allPosts;
    };

    async function getById(id) {
        let currPost = await Post.findById(id).populate("author").populate("votes").lean();
        return currPost;
    }

    async function edit(id, data) {
        let currPost = await Post.findById(id);
        currPost = Object.assign(currPost, data);
        await currPost.save();
        return currPost;
    }

    async function del(id) {
        await Post.deleteOne({_id: id});
    };

    async function like(id, userId) {
        let currPost = await Post.findById(id);
        currPost.votes.push(userId);
        currPost.rating += 1;
        await currPost.save();
    };

    async function unlike(id, userId) {
        let currPost = await Post.findById(id);
        currPost.votes.push(userId);
        currPost.rating -= 1;
        await currPost.save();
    };



module.exports = {
    create,
    getById,
    getAll,
    edit,
    del,
    like,
    unlike
};
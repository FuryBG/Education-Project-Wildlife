const postService = require("../services/post");

module.exports = () => {
    return (req, res, next) => {
        req.storage = {
            create: postService.create,
            getById: postService.getById,
            getAll: postService.getAll,
            del: postService.del,
            edit: postService.edit,
            like: postService.like,
            unlike: postService.unlike
        };


        next();
    };
}
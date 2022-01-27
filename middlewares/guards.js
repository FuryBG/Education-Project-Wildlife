const { getById } = require("../services/post");

function isUser() {
    return (req, res, next) => {
        if(req.user) {
            next();
        }else {
            res.redirect("/auth/login");
        }
    };
}

function isGuest() {
    return (req, res, next) => {
        if(!req.user) {
            next();
        }else {
            res.redirect("/");
        }
    };
}

function isOwner() {
    return async(req, res, next) => {
        const item = await getById(req.params.id);
        console.log(item.author);
        if(item.author._id == req.user._id) {
            next();
        }else {
            res.redirect("/");
        }
    };
};

module.exports = {
    isUser,
    isGuest,
    isOwner
};
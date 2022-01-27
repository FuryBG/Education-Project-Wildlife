const router = require("express").Router();
const { isGuest, isUser, isOwner } = require("../middlewares/guards");

router.get("/", async(req, res) => {

    let allPosts = await req.storage.getAll();

    res.render("home.hbs", {allPosts});
});

router.get("/all", async(req, res) => {
    let allPosts = await req.storage.getAll();
    res.render("all-posts.hbs", {allPosts});
});

router.get("/userpanel", async(req, res) => {
    let myPosts = await req.storage.getAll({author: req.user._id});
    myPosts.forEach(x => x.ownerName = x.author.firstName + " " + x.author.lastName);
    res.render("my-posts.hbs", {myPosts});
});

router.get("/unlike/:id", isUser(), async(req, res) => {
    await req.storage.unlike(req.params.id, req.user._id);
    res.redirect(`/details/${req.params.id}`);
});

router.get("/delete/:id", isUser(), isOwner(), async(req, res) => {
    await req.storage.del(req.params.id);
    res.redirect("/");
});

router.get("/edit/:id", isUser(), isOwner(), async(req, res) => {
    let currItem = await req.storage.getById(req.params.id);
    res.render("edit.hbs", {info: currItem});

});

router.post("/edit/:id", isUser(), isOwner(), async(req, res) => {

    let data = {
        title: req.body.title,
        keyword: req.body.keyword,
        location: req.body.location,
        date: req.body.date,
        imgUrl: req.body.imgUrl,
        description: req.body.description,
        author: req.user._id,

    };
    try {
        let errors = [];
        if(req.body.title.length < 6) {
            errors.push("Title must be 6 chars or more!");
        }

        if(req.body.keyword.length < 6) {
            errors.push("Keyword must be 6 chars or more!");
        }

        if(req.body.location.length > 15) {
            errors.push("Location is too long!");
        }

        if(req.body.date.length != 10) {
            errors.push("Invalid date");
        }

        if(!req.body.imgUrl.startsWith("http://") && !req.body.imgUrl.startsWith("https://")) {
            errors.push("Invalid img address");
        }

        if(errors.length > 0) {
            throw new Error(errors.join("\n"));
        }

        await req.storage.edit(req.params.id, data);
        res.redirect(`/details/${req.params.id}`);
    }catch(err) {
        console.log(err);
        res.render("edit.hbs", {errors: err.message.split("\n"), info: data});
    }
});

router.get("/details/:id", async(req, res) => {
    let currPost = await req.storage.getById(req.params.id);
    currPost.ownerName = currPost.author.firstName + " " + currPost.author.lastName;

    let allLikes = currPost.votes.map(e => e.email);
    let isLiked = currPost.votes.find(x => x._id == req.user._id);

    if(allLikes.length > 0) {
    currPost.allLikes = allLikes.join(", ");
    }

    if(isLiked) {
        currPost.isLiked = true;
    }

    if(currPost.author._id == req.user._id) {
        currPost.isOwner = true;
    }



    res.render("details.hbs", currPost);
});

router.get("/like/:id", isUser(), async(req, res) => {
    await req.storage.like(req.params.id, req.user._id);
    res.redirect(`/details/${req.params.id}`);
});

router.get("/create", isUser(), (req, res) => {
    res.render("create.hbs");
});

router.post("/create", isUser(), async(req, res) => {
    let data = {
        title: req.body.title,
        keyword: req.body.keyword,
        location: req.body.location,
        date: req.body.date,
        imgUrl: req.body.imgUrl,
        description: req.body.description,
        author: req.user._id,

    };
    try {
        let errors = [];
        if(req.body.title.length < 6) {
            errors.push("Title must be 6 chars or more!");
        }

        if(req.body.keyword.length < 6) {
            errors.push("Keyword must be 6 chars or more!");
        }

        if(req.body.location.length > 15) {
            errors.push("Location is too long!");
        }

        if(req.body.date.length != 10) {
            errors.push("Invalid date");
        }

        if(!req.body.imgUrl.startsWith("http://") && !req.body.imgUrl.startsWith("https://")) {
            errors.push("Invalid img address");
        }

        if(errors.length > 0) {
            throw new Error(errors.join("\n"));
        }

        await req.storage.create(data);
        res.redirect("/");
    }catch(err) {
        console.log(err);
        res.render("create.hbs", {errors: err.message.split("\n")});
    }
});

router.all("*", (req, res) => {
    res.render("404.hbs");
});


module.exports = router;
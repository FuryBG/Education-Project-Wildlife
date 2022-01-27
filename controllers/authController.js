const router = require("express").Router();
const { COOKIE_NAME } = require("../config");
const { isGuest, isUser } = require("../middlewares/guards");

const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


    router.get("/register", isGuest(), (req, res) => {
        res.render("register.hbs");
    });

    router.post("/register", isGuest(), async(req, res) => {
        try{
            let errors = [];

            if(req.body.firstName.length < 3) {
                errors.push("First Name should be 3 chars or more.")
            }

            if(req.body.lastName.length < 5) {
                errors.push("Last Name should be 5 chars or more.")
            }

            if(!req.body.email.match(emailRegEx)) {
                errors.push("Email is not valid!");
            }

            if(req.body.password.length < 4) {
                errors.push("Password must be 4 symbols or more.");
            }

            if(req.body.password != req.body.rePass) {
                errors.push("Passwords should be equal!");
            };

            if(errors.length > 0) {
                throw new Error(errors.join("\n"));
            }

            await req.auth.register(req.body.firstName, req.body.lastName, req.body.email, req.body.password);
        res.redirect("/");
        }catch(err) {
            console.log(err);
            res.render("register.hbs", {errors: err.message.split("\n")});
        }
    });

    router.get("/login", isGuest(), (req, res) => {
        res.render("login.hbs");
    });

    router.post("/login", isGuest(), async(req, res) => {
        try {
            let errors = [];

            await req.auth.login(req.body.email, req.body.password);
            res.redirect("/");
        }catch(err) {
            console.log(err);
            res.render("login.hbs", {errors: err.message.split("\n")});
        }
    });

    router.get("/logout", isUser(), (req, res) => {
        res.clearCookie(COOKIE_NAME);
        res.redirect("/");
    });


module.exports = router;
const userService = require("../services/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { TOKEN_SECRET, COOKIE_NAME } = require("../config");

module.exports = () => (req, res, next) => {
        if(parseToken(req, res)) {
        req.auth = {
            register,
            login,
            logout
        }
        next();
    }


    async function register(firstName, lastName, email, password) {

        const existing = await userService.getUserByEmail(email);
    
        if(existing) {
            console.log("Email is taken!");
            throw new Error("Email is taken!");
        };
    
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userService.createUser(firstName, lastName, email, hashedPassword);
        
        res.cookie(COOKIE_NAME ,generateToken(user));
    };
    
    async function login(email, password) {
        const existing = await userService.getUserByEmail(email);
    
        if(!existing) {
            console.log("No such user!");
            throw new Error("Username or password is wrong!");
        }
    
        const isMatch = await bcrypt.compare(password, existing.hashedPassword);
    
        if(!isMatch) {
            console.log("Incorrect password!");
            throw new Error("Username or password is wrong!");
        }
    
        res.cookie(COOKIE_NAME ,generateToken(existing));
    };

    function logout() {
        res.clearCookie(COOKIE_NAME);
    };

};







function generateToken(userData) {
    const token = jwt.sign({
        firstName: userData.firstName,
        lastName: userData.lastName,
        _id: userData._id,
        email: userData.email
    }, TOKEN_SECRET);
    return token;
};

function parseToken(req, res) {
    const token = req.cookies[COOKIE_NAME];
    if(token) {
    try {
    const userData = jwt.verify(token, TOKEN_SECRET);
        req.user = userData;
        res.locals.user = userData;
    }catch(err) {
        res.clearCookie(COOKIE_NAME);
        res.redirect("/auth/login");
        return false;
    }
}
return true;
};



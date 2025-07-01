const jwt = require('jsonwebtoken');

const authMiddleware = (roles = []) => (req, res, next) => {
    const token = req.headers['authorization']
    if (!token) return res.status(401).send("Un Authorized");

    try {
        const verified = jwt.verify(token, 'accessSecretKey');
        req.user = verified;
        if (roles.length && !roles.includes(req.user.role)) {
            return res.status(403).send("Access Denied");
        }
        next();
    } catch (err) {
        res.status(400).send("Invalid Token");
    }
};


module.exports = authMiddleware;

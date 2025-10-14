import jwt from "jsonwebtoken";
const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

function authenticate(req, res, next) {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.redirect(302, "/login");
    }

    const token = authHeader.split(" ")[1];

    try {
        jwt.verify(token, SUPABASE_JWT_SECRET);
        next();
    } catch (err) {
        console.error("JWT verification failed:", err.message);
        return res.redirect(302, "/login");
    }
}

export default authenticate;
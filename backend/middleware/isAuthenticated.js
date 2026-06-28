import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.logintoken;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "User is not authenticated. Token missing."
            });
        }

        const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        if (!decode || !decode.userId) {
            return res.status(401).json({
                success: false, 
                message: "Invalid or expired session token."
            });
        }

        
        req.id = decode.userId;
        req.user = { _id: decode.userId }; 
        
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            success: false,
            message: "Session expired or authentication failed.",
            error: error.message
        });
    }
};

export { isAuthenticated };
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser"

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.logintoken
        if(!token) {
            return res.status(401).json({
                message: "User is not authenticated"
            })
        }
        const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY)

        // console.log(decode);
        
        if(!decode) {
            return res.status(401).json({
                sucess: false, 
                message: ""
            })
        }
        req.id = decode.userId
        
        next()
    } catch (error) {
        console.log(error)
    }
}

export {isAuthenticated}
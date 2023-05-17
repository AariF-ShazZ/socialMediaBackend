import jwt, { verify } from "jsonwebtoken"
const verifyToken = async (req,res,next) => {
    try{
        let token = req.header("Authorization")
        if(!token)return res.status(403).send("Access Denied")

        const verified = jwt.verify(token, process.env.jwt_key)
        req.user  = verified
        next()

    }catch(err){
        res.status(500).json({error: err.message})
    }
}
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel  from "../models/User.js";

export const register = async (req,res) =>{
    try{
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body
        console.log(req.body);
        bcrypt.hash(password, 5, async (err, hash) => {
            // Store hash in your password DB.
            if(err){
                res.send(err)
            }else{
                const user = new UserModel({
                    firstName,
                    lastName,
                    email,
                    password:hash,
                    picturePath,
                    friends,
                    location,
                    occupation,
                    viewedProfile:Math.floor(Math.random() * 10000),    
                    impression:Math.floor(Math.random() * 10000)
                })
                const savedUser = await user.save()
                console.log(savedUser)
                res.status(201).json(savedUser)
            }
        });
    }catch (err){
        res.status(500).json({error:err.message})
    }
}

/* LOGGING IN */

export const login = async (req, res) => {
   try{
        const {email, password}   =  req.body
        console.log(req.body);
        const user = await UserModel.findOne({email: email})
        if(!user) return res.status(400).json({msg :"User does not exist. "})
        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch)  return res.status(400).json({msg :"Invalid credentials. "})
        const token = jwt.sign({id:user.id}, process.env.jwt_key)
        delete user.password 
        res.status(200).json({token, user})

   }catch(err){
    res.status(500).json({error :err.message})
   }
}
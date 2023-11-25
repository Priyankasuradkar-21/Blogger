const User = require("../modals/User");
const imageUploader = require("../utils/imageUploader");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { isValidEmail, isValidMobileNumber } = require("../utils/validations");

const userRegistration = async (req, res) => {
    try{
        const {email , username , mobileNumber, password } = req.body;

        if(!email || !username || !password)
            return res.status(401).json({
                success : false,
                message : 'Please provide required fields'
            })
            
        const isUserAlreadyExists = await User.findOne({email}).lean();
        if(isUserAlreadyExists)
            return res.status(403).json({
                success : false,
                message : 'Account already exists'
            })

        const encryptPassword = await bcrypt.hash(password, 12)
        if(!isValidEmail(email))
            return res.status(403).json({
                    success : false,
                    message : 'Invalid Email Address'
            })

        // if(!isValidMobileNumber(mobileNumber))
        //     return res.status(403).json({
        //             success : false,   
        //             message : 'Invalid Mobile Number'
        //     })
        
        let image;
        if(req.file){
            image = await imageUploader(req.file);
        }
       
        const userRegistrationObject = {
            email,
            username,
            mobileNumber,
            password:encryptPassword,
            profile : image?.Location !== undefined ? image.Location : ""
        }

        const userObject = new User(userRegistrationObject);
        userObject.save();

        return res.status(200).json({
            success : true,
            message : 'User registered successfully'
        });
    }catch(err){
        console.log('############', err);
        return res.status(500).json({
            success : false,
            message : 'Something went wrong, Please try again later'
        })
    }
}

const login = async(req, res) => {
    try{
        const {email, password} = req.body;
        const isUserExistOrNot = await User.findOne({email : email.trim()}).lean();
        
        if(!isUserExistOrNot)
            return res.status(404).json({
                success : false,
                message : 'Email not found'    
            })
        
        const isPasswordMatched = await bcrypt.compare(password, isUserExistOrNot.password);
        console.log(isPasswordMatched)
        if(!isPasswordMatched)
            return res.status(403).json({
                success : false,
                message : 'Incorrect Password'
            })
        
        const token =  await jwt.sign({email : email}, process.env.SECRET_JWT_KEY);
        return res.status(200).json({
            success : true,
            token : token,
            email
        })
    }catch(err){
        console.log('############', err);
        return res.status(500).json({
            success : false,
            message : 'Something went wrong, Please try again later'
        })
    }
}

const updateUser = async(req, res) => {
    try{
        const email = req.user.email
        const {username,password,mobileNumber,profile} = req.body
        await User.findOne({email}).lean()
        const userDataToUpdate = {}

        if(username)    
            userDataToUpdate["username"] = username

        if(email)
            userDataToUpdate["email"] = email

        if(password)
            userDataToUpdate["password"] = password

        if(mobileNumber)
            userDataToUpdate["mobileNumber"] = mobileNumber

        if(profile)
            userDataToUpdate["profile"] = profile

        await User.updateOne({email},{$set:userDataToUpdate})
        return res.status(200).json({
            success:true,
            message:"Updated successfully"
        })

    }catch(err){
        console.log('############', err);
        return res.status(500).json({
            success : false,
            message : 'Something went wrong, Please try again later'
        })
    }
}

const getUser = async(req, res) => {
    try{
        const email = req.user.email;
        const userDetails = await User.findOne({email}).lean();
        console.log("EMAIL:::",email)
        return res.status(200).json({
            success : true,
            message : userDetails
        })

    }catch(err){
        console.log('############', err);
        return res.status(500).json({
            success : false,
            message : 'Something went wrong, Please try again later'
        })
    }
}

const deleteUser = async (req, res) => {
    try{
        const email = req.user.email;
        await User.deleteOne({email});
        return res.status(200).json({
            success : true,
            message : 'User Deleted Successfully'
        })

    }catch(err){
        console.log('############', err);
        return res.status(500).json({
            success : false,
            message : 'Something went wrong, Please try again later'
        })
    }
}

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = {
    userRegistration,
    login,
    getUser,
    deleteUser,
    updateUser,
    upload
}
const Blog = require("../modals/Blog"); 
const imageUploader = require("../utils/imageUploader");
const multer = require('multer')

const createBlog = async (req, res) => {
    try{
        const email = req.user.email
        const {blogTitle, blogDescription} = req.body;

        let image;
        if(req.file)
            image = await imageUploader(file);
             
        
        const blogObject = {
            email,
            blogTitle,
            blogDescription,
            blogImage : image?.Location
        }

        const blogData = new Blog(blogObject);
        await blogData.save();

        return res.status(200).json({
            success : true,
            message : 'Blog Uploaded successfully'
        });
    }catch(err){
        console.log('############', err);
        return res.status(500).json({
            success : false,
            message : 'Something went wrong, Please try again later'
        })
    }
}

const updateBlog = async (req, res) => {
    try{
        const email = req.user.email;
        const {id, blogTitle, blogDescription, like, comment} = req.body;

        const blogUpdateObject = {};

        if(req.file){
            const image = await imageUploader(req.file);
            blogUpdateObject["blogImage"] = image.Location
        }

        if(blogTitle) 
            blogUpdateObject["blogTitle"] = blogTitle

        if(blogDescription)
            blogUpdateObject["blogDescription"] = blogDescription

        if(like){
            await Blog.updateOne({email, _id : id}, {
                $push : {
                    "likes" : like
                }
            })
        }

        if(comment){
            await Blog.updateOne({email, _id : id}, {
                $push : {
                    "comments" : comment
                }
            })
        }

        await Blog.updateOne({email, _id : id}, {
            $set : blogUpdateObject
        })

        return res.status(200).json({
            success : true,
            message : 'Blog Updated successfully'
        });
            
    }catch(err){
        console.log('############', err);
        return res.status(500).json({
            success : false,
            message : 'Something went wrong, Please try again later'
        })
    }
}

const getBlog = async(req, res) => {
    try{
        const id = req.params.id;
        const email = req.user.email;

        const postDetails = await Blog.findOne({email, _id : id}).lean();
        return res.status(200).json({
            success : true,
            message : postDetails
        })
    }catch(err){
        console.log('############', err);
        return res.status(500).json({
            success : false,
            message : 'Something went wrong, Please try again later'
        })
    }
}

const getAllBlog = async(req, res) => {
    try{
        const email = req.user.email;
        const postDetails = await Blog.findOne({email}).lean();
        return res.status(200).json({
            success : true,
            message : postDetails
        })
    }catch(err){
        console.log('############', err);
        return res.status(500).json({
            success : false,
            message : 'Something went wrong, Please try again later'
        })
    }
}

const deleteBlog = async(req, res) => {
    try{
        const id = req.params.id;
        const email = req.user.email;

        await Blog.deleteOne({email, _id : id});
        return res.status(200).json({
            success : true,
            message : 'Post Deleted Successfully'
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
    createBlog,
    updateBlog,
    getBlog,
    getAllBlog,
    deleteBlog,
    upload
}
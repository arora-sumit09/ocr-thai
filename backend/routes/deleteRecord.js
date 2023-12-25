const express= require("express");
const User=require('../Model/model');
const router = express.Router();



router.post('/deleterecord/:id', async (req,res)=>{
   
    try {
        
        let users= await User.findOneAndDelete({ _id: req.params.id });
        
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json({ msg: 'User deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Some error found");
    }
})


module.exports = router;
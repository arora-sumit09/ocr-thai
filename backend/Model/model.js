const mongoose= require('mongoose');
const {Schema}=mongoose;
const userSchema= new Schema({

    identification_number:{
        type:String,
        required:true
    },

    first_name:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    dob:{
        type:String,
        required:false
    },
    issueDate:{
        type:String,
        required:false
    },
    expiryDate:{
        type:String,
        required:false
    },
    status:{
       type:String,
       required:true,
       default:'Success'
    },
    
    date:{
        type:Date,
        default:new Date
        
    }

})

// Now, we need to export and create our Model. So call the module. exports and we want to export the mongoose model and we need to specify arguments to this model() method. The first argument is gonna be the name of the model. So let’s name our model as “Employee“, and the second argument is our Schema that is employeeSchema.

const User=mongoose.model('user',userSchema);;
User.createIndexes();
module.exports=User;
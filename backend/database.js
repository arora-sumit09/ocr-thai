const mongoose= require('mongoose');
const newrul="mongodb+srv://20ucs204:20ucs204@cluster0.sbkl3yo.mongodb.net/?retryWrites=true&w=majority";

const database= ()=>{
     mongoose.connect(newrul).then(
        ()=>{
        console.log("Database Successfully Connected");
    })
    .catch((err) =>{
        console.log("Erorr while connection");
    })

    

}

module.exports=database;
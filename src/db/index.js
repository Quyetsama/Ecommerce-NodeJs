const mongoose  = require("mongoose")

async function connect(){
    try{
        await mongoose.connect(process.env.DB)
        console.log("Mongodb connect successfully!!!")
    } catch(error){
        console.log("Mongodb connect failure!!!");
        console.log(error)
    }
}

module.exports = { connect };

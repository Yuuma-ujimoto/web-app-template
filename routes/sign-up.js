const express = require("express")
const router = express.Router()
const mongodb = require("mongodb")
const MongoClient = mongodb.MongoClient
const config = require("./mongodb-config")


router.get("/",(req, res) => {
    res.render("sign-up",{error:false})
})

router.post("/",async (req, res, next) => {
    const mail_address = req.body.mail_address
    const user_name = req.body.user_name
    const password = req.body.password

    // メールアドレス正規表現チェック
    const mail_pattern = /^[\w\-._]+@[\w\-._]+\.[A-Za-z]+$/
    if(!mail_address.match(mail_pattern)){
        res.render("sign-up",{error:true})
        return
    }

    const post_data_check =  !mail_address||!password||!user_name
    if(post_data_check){
        res.render("sign-up",{error:true})
        return
    }
    let client
    try {
        client = await MongoClient.connect(config.url,config.option)
        const db = client.db("mydb")
        const user_collection = db.collection("user")
        const check_mail_address = await user_collection.countDocuments({mail_address:mail_address})
        if(check_mail_address){
            res.render("sign-in",{error:true})
            return
        }
        await user_collection.insertOne({user_name:user_name,mail_address:mail_address,password:password})
        const user_data = await user_collection.findOne({mail_address:mail_address})
        req.session.user_id = user_data._id
        res.redirect("/")
    }

    catch (e) {
        console.log(e)
        res.render("sign-up",{error:true})
    }
    finally {
       await client.close()
    }
})

module.exports = router
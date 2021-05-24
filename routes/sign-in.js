const express = require("express")
const router = express.Router()
const mongodb = require("mongodb")
const MongoClient = mongodb.MongoClient
const config = require("./mongodb-config")


router.get("/",(req, res) => {
    res.render("sign-in",{error:false})
})

router.post("/",async (req, res, next) => {
    const mail_address = req.body.mail_address
    const password = req.body.password
    const post_data_check =  !mail_address||!password
    if(post_data_check){
        res.render("sign-in",{error:true,})
        return
    }
    let client
    try {
        client = await MongoClient.connect(config.url,config.option)
        const db = client.db(config.dbname)
        const user_collection = db.collection("user")
        const check_user = await user_collection.countDocuments({mail_address:mail_address,password:password})
        if(!check_user){
            // パスワードとメールアドレスの組み合わせが一致しない場合
            res.render("sign-in",{error:true})
            return
        }
    }
    catch (e) {
        console.log(e)
        res.render("sign-in",{error:true})
        return
    }
    finally {
        await client.close()
    }
    res.redirect("/")
})

module.exports = router
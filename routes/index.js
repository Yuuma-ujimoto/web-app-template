const express = require("express")
const router = express.Router()

router.get("/",
    (req, res) => {
    const user_id = req.session.user_id
    if(!!user_id){
        res.render("index/login")
    }
    else{
        res.render("index/nologin")
    }
})

module.exports = router
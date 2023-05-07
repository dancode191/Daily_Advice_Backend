const PORT = process.env.PORT || 8000
const express = require('express')
const cors = require('cors')
const axios = require('axios')
const rateLimit = require('express-rate-limit')
require('dotenv').config()
var email = require("@emailjs/nodejs")



const app = express()

// enable cros
app.use(cors())

// use rate limiting to limit number of request to backend 
const limiter = rateLimit({
    windowMs: 10 * 60 * 500, //5 Mins
    max: 20
})

app.use(limiter)
app.set('trust proxy', 1)

app.listen(PORT, () => console.log(`server is runing on port ${PORT}`))

word_for_search = ''

const get_advice ={
    method: 'GET',
    url: 'https://api.adviceslip.com/advice'
}


app.get('/advice', (req, res)=>{
    axios.request(get_advice).then((response)=>{
        res.json(response.data.slip.advice)
    });
})

app.get('/searchWord', express.json(), (req, res)=>{
    const search_advices ={
        method: 'GET',
        url: 'https://api.adviceslip.com/advice/search/'+req.query.word
    }
    axios.request(search_advices).then((response)=>{
        res.send(response.data)
    })
})

app.post('/sendEmail', express.json(), (req,res)=>{

    email.send(
        process.env.SERVICE_ID, 
        process.env.TEMPLATE_ID, 
        req.body, 
        {
        publicKey: process.env.PUBLIC_KEY,
        privateKey: process.env.PRIVATE_KEY
        }
    )
    res.json()

})
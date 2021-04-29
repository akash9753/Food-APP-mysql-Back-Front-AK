const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const config = require('./config')
const adminRouter = require('./admin/routes/admin')
const foodRouter = require('./admin/routes/food')
const jwt = require('jsonwebtoken')


const app = express()
app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(cors())
function getuserid(request, response, next){
    console.log('inside get userid')
    if (request.url == '/admin/signin' || request.url == '/admin/signup'){
         //do not check for token
         next()
    }else{
    try{    
        
    const token = request.headers['token']
    
        const data = jwt.verify(token,config.secrete)
        
        //add a new key named userid with logged in user's id
        request.userid = data['id']
       
        //go to actual route
        next()
        
       }catch(ex){
           response.status(401)
           response.send({status : 'error',error:'procted api'})
       }
    }
}
app.use(getuserid)
console.log('/user')
app.use('/admin',adminRouter)

app.use('/food',foodRouter)
console.log('hello server')
// add a middleware for getting the idfrom token



//default route
app.get('/',(request,response)=>{
    response.send('welcome to my application')
})

console.log('hello server')
app.listen(3000,'0.0.0.0',()=>{
    console.log('server started on port 3000')
})
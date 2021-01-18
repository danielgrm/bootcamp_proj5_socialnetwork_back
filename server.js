const express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')
const fileUpload = require('express-fileupload');
const config = require('config')
const connectDB = require('./config/db');

const app = express()
const PORT = process.env.PORT || 3005;

// Init Middleware
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'))

app.use(fileUpload({
    createParentPath: true
}));


// Connect Database
connectDB()
// const debug = process.env.DEBUG || config.get('DEBUG')
// if(debug){
//     connectDB()
// }else{
//     const db = process.env.mongoTestURI ||config.get('mongoTestURI')
//     connectDB(db)
// }

app.get('/', (req, res) => res.send('Hello!'))
app.use('/auth', require('./routes/api/auth'))
app.use('/dislike', require('./routes/api/dislike'))
app.use('/follows', require('./routes/api/follows'))
app.use('/like', require('./routes/api/like'))
app.use('/post', require('./routes/api/post'))
app.use('/user', require('./routes/api/user'))

const server = app.listen(PORT, () => { console.log(`port ${PORT}`) })


module.exports =  {app , server}
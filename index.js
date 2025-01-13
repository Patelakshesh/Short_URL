const express =  require('express')
const {connectToMongoDB} = require('./connect')
const cookieParser = require('cookie-parser')
const path = require('path')
const urlRoute = require('./routes/url')
const staticRotes = require('./routes/staticRouter')
const URL = require('./models/url')
const userRoute = require('./routes/user')
const { checkForAuthentication, restrictTo} = require('./middlewares/auth')
const app = express();
const PORT = 8001;

connectToMongoDB('mongodb+srv://akshesh:Your_Passwor@cluster0.wi6ht.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => console.log('mongoDB connected'))

app.set('view engine', 'ejs');
app.set("views", path.resolve('./views'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(checkForAuthentication)

app.use('/url', restrictTo(["NORMAL"]),  urlRoute)
app.use('/',  staticRotes)
app.use('/user', userRoute);

app.get('/url/:shortId', async(req,res) => {
    const shortId = req.params.shortId;
   const entry =  await URL.findOneAndUpdate({
        shortId
    }, { $push: {
        visitHistory: {
            timestamp: Date.now()
        },
    },
}
)
res.redirect(entry.redirectURL)
})

app.listen(PORT, () => console.log(`server started at port ${PORT}`))
const express = require('express');
const bodyparser = require('body-parser');
const session = require("express-session");
const cookieParser = require('cookie-parser');
const path = require('path');
const db = require('./pracauth01/database');
const routes = require('./pracauth01/routes');
const cors = require("cors");
const validateSession = require('./pracauth01/middleware');
const { error } = require('console');
const app = express();

//enable cors
app.use(cors());

// Optional: Add additional CORS configuration
app.use(
  cors({
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

//setting up session settings here
app.use(
  session({
    secret: "yourSecretKey", // Replace with a strong secret key
    resave: false, // Avoid resaving unchanged sessions
    saveUninitialized: true, // Save new sessions
    cookie: {
      httpOnly: true, // Prevents client-side JS from accessing the cookie
      secure: false, // Set to true if using HTTPS
      maxAge: 60000 * 30, // 1 day
    },
  })
);
app.use(bodyparser.json());
app.use(express.json());
app.use(express.static(path.join(__dirname, "views")));
app.use(express.static('views')); // Serve static files
app.use(cookieParser());


const PORT = 3000;

app.get('/',(req,res)=>{
    //res.send(`<h1>HELLO WORLD</h1>`);
    //console.log('hellow orld');
    res.render('login');
})

// app.get('/dashboard', validateSession, (req, res) => {
//     res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
// });

app.use("/api", routes);


db.query("SELECT 1").then(
    ()=>{
        console.log("DATABASE CONNECTED SUCCESSFULLY");
        
        app.listen(PORT,()=>{
            console.log(`the server is running on port${PORT}`);
        });
    }
).catch((error)=>{
    console.log(error);
})// Add Express server setup in server.js and package.json
// Add Express server setup in server.js and package.json

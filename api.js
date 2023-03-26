const express = require('express');
const app = express();
const port = process.env.PORT || 9900;
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
var bodyParser = require('body-parser');
const cors = require('cors');
const mongourl = `mongodb+srv://raghav03:QnMXBt7eV5056atD@cluster0.ubggb6k.mongodb.net/?retryWrites=true&w=majority`;
let db;
let col_name="userwarranty";

app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(__dirname+'/public'));
app.set('views','./src/views');
app.set('view engine','ejs');

app.get('/health',(req,res) => {
    res.status(200).send("Hello Ok")
});

//Get all user
app.get('/',(req,res) => {
    db.collection(col_name).find({isActive:true}).toArray((err,result) => {
        if(err) throw err
        res.render('checkWarranty',{data:result,nodata:''})
    });
});

//Get all user
app.get('/addWarranty',(req,res) => {
    res.render('addWarranty',{message:''})
});

//Add the user
app.post('/addWarranty',(req,res) => {
    const data = {
        "name":req.body.name,
        "model":req.body.model,
        "serial":req.body.serial,
        "dealer_name":req.body.dealer,
        "date":req.body.date,
    }
    db.collection(col_name).find({"serial":req.body.serial}).toArray((err,result) =>{
        if(result.length>0){
            res.render('addWarranty',{message:'Serial Number Already Added'})
        }else{
            db.collection(col_name).insert(data,(err,result) => {
                if(err){
                    throw err
                }else{
                    res.redirect('/')
                }
            })
        }
    })
});

app.post('/',(req,res) => {
    db.collection(col_name).find({"serial":req.body.serial}).toArray((err,result) => {
        if(err) throw err
        if(result.length>0){
            res.render('checkWarranty',{data:result,nodata:''})
        }else{
            res.render('checkWarranty',{data:result,nodata:'No Record Found'})
        }
        
    });
});



MongoClient.connect(mongourl,(err,client) => {
    if(err) console.log(err);
    db=client.db('warranty');
    app.listen(port,(err) => {
        console.log(`Server is running on port ${port}`)
    })
})

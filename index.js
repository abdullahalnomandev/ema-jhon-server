const express = require('express')
const cors =require('cors')
const app = express()
require('dotenv').config()
const port = 5000

app.use(cors())
app.use(express.json())
const MongoClient = require('mongodb').MongoClient;

// const uri= "mongodb+srv://emaJhon:test89@cluster0.ez7qy.mongodb.net/emaJhonSimple?retryWrites=true&w=majority"
const uri= `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ez7qy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


console.log(process.env.DB_USER,process.env.DB_PASS,process.env.DB_NAME);

client.connect(err => {
  const collection = client.db("emaJhonSimple").collection("products");
  const ordersCollection = client.db("emaJhonSimple").collection("orders");

  app.get('/',(req,res)=>{

    res.send("Hellow Bangladesh it's working")
  })

  app.post('/adProducts',(req,res)=>{
        const products=req.body;
        collection.insertOne(products)
        .then(result=>{
        console.log(result.insertedCount);
        res.send(result.insertedCount)
      })
      
  })

  app.get('/products',(req,res)=>{

    collection.find({})
    .toArray((err,document)=>{

      res.send(document)

    })
  })
 
  
  app.get('/product/:id',(req,res)=>{

    collection.find({key: req.params.id})
    .toArray((err,document)=>{

      res.send(document[0])

    })
  })
 

  app.post('/productsByKeys',(req,res)=>{

    const productKeys= req.body;
    collection.find({key: {$in:productKeys}})
    .toArray((err,document)=>{

      res.send( document)
    })
  })



  app.post('/addOrder',(req,res)=>{
    const order=req.body;
    ordersCollection .insertOne(order)
    .then(result=>{
    res.send(result.insertedCount > 0)
  })
  
})


});





app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at ${port}`)
})
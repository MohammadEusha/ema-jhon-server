//Copy paste it from express js website : 1
const express = require('express')
const app = express()
const port = 5000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(process.env.PORT || port)// 1


//Copy pase from npm dotenv site :2
require('dotenv').config()
////For read env 
console.log(process.env.DB_PASS);
console.log(process.env.DB_USER);//2



//Copy Connect from mongodb and pase here :3
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eax0o.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db("emaJohnStore").collection("products");

    //getting order products and user info in mongo:10
    const ordersCollection = client.db("emaJohnStore").collection("orders");//10
    console.log('database Connected');

    //Adding products :4
    app.post('/addProduct', (req, res) => {
        const products = req.body
        console.log(products);
        productsCollection.insertOne(products)
            .then(result => {
                console.log(result);
                res.send(result.insertedCount)
                console.log(result.insertedCount);
            })

    })


    //find data from mongodb :7 
    //****remove limit if not working****
    app.get('/products', (req, res) => {
        productsCollection.find({}).limit(20)
            .toArray((err, documents) => {
                res.send(documents)
            })

    })//7


    //find single data from mongodb :8
    //****remove limit if not working****
    app.get('/product/:key', (req, res) => {
        productsCollection.find({ key: req.params.key }).limit(20)
            .toArray((err, documents) => {
                res.send(documents[0])
            })

    })//8

    //find many data for review :9
    app.post('/productsByKeys', (req, res) => {
        const productsKeys = req.body;
        productsCollection.find({ key: { $in: productsKeys } })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })//9

    //getting order products and user info in mongo:10
    app.post('/addOrder', (req, res) => {
        const order = req.body
        ordersCollection.insertOne(order)
            .then(result => {
                console.log(result);
                res.send(result.insertedCount > 0)
                console.log(result.insertedCount);
            })

    })//10

});


//For bodyParser and cors require : 5
const bodyParser = require('body-parser')
const cors = require('cors')//5


//bodyParser and cors middleware :6
app.use(bodyParser.json())
app.use(cors())//6



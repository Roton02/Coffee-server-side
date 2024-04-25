const express = require('express')
const app = express()
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.COFFEE_USER}:${process.env.COFFEE_PASS}@cluster0.mi2xoxt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const coffeeDatabase = client.db('coffeeCollection').collection('coffee')

    app.get('/coffee',  async(req,res)=>{
      const cursor = await coffeeDatabase.find().toArray()
      res.send(cursor)
    })
    app.get('/coffee/users',async(req,res)=>{
      const cursor = coffeeDatabase.find();
      const result = await cursor.toArray()
      res.send(result)
    })
    app.patch('/coffee/users', async (req,res)=>{
      const user = req.body
      console.log(user);
      const filter = {email: user.email}
      const updateDoc = {
        $set: {
          lastSignIn:user.lastSignIn
        }
      }
      const result = await coffeeDatabase.updateOne(filter, updateDoc);
      res.send(result)
    })
    app.get('/coffee/:id', async (req, res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id)}
      const result = await coffeeDatabase.findOne(query);
      res.send(result)
    })

    app.post('/coffee', async (req, res)=>{
      const data = req.body;
      console.log("object", data );
      const result = await coffeeDatabase.insertOne(data);
      res.send(result)
    })
    app.put('/coffee/:id', async (req,res)=>{
      const id = req.params.id;
      console.log(id);
      const query = {_id: new ObjectId(id)};
      const updateCoffeeInfo = req.body
      console.log(updateCoffeeInfo);
      const updateCoffee = {
        $set: {
          name:updateCoffeeInfo.name,
           chef:updateCoffeeInfo.chef, 
           supplier:updateCoffeeInfo.supplier,
            taste:updateCoffeeInfo.taste,
             details:updateCoffeeInfo.details, 
             category:updateCoffeeInfo.category, 
             photo:updateCoffeeInfo.photo
        },
      }
      const options = { upsert: true };
      const result = await coffeeDatabase.updateOne(query, updateCoffee, options);
      res.send(result)
    })

    app.delete('/coffee/:id', async (req,res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeDatabase.deleteOne(query);
      res.send(result)
    })
    app.delete('/coffee/users/:id', async (req,res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeDatabase.deleteOne(query);
      res.send(result)
    })
    // user Releted 
    
    app.post('/coffee/users',async (req,res)=>{
      const data = req.body;
      console.log("object", data );
      const result = await coffeeDatabase.insertOne(data);
      res.send(result)
    })
    



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
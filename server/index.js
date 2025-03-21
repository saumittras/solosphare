const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
require('dotenv').config()

const port = process.env.PORT || 9000
const app = express()
const jwt = require('jsonwebtoken')

app.use(cors())
app.use(express.json())

// DB_USER=solosp_db
// DB_PASS=jL2shgj4UaCfo7jj

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@main.yolij.mongodb.net/?retryWrites=true&w=majority&appName=Main`

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s8hxf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

async function run() {
  try {
    const db = client.db('solo-db')
    const jobsCollections = db.collection('jobs')
    const bidsCollections = db.collection('bids')


  // generate JWT token
  app.post('/jwt', async(req,res)=>{
    const email = req.body
    // create token
    const token= jwt.sign(email, process.env.SECRET_KEY,{expiresIn: '365d'} )
    console.log(token)
    res.send(token)
  })



    // save a jobData in DB
    app.post('/add-job', async(req, res)=>{
      const jobData = req.body;
      const result = await jobsCollections.insertOne(jobData)
      // console.log(jobData)
      res.send(result)
    })

    //update a job
    app.put('/update-job/:id', async(req, res)=>{
      const id = req.params.id;
      const jobData = req.body;
      const query = {_id: new ObjectId(id)}
      const updated = {
        $set: jobData,
      }
      const option = {upsert: true}
      const result = await jobsCollections.updateOne(query, updated, option)
      // console.log(jobData)
      res.send(result)
    })

    // show all jobs
    app.get('/jobs', async(req, res)=>{
      const result = await jobsCollections.find().toArray();
      res.send(result)
    })



    // get Single job data
    app.get('/job/:id', async(req, res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await jobsCollections.findOne(query)
      res.send(result)

    })

    // delete a spesific job
    app.delete('/job/:id', async(req, res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await jobsCollections.deleteOne(query)
      res.send(result)
    })

    // to get buyer posted all data 
    app.get('/jobs/:email', async(req, res)=>{
      const email = req.params.email;
      const query = {'buyer.email': email}
      const result = await jobsCollections.find(query).toArray()
      res.send(result)
    })

    // save bid data in DB in bidsCollection

    app.post('/add-bid', async(req, res)=>{
      const bidData = req.body
      
      // validation for dubble bid
      const query = {email: bidData.email, job_Id: bidData.job_Id}
      const isExist = await bidsCollections.findOne(query)
      console.log(isExist)
      if(isExist) return res.status(400).send('You have already placed a bid on this job')

      // add a bid in bidsCollection
      const result = await bidsCollections.insertOne(bidData)

      // increase bid count the specific job
      const filter = {_id: new ObjectId(bidData.job_Id)}
      const update = {
        $inc:{ bid_count: 1}
      }

      const updateBidCount = await jobsCollections.updateOne(filter, update)
      res.send(result)
    })

    // get my all bids jobs
    app.get('/bids/:email', async(req, res)=>{
      const isBuyer = req.query.buyer
      const email = req.params.email
      let query; 
      if(isBuyer)
        {
          query= {buyerEmail: email}
    }else{
      query= {email: email}
    }
      const result = await bidsCollections.find(query).toArray()
      res.send(result)
    })

    // bid status update

    app.patch('/bid-status-update/:id', async(req, res)=>{
      const status = req.body.status
      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const updated = {
        $set:{status}
      }
      const result = await bidsCollections.updateOne(filter, updated)
      res.send(result)
    })

    //get all jobs
    app.get('/all-jobs', async(req, res)=>{
      const filter = req.query.filter
      const search = req.query.search
      const sort = req.query.sort
      let options;

      if(sort){
        options={sort: {deadline: sort ==='asc'? 1 : -1}}
      }
      let query ={
        title:{
          $regex: search, $options: 'i'
        }
      };
      if(filter){
        query = {category: filter }
      }
      const result = await jobsCollections.find(query, options).toArray();
      res.send(result)
    })



    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 })
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    )
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir)
app.get('/', (req, res) => {
  res.send('Hello from SoloSphere Server....')
})

app.listen(port, () => console.log(`Server running on port ${port}`))

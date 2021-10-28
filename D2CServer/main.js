
const express = require('express')
var cors = require('cors')
const { MongoClient } = require("mongodb");
const {constructSeatLayout, getEmptySeats, getSeatsToBook} = require("./seatManager")

const app = express()
app.use(express.json())
app.use(cors())
const port = 3000

const uri =
  "mongodb+srv://app_server:serverman@cluster0.l5jkx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri);


app.get('/', async (req, res) => {
  let booked = await req.app.locals.seats.find({}).toArray();
  res.send(booked)
})

app.delete('/clear', async (req, res) => {
  await req.app.locals.seats.remove();
  res.send({'msg': 'Successful'})
})

app.post('/book', async (req, res)=>{
  if (!"count" in req.body){
    res.statusMessage = "Should need seat count";
    res.status(400).end();
    return;
  }
  else if (req.body.count <=0 || req.body.count > 7){
    res.statusMessage = "Invalid seat count";
    res.status(400).end();
    return;
  }

  let booked = await req.app.locals.seats.find({}).toArray();
  let layout = constructSeatLayout(booked.map(value => value._id), 80, 7);
  let seatCount = req.body.count;

  if(getEmptySeats(layout).length < seatCount){
    res.send({
      'msg': `Sorry, only ${getEmptySeats(layout).length} seats are available`
    })
    return;
  }

  let seats = getSeatsToBook(seatCount, layout);
  seats = seats.map(seat => seat+1);
  let seatsToInsert = seats.map((seat)=>{return {"_id" : seat}});
  await req.app.locals.seats.insertMany(seatsToInsert);
  booked = await req.app.locals.seats.find({}).toArray();
  res.send({
    'now_booked': seats,
    'booked': booked
  })
})

async function run(){
  await client.connect();
  const database = client.db('train_reservation');
  app.locals.seats = database.collection('seats');
  app.listen(port, "0.0.0.0", () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
}

run();

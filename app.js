const express = require("express");
const app = express();
const PORT = process.env.PORT || 4001;

app.use(express.json());

const amqp = require("amqplib");
var channel, connection;

connectQueue(); // call connectQueue function
async function connectQueue() {
  try {
    connection = await amqp.connect(
      "amqps://rakeswqy:TQLGAcSh5D89pvC_OpxFMTScvFTfq1cA@moose.rmq.cloudamqp.com/rakeswqy"
    );
    channel = await connection.createChannel();
    // connect to 'test-queue', create one if doesnot exist already

    await channel.assertQueue("bike");
    await channel.assertQueue("location");
  } catch (error) {
    console.log(error);
  }
}
/*
const sendDataBike = async (data) => {
  // send data to queue
  connectQueue();
  await channel.sendToQueue("bike", Buffer.from(JSON.stringify(data)));

  // close the channel and connection
  await channel.close();
  connection.close();
};

const sendDataLocation = async (data) => {
  // send data to queue
  connectQueue();
  await channel.sendToQueue("location", Buffer.from(JSON.stringify(data)));

  // close the channel and connection
  await channel.close();
  connection.close();
};

app.post("/send_bike", (req, res) => {
  const dataBike = {
    idBike: req.body.idBike,
    color: req.body.color,
    model: req.body.model,
    longitud: req.body.longitud,
    latitud: req.body.latitud,
    state: req.body.latitud,
  };
  sendDataBike(dataBike);
  console.log("A message is sent to queue");
  res.send("Bike save");
});

app.post("/send_location", (req, res) => {
  const dataLocation = {
    idBike: req.body.idBike,
    longitud: req.body.longitud,
    latitud: req.body.latitud,
  }
  sendDataLocation(dataLocation);
  console.log("A message is sent to queue");
  res.send("Location bike save");
 
});*/

const sendDataBikeLocation = async (bike, location) => {
  // send data to queue
  connectQueue();
  await channel.sendToQueue("bike", Buffer.from(JSON.stringify(bike)));
  await channel.sendToQueue("location", Buffer.from(JSON.stringify(location)));
  // close the channel and connection
  await channel.close();
  connection.close();
};

const sendRental = async (bike, rental) => {
  // send data to queue
  connectQueue();
  await channel.sendToQueue("bike", Buffer.from(JSON.stringify(bike)));
  await channel.sendToQueue("rental", Buffer.from(JSON.stringify(rental)));
  // close the channel and connection
  await channel.close();
  connection.close();
};


app.post("/send_bike", (req, res) => {
  const dataBike = {
    idBike: req.body.idBike,
    color: req.body.color,
    model: req.body.model,
    longitud: req.body.longitud,
    latitud: req.body.latitud,
    state: req.body.state,
  };

  const dataLocation = {
    idBike: req.body.idBike,
    longitud: req.body.longitud,
    latitud: req.body.latitud,
  }
  sendDataBikeLocation(dataBike, dataLocation);
  console.log("A message is sent to queue");
  res.send("Bike save");
});



app.post("/rental", (req, res) => {
  const dataBike = {
    idBike: req.body.idBike,    
    state: req.body.state,
  };

  const dataRental = {
    idBike: req.body.idBike,
    dateInitial: req.body.dateInitial,
    dataFinished: req.dataFinished,
  }
  sendRental(dataBike, dataRental);
  console.log("A message is sent to queue");
  res.send("Bike rental");
});

app.listen(PORT, () => console.log("Server running at port " + PORT));

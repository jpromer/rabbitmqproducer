const express = require("express");
const app = express();
const PORT = process.env.PORT || 4001;

app.use(express.json());

const amqp = require("amqplib");
var channel, connection;

connectQueue(); // call connectQueue function
async function connectQueue() {
  try {
    connection = await amqp.connect("amqp://localhost:5672");
    channel = await connection.createChannel();

    // connect to 'test-queue', create one if doesnot exist already
    await channel.assertQueue("location");
    await channel.assertQueue("rental");
    await channel.assertQueue("bike");
  } catch (error) {
    console.log(error);
  }
}

const sendDataRental = async (data) => {
  // send data to queue
  connectQueue();
  await channel.sendToQueue("rental", Buffer.from(JSON.stringify(data)));

  // close the channel and connection
  await channel.close();
  await connection.close();
};

app.post("/send_rental", (req, res) => {
  const data = {
    idBike: req.body.idBike,
    dateInitial: req.body.dateInitial,
    dataFinished: req.body.dateFinished,
  };
  sendDataRental(data);
  console.log("A message is sent to queue");
  res.send("Message Sent");
});

app.listen(PORT, () => console.log("Server running at port " + PORT));

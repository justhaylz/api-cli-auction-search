const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const faker = require('faker');
const yargs = require('yargs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/auction', {
});

// Define Auction Schema
const auctionSchema = new mongoose.Schema({
  title: String,
  description: String,
  startingBid: Number,
  reservePrice: Number,
});

const Auction = mongoose.model('Auction', auctionSchema);

// API Endpoints
app.get('/api/auctions', async (req, res) => {
  const auctions = await Auction.find();
  res.json(auctions);
});

app.post('/api/auctions', async (req, res) => {
  const auction = new Auction(req.body);
  await auction.save();
  res.status(201).json(auction);
});

// CLI for generating sample data
yargs.command({
  command: 'generate',
  describe: 'Generate sample auction data',
  builder: {
    count: {
      describe: 'Number of auctions to generate',
      demandOption: true,
      type: 'number',
    },
  },
  handler: async (argv) => {
    for (let i = 0; i < argv.count; i++) {
      const auction = new Auction({
        title: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        start_price: faker.commerce.price(10, 100),
        reserve_price: faker.commerce.price(100, 200)
      });
      await auction.save();
    }
    console.log(`${argv.count} auctions generated`);
    process.exit();
  },
});

yargs.parse();

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

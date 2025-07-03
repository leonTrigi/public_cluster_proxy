const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// configs
const PRODUCTION_PUBLIC_DIRECTORY = path.join(__dirname, './public')
app.use(express.json());
app.use(express.static(PRODUCTION_PUBLIC_DIRECTORY));

// routes 
app.get('/home', (req, res) => { return res.redirect('/index.html'); });
app.get('/uptime', require('./uptime.js'));

app.post('/nfetch', require('./nfetch.js'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
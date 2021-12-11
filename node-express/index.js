const express = require('express'),http = require('http');
const morgan = require('morgan');
const hostname = 'localhost';
const bodyParser = require('body-parser');
const dishRouter = require('./routes/dishRouter');
const leaderRouter = require('./routes/leaderRouter');
const promoRouter = require('./routes/promoRouter');

const port = 3000;

const app = express();

app.use(morgan('dev')); 
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use('/dishes', dishRouter);
app.use('/leaders', leaderRouter);
app.use('/promotions', promoRouter);
const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
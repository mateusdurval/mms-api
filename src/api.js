const express = require('express');
const routes = require('./routes');
const crons = require('./crons');
const { insertCandles } = require('./commom/insertCandles');

require('./database');

const app = express();

app.use(express.json());
app.use(routes);

insertCandles();
crons.start();

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('the server is running on port', port)
})
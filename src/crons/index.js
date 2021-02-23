const cron = require('node-cron');
const { insertCandles } = require('../commom/insertCandles');

const start = () => {
    cron.schedule('5 4 * * *', () => {
        insertCandles();
    });
}

module.exports = { start }
const axios = require('axios')
const moment = require('moment');
const { Coin, sequelize } = require('../models/');

const insertCandles = async () => {
    
    const transaction =  await sequelize.transaction();
    
    try {
        const from = moment(new Date()).subtract(1, 'y').unix();
        const to = moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD").unix();

        const lastRecordBtcRecord = await Coin.findOne({
            order: [ [ 'id', 'DESC' ]],
            where: {
                pair: 'BRLBTC'
            },
        });

        const lastRecordLeth = await Coin.findOne({
            where: {
                pair: 'BRLETH'
            },
            order: [ [ 'id', 'DESC' ]]
        });

        let lastRecordBtcDay = null;
        let diffBtc = -1;

        let lastRecordLethDay = null;
        let diffLeth= -1;
        
        if (lastRecordBtcRecord) {
            lastRecordBtcDay = moment(lastRecordBtcRecord.timestamp, "YYYY-MM-DD")
            diffBtc = moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD").diff(lastRecordBtcDay, "days");
        }

        if (lastRecordLeth) {
            lastRecordLethDay = moment(lastRecordLeth.timestamp, "YYYY-MM-DD")
            diffLeth = moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD").diff(lastRecordLethDay, "days");
        }

        const mms_20 = 20;
        const mms_50 = 50;
        const mms_200 = 200;

        const resultBtc = await consultMercadoBitcoin(from, to, 'BRLBTC');
        let dataBtc = treatReturn(resultBtc.data.candles, mms_20, mms_50, mms_200, 'BRLBTC');

        
        const resultLeth = await consultMercadoBitcoin(from, to, 'BRLETH');
        let dataLeth = treatReturn(resultLeth.data.candles, mms_20, mms_50, mms_200, 'BRLETH');

        if (diffBtc > 0) {
            dataBtc = dataBtc.slice(dataBtc.length - 1 - diffBtc, dataBtc.length);
        } else if (diffBtc === 0 ){
            dataBtc = [];
        }

        if (diffLeth > 0) {
            dataLeth = dataLeth.slice(dataLeth.length - 1 - diffLeth, dataLeth.length)
        } else if (diffLeth === 0 ){
            dataLeth = [];
        }

        await Coin.bulkCreate(dataBtc, { transaction });
        await Coin.bulkCreate(dataLeth, { transaction });

        await transaction.commit();

    } catch(err) {
        await transaction.rollback();
    }
}

const consultMercadoBitcoin = async (from, to, coin) => {
    try {
        const result = await axios.get(`https://mobile.mercadobitcoin.com.br/v4/${coin}/candle?from=${from}&to=${to}&precision=1d`)
        return result
    } catch(err) {
        throw err;
    }
}

const treatReturn = (result, mms_20, mms_50, mms_200, pair) => {
    try {
        if (result === null) return [];

        let position_mms20 = 0;
        let position_mms50 = 0;
        let position_mms200 = 0;

        const data = result.map((value, index) => {
            let result_mms20 = null;
            let result_mms50 = null;
            let result_mms200 = null;

            if (index >= mms_20 - 1) {
                result_mms20 = 0
                const ped_mms20 = result.slice(position_mms20, index + 1)

                ped_mms20.forEach((obg) => {
                    result_mms20 += obg.close
                })

                result_mms20 = (result_mms20 / mms_20).toFixed(2)
                position_mms20 += 1;
            }

            if (index >= mms_50 - 1) {
                result_mms50 = 00
                const ped_mms50 = result.slice(position_mms50, index + 1)

                ped_mms50.forEach((obg) => {
                    result_mms50 += obg.close
                })

                result_mms50 = (result_mms50 / mms_50).toFixed(2)
                position_mms50 += 1;
            }

            if (index >= mms_200 - 1) {
                result_mms200 = 0
                const ped_mms200 = result.slice(position_mms200, index + 1)

                ped_mms200.forEach((obg) => {
                    result_mms200 += obg.close
                })

                result_mms200 = (result_mms200 / mms_200).toFixed(2)
                position_mms200 += 1;
            }
            return {
                pair,
                mms_20: result_mms20,
                mms_50: result_mms50,
                mms_200: result_mms200,
                timestamp: moment(new Date(value.timestamp * 1000)).format('YYYY-MM-DD HH:mm:ss'),
            }
        });
        return data;
    } catch(err) {
        throw err;
    }
}

module.exports = { insertCandles }
const { Coin } = require('../models')
const { Op } = require('Sequelize')
const moment = require('moment')

module.exports = {
    async mms(req, res) {
        try {
            const { pair } = req.params
            let { from, to, range } = req.query

            if (!to) {
                to = moment().subtract(1, 'd').format("YYYY-MM-DD HH:mm:ss") //default 'to' date
            } else {
                to = moment(parseInt(to)).format("YYYY-MM-DD HH:mm:ss")
            }

            from = moment(parseInt(from)).format("YYYY-MM-DD HH:mm:ss")

            const days = moment(new Date()).diff(from, 'days')

            if (days > 365) {
                throw new Error("the start date greater than 365 days")
            }

            const results = await Coin.findAll({ 
                attributes: [`mms_${range}`, 'timestamp'],
                where: { 
                    pair: pair.toUpperCase(), 
                    timestamp: { 
                        [Op.between]: [from, to]
                    }
                }
            })

            const data = results.map((register) => {
                return {
                    ...register.dataValues,
                    timestamp: moment(register.timestamp).unix()
                }
            });
                    
            return res.status(200).json(data)

        } catch(err) {
            return res.status(400).json({
                status_code: 400,
                status_message: err.message
            })
        }
    }
}
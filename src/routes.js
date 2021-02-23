const express = require('express')
const CoinController = require('./controllers/CoinController')

const { validationMiddleware } = require('./controllers/validators/coinMiddlewareValidation')

const routes = express.Router()

routes.get('/:pair/mms', validationMiddleware, CoinController.mms)

module.exports = routes
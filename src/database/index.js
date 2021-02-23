const Sequelize = require('Sequelize')
const dbConfig = require('../config/database')

const connection = new Sequelize(dbConfig)

try {
    connection.authenticate()
    console.log('Connection successfully made to the database.')
} catch (err) {
    console.error('Unable to connect to the database:', error)
}

module.exports = connection


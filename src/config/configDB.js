const { Sequelize } = require( "sequelize" )
require('dotenv').config()

const sequelize = new Sequelize (
    process.env.DB_DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: true, // Opcional -> O logging ira imprimir tudo que esta sendo executado dentro do banco de dados.
    }
)

module.exports = { sequelize }
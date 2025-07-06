const { DataTypes } = require('sequelize')
const { sequelize } = require('../../../config/configDB')

const Prato = sequelize.define(
    'Prato',
    {
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        },
        descricao: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        preco: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        categoria: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        tempo_preparo: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        disponivel: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        ingredientes: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        imagem_url: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }
)

module.exports = Prato

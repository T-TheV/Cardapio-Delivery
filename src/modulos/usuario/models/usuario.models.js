const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../config/configDB')

const Usuario = sequelize.define(
    'Usuario',
    {
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        },
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            validate: {
                is: {
                     args: /^[A-Za-z]\d{4}$/,
                    msg: "Só é possível inserir 1 letra maiuscula e 4 digitos númericos"
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: { msg: "Email Inválido"}
            }
        },
        senha: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: {
                    args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
                    msg: 'A senha deve ter no mínimo 8 caracteres, com letra maiúscula, minúscula, número e caractere especial.'
                }
            }
        }
    },
    {
        tableName: 'usuario',
        createdAt: 'criado_em',
        updatedAt: 'atualizado_em'
    }
);

module.exports = Usuario
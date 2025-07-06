const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const { sequelize } = require("./src/config/configDB")
const authRoute = require("./src/modulos/autenticacao/routes/autenticacao.routes")
const usuarioRoute = require("./src/modulos/usuario/routes/usuario.routes")
const pratoRoute = require("./src/modulos/prato/routes/prato.routes")

dotenv.config();

const app = express()
app.use(cors({
    origin: 'http://localhost:5173',    //frontEnd react
    credentials: true       //Permite enviar cookies (como refreshToken)
}))


app.use(express.json());


app.use('/api/', pratoRoute)

app.use('/api/', usuarioRoute)

app.use('/api/', authRoute)

const PORTA = process.env.PORTA

app.listen(PORTA, async () => {
    try {
        await sequelize.authenticate()
        console.log('Conexão com o banco de dados foi estabelecida com sucesso.')

        await sequelize.sync({ force: true, alter: true })
        console.log("Banco de dados sincronizado com sucesso")
    } catch (error) {
        console.error('Erro ao conectar ou sincronizar com o banco de dados', error.message);
    }
    console.log(`Servidor rodando na porta ${PORTA}`)
})
const Usuario = require("../models/usuario.models")
const bcrypt = require('bcryptjs')

class UsuarioController {
    static async cadastrar(req, res){
        try {
            const { nome, id, email, senha } = req.body;
            if( !id || !nome || !email || !senha){
                return res.status(400).json({ msg: "Todos os campos devem ser preenchidos" })
            }
            const senhaCriptografada = await bcrypt.hash(senha, 15);
            await Usuario.create({ nome, id, email, senha: senhaCriptografada })
            res.status(200).json({msg: 'Usuario cadastrado com sucesso' })
        } catch (error) {
            res.status(500).json({ msg: "Erro ao cadastrar um novo usuario. Tente novamente mais tarde!", erro: error.message})
        }
    }

    static async perfil (req, res){
        try {
            const { id } = req.usuario
            const usuario = await Usuario.findOne({
                where: {id},
                attributes: ["nome", "email", "id"]

            });
            if(!usuario){
                return res.status(401).json({ msg: "Não existe esse usuário cadastrado! "});
            }
            res.status(200).json(usuario)
        } catch (error) {
        res.status(500).json({msg: 'Erro do servidor. Tente novamente mais tarde!'})
        }
    }
}

module.exports = UsuarioController
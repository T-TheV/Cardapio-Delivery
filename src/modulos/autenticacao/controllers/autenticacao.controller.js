const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();
const Usuario = require("../../usuario/models/usuario.models")

// Definindo variaveis de ambiente para o TEMPO_ACESS_TOKEN e TEMPO_REFRESH_TOKEN
const tempo_acess_token = process.env.TEMPO_ACESS_TOKEN;
const tempo_refresh_token = process.env.TEMPO_REFRESH_TOKEN;

class AutenticacaoController {
    // Gerando o token 
    static gerarTokenAcesso(dadosUsuario) {
        return jwt.sign(dadosUsuario, process.env.SECRET_KEY, {
            expiresIn: tempo_acess_token
        });
    };
    // Refresh Token 
    static gerarRefreshToken(dadosUsuario) {
        return jwt.sign(dadosUsuario, process.env.SECRET_KEY, {
            expiresIn: tempo_refresh_token
        });
    };
    // Fazendo o login
    static async login(req, res) {
        try {
            // Criando o corpo da requisição
            const { email, senha } = req.body;
            if (!email || !senha) {
                return res.status(400).json({ msg: 'É necessario informar o E-mail e a senha para efetuar o login' })
            }
            const usuario = await Usuario.findOne({
                where: { email }
            });
            if (!usuario) {
                return res.status(401).json({ msg: "Usuário não encontrado!" })
            };
            const senhaCorreta = await bcrypt.compare(senha, usuario.senha)
            if (!senhaCorreta) {
                return res.status(400).json({ msg: "Credenciais Inválidas" })
            }
            const dadosUsuario = {
                nome: usuario.nome,
                email: usuario.email,
                papel: 'usuario'
            }
            // Gerando tokens
            const tokenAcesso = AutenticacaoController.gerarTokenAcesso(dadosUsuario)
            const refreshToken = AutenticacaoController.gerarRefreshToken(dadosUsuario)

            res.cookie("refreshToken", refreshToken, {
                httpOnly: false,
                secure: process.env.NODE_ENV,
                sameStrict: 'strict',
                maxAge: 1 * 24
            })

            res.status(200); json({
                tokenAcesso,
                nome: usuario.nome,
                id: usuario.id,
                // Posso transformar em array com varios papeis e opções
                papel: 'usuario'
            })
        } catch (error) {
            res.status(500).json({ msg: 'Erro do servidor. Tente novamente mais tarde!' })
        }
    }

    static refreshToken(req, res){
        const { refreshToken } = req.cookies
        if(!refreshToken) {
            return res.status(403).json({ msg: "Refresh token invalido!" })
        }
        jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET,
            (erro, usuario) => {
                if(erro){
                    return res.status(403).json({ msg: 'Refresh token inválido!'})
                }
                const dadosUsuario = {
                    nome: usuario.nome,
                    papel: 'usuario'
                }
                const novoTokenAcesso = this.gerarRefreshToken(dadosUsuario)
                res.status(200).json({ tokenAcesso: novoTokenAcesso })
            }
        )
    }

    static async logout(req, res){
        try {
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'development',
                sameSite: 'strict'
            })
            res.status(200).json({msg: "Logout realizado com sucesso"})
        } catch (error) {
            res.status(500).json({msg: 'Erro do servidor. Tente novamente mais tarde!'})
        }
    }
}

module.exports = AutenticacaoController
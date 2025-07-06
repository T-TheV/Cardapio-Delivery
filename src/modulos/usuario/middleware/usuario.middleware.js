const jwt = require("jsonwebtoken")

class AutenticacaoMiddleware {
    static autenticarToken(req, res, next){
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if(!token){
            res.status(401).json({msg: 'Token de acesso não fornecido, tente novamente'})
        }

        jwt.verify(token, process.env.SECRET_KEY, (error, usuario) => {
            if(error){
                return res.status(403).json({ msg: "Você não tem permissão para acessar esse campo"})
            }

            req.usuario = usuario
            next()
        })
    }
}

module.exports = AutenticacaoMiddleware 
const PratoModel = require('../models/prato.models')

class PratoController {
    static async registrar(req, res){
        try {
            const { nome, descricao, preco, categoria, tempo_preparo, disponivel, ingredientes, imagem_url } = req.body
            if( !nome || !descricao || !preco || !categoria || !tempo_preparo ){
                return res.status(400).json({msg: "Todos os campos obrigatórios devem ser preenchidos"})
            }
            const prato = await PratoModel.create({
                nome, 
                descricao, 
                preco, 
                categoria, 
                tempo_preparo, 
                disponivel: disponivel !== undefined ? disponivel : true,
                ingredientes: ingredientes || null,
                imagem_url: imagem_url || null
            })
            res.status(201).json(prato)
        } catch (error) {
            res.status(500).json({ msg: "Erro ao cadastrar um novo prato. Tente novamente mais tarde!"})
        }
    }

    static async listarPratos(req, res){
        try {
            const pratos = await PratoModel.findAll()
            if(pratos.length === 0) {
                return res.status(200).json({msg: "Não há nenhum prato cadastrado"})
            }
            res.status(200).json(pratos)
        } catch (error) {
            res.status(500).json({ msg: "Erro ao listar os pratos. Tente novamente mais tarde!"})
        }
    }

    static async listarPratoPorId(req, res){
        try {
            const id = req.params.id
            const prato = await PratoModel.findByPk(id)
            if(!prato){
                return res.status(404).json({msg: "Não há esse prato específico registrado! Confira as credenciais"})
            }
            res.status(200).json(prato)
        } catch (error) {
            res.status(500).json({ msg: "Erro ao buscar o prato. Tente novamente mais tarde!"})
        }
    }

    static async editarPrato(req, res){
        try {
            const id = req.params.id;
            const { nome, descricao, preco, categoria, tempo_preparo, disponivel, ingredientes, imagem_url } = req.body
            if(!nome || !descricao || !preco || !categoria || !tempo_preparo ) {
                return res.status(400).json({msg: "Todos os campos obrigatórios devem ser preenchidos!"})
            }
            const pratoAtualizado = await PratoModel.update(
                {
                    nome: nome, 
                    descricao: descricao, 
                    preco: preco, 
                    categoria: categoria, 
                    tempo_preparo: tempo_preparo,
                    disponivel: disponivel !== undefined ? disponivel : true,
                    ingredientes: ingredientes || null,
                    imagem_url: imagem_url || null
                },
                {where: {id: id}}
            )
            if(pratoAtualizado[0] === 0){ 
                return res.status(404).json({msg: "Prato não encontrado!"})
            }
            res.status(200).json({msg: "Prato atualizado com sucesso!"})
        } catch (error) {
            res.status(500).json({ msg: "Erro ao editar o prato. Tente novamente mais tarde!"})
        }
    }

    static async deletarPrato(req, res){
        try {
            const id = req.params.id;
            const prato = await PratoModel.findByPk(id)
            if (!prato) {
                return res.status(404).json({ msg: "Prato não encontrado!" })
            }

            await PratoModel.destroy({
                where: { id }
            })

            res.status(200).json({ msg: "Prato deletado com sucesso!" })
        } catch (error) {
            console.error('Erro ao deletar prato:', error)
            res.status(500).json({ msg: "Erro ao deletar prato. Tente novamente mais tarde!" })
        }
    }

    static async alterarDisponibilidade(req, res) {
        try {
            const { id } = req.params
            const { disponivel } = req.body

            if (disponivel === undefined) {
                return res.status(400).json({ msg: "Campo 'disponivel' é obrigatório!" })
            }

            const [linhasAfetadas] = await PratoModel.update(
                { disponivel },
                { where: { id } }
            )

            if (linhasAfetadas === 0) {
                return res.status(404).json({ msg: "Prato não encontrado!" })
            }

            const pratoAtualizado = await PratoModel.findByPk(id)
            res.status(200).json({
                msg: `Prato ${disponivel ? 'disponibilizado' : 'indisponibilizado'} com sucesso!`,
                prato: pratoAtualizado
            })
        } catch (error) {
            console.error('Erro ao alterar disponibilidade:', error)
            res.status(500).json({ msg: "Erro ao alterar disponibilidade. Tente novamente mais tarde!" })
        }
    }
}

module.exports = PratoController

const Pet = require('../models/Pet')

module.exports = class PetController {
    //creaste a pet
    static async create(req,res){
        res.json({ message: "Deu Certo!" })
    }
}
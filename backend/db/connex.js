const mongoose = require('mongoose')

async function main(){
    await mongoose.connect('mongodb://localhost:27017/getapet')
    console.log('conectou ao mongoose!')
}

main().catch((e)=> console.log(e))

module.exports = mongoose
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//helpers
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const { imageUpload } = require('../helpers/image-upload')

module.exports = class UserController {
    static async register(req,res){
        const { name, email, phone, password, confirmpassword } = req.body

        //validations
        if(!name){
            res.status(422).json({ message: 'O nome é obrigatório!'})
            return
        }
        if(!email){
            res.status(422).json({ message: 'O e-mail é obrigatório!'})
            return
        }
        if(!phone){
            res.status(422).json({ message: 'O telefone é obrigatório!'})
            return
        }
        if(!password){
            res.status(422).json({ message: 'A senha é obrigatório!'})
            return
        }

        if(!confirmpassword){
            res.status(422).json({ message: 'Confime a senha!'})
            return
        }

        if(password !== confirmpassword){
            res.status(422).json({ message: 'As senhas não são iguais!'})
            return
        }

        //check if user exits
        const userExists = await User.findOne({ email: email })
        if(userExists){
            res.status(422).json({
                message: 'Por favor, utilize outro e-mail',
            })
            return
        }
        //create a password
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)
        //create a user
        const user = new User({
            name,
            email,
            phone,
            password: passwordHash,
        }) 
        try{
            const newUser = await user.save()
            await createUserToken(newUser, req, res)
        }catch(e){
            res.status(500).json({ message: e })
        }
    }
   static async login(req,res){
        const {email,password} = req.body
        if(!email){
            res.status(422).json({ message: 'O e-mail é obrigatório!'})
            return
        }
        if(!password){
            res.status(422).json({ message: 'A senha é obrigatório!'})
            return
        }
        const user = await User.findOne({ email: email })
        if(!user){
            res.status(422).json({
                message: 'O e-mail não está cadastrado!',
            })
            return
        }
        //check if password match with db password
        const checkPassword = await bcrypt.compare(password, user.password)
        if(!checkPassword){
            res.status(422).json({
                message: 'Senha inválida!',
            })
            return
        }
        await createUserToken(user, req, res)
   }

   static async checkUser(req,res){
    let currentUser
        
    if(req.headers.authorization){
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')

        currentUser = await User.findById(decoded.id)
        currentUser.password = undefined
    }else{
        currentUser = null
    }

    res.status(200).send(currentUser)
   }

   static async getUserById(req,res){
        const id = req.params.id
        const user = await User.findById(id).select('-password')
        if(!user){
            res.status(422).json({
                message: 'Usuário não encontrado!',
            })
            return
        }

        res.status(200).json({ user })
   }

   static async editUser(req,res){
        const id = req.params.id
        const token = getToken(req)
        const user = await getUserByToken(token)
        const { name, email, phone, password, confirmpassword } = req.body
       
        if(req.file){
            user.image = req.file.filename
        }
        //validations
        if(!name){
            res.status(422).json({ message: 'O nome é obrigatório!'})
            return
        }
        user.name = name
        if(!email){
            res.status(422).json({ message: 'O e-mail é obrigatório!'})
            return
        }
        const userExists = await User.findOne({email: email})
        if(user.email !== email && userExists){
            res.status(422).json({
                message: 'Por favor, utilize outro e-mail!',
            })
            return
        } 
        user.email = email

        if(!phone){
            res.status(422).json({ message: 'O telefone é obrigatório!'})
            return
        }

        user.phone = phone

        if(password != confirmpassword){
            res.status(422).json({ message: 'As senhas não conferem!'})
            return
        }

        if(password !== confirmpassword){
            res.status(422).json({ message: 'As senhas não estão iguais!'})
            return
        } else if(password === confirmpassword && password != null){
            //creating password
            const salt = await bcrypt.genSalt(12)
            const reqPassword = req.body.password
            const passwordHash = await bcrypt.hash(reqPassword, salt)

            user.password = passwordHash
        }
        try{
            await User.findOneAndUpdate(
                {_id: user._id},
                { $set: user },
                { new: true},
            )
            res.status(200).json({
                message: 'Usuário atualizado com secesso!'
            })
        }catch (e){
            res.status(500).json({ message: e })
            return
        }
         
   }
}
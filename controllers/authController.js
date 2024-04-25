const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const imagekit = require("../lib/imagekit")
const { Auth, User} = require("../models")
const ApiError = require("../utils/apiError")

const findAuths = async(req, res, next) => {
    try {
        const { page, limit } = req.query

        const pageNum = parseInt(page) || 1
        const pageSize = parseInt(limit) || 10
        const offset = (pageNum - 1) * pageSize

        const { count, rows: auths } = await Auth.findAndCountAll({
            offset,
            limit: pageSize
        })

        const totalPages = Math.ceil(count/ pageSize)

        res.status(200).json({
            status: "Success",
            data: {
                pagination: {
                    totalData: count,
                    totalPages,
                    pageNum,
                    pageSize
                },
                auths
            }
        })
    } catch (err){
        next(new ApiError(err.message, 400))
    }
}

const register = async (req, res, next) => {
    try{
        let { name, email, password, city, address, phone, role } = req.body
        email = email.toLowerCase()

        const user = await Auth.findOne({
            where: {
                email
            }
        })

        if(user) {
            return next(new ApiError("User email already taken", 400))
        }

        const passwordLength = password <= 8
        if(passwordLength){
            next(new ApiError("Minimum password must be 8 character", 400))
        }

        const saltRounds = 10
        const hashedPassword = bcrypt
        bcrypt.hashSync(password, saltRounds)

        const files = req.files
        let image
        if(files){
            await Promise.all(
                files.map(async (file) => {
                    const split = file.originalname.split(".");
                    const extension = split[split.length - 1];

                    const uploadImg = await imagekit.upload({
                        file: file.buffer,
                        fileName: `file_${crypto.randomUUID()}.${extension}`
                    })
                    image = uploadImg.url
                })
            )
        }

        const newUser = await User.create({
            name,
            address,
            city,
            profileImage: image,
            phone,
            role
        })

        await Auth.create({
            email,
            password: hashedPassword,
            userId: newUser.id
        })

        res.status(201).json({
            status: "Success",
            data: {
                email,
                newUser
            }
        })
    } catch (err){
        next(new ApiError(err.message, 500))
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return next(new ApiError("email or password is required", 400))
        }

        const user = await Auth.findOne({
            where: {
                email
            },
            include: ["User"]
        })
        if (user && bcrypt.compareSync (password, user.password)){
            const token = jwt.sign(
                {
                    id: user.userId,
                    name: user.User.name,
                    role: user.User.role,
                    email: user.email
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: processs.env,
                    JWT_EXPIRED
                }
            )

            res.status(200).json({
                status: "Success",
                message: "Login Success",
                data: {
                    token
                }
            })
        } else {
            next(new ApiError("Wrong password or user doesn't exist", 400))
        }
    } catch (err){
        next(new ApiError(err.message, 500))
    }
}

const authenticate = async (req, res) => {
    try {
        res.status(200).json({
            status: "Success",
            data: {
                user: req.user
            }
        })
    } catch (err) {
        next(new ApiError(err.message, 500))
    }
}

module.exports = {
    register,
    login,
    authenticate,
    findAuths
}
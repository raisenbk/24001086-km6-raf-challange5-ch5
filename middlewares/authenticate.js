const jwt = require("jsonwebtoken")
const { User, Auth } = require("../models")
const ApiError = require("../utils/apiError")

module.exports = async (req, res, next) => {
    try {
        const bearerToken = req.headers.authorization

        if (!bearerToken){
            return next(new ApiError("Token not found!", 401))
        }

        const token = bearerToken.split("Bearer ")[1]

        let payload

        try {
            payload = jwt.verify(token, process.env.JWT_SECRET)
        } catch (innerErr){
            next(new ApiError("token unvalid", 401))
        }

        const user = await User.findByPk(payload.id, {
            include: ["Auth"]
        })

        req.user = user
        req.payload = payload
        next()
    } catch (err) {
        if (err.message === "jwt expired"){
            next(new ApiError("Token expired", 400))
        }
        next(new ApiError(err.message, 500))
    }
}
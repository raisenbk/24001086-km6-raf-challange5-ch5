const ApiError = require("../utils/apiError");

module.exports = async (req, res, next) => {
  try {
    if (req.user.role !== "SuperAdmin") {
      return next(new ApiError("Forbidden!, you're not superadmin", 403));
    }
    next();
  } catch (err) {
    return next(new ApiError(err.message, 500));
  }
};
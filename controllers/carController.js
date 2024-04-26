const { Car, User } = require("../models");
const ApiError = require("../utils/apiError");
const imagekit = require("../services/imagekit");
const { Op } = require("sequelize");

const getAllCar = async (req, res, next) => {
  try {
    const { carName, createdBy, manufacture, type, page, limit } = req.query;

    const condition = {};

    // Filter by carName
    if (carName) condition.model = { [Op.iLike]: `%${carName}%` };

    // Filter by createdBy
    if (createdBy) condition.createdBy = createdBy;

    // Filter by manufacture
    if (manufacture) condition.manufacture = { [Op.iLike]: `${manufacture}%` };

    // Filter by type
    if (type) condition.type = { [Op.iLike]: `%${type}%` };

    const pageNum = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const offset = (pageNum - 1) * pageSize;

    const totalCount = await Car.count({ where: condition });

    const cars = await Car.findAll({
      where: condition,
      limit: pageSize,
      offset: offset,
      include: [
        {
          model: User,
          as: "createdByUser",
          attributes: ["id", "name", "role"],
        },
        {
          model: User,
          as: "deletedByUser",
          attributes: ["id", "name", "role"],
        },
        {
          model: User,
          as: "updatedByUser",
          attributes: ["id", "name", "role"],
        },
      ],
    });

    const totalPages = Math.ceil(totalCount / pageSize);

    return res.status(200).json({
      status: "Success",
      message: "Cars succesfully retrieved",
      requestAt: req.requestTime,
      data: { cars },
      pagination: {
        totalData: totalCount,
        totalPages,
        pageNum,
        pageSize,
      },
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

const getCarById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const car = await Car.findOne({
      where: {
        id,
      },
      include: [
        {
          model: User,
          as: "createdByUser",
          attributes: ["id", "name", "role"],
        },

        {
          model: User,
          as: "deletedByUser",
          attributes: ["id", "name", "role"],
        },

        {
          model: User,
          as: "updatedByUser",
          attributes: ["id", "name", "role"],
        },
      ],
    });

    if (!car) {
      return next(new ApiError(`Data with id '${id}' is not found`, 404));
    }

    res.status(200).json({
      status: "Success",
      message: `Car with id '${id}' is successfully retrieved`,
      requestAt: req.requestTime,
      data: { car },
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

const createCar = async (req, res, next) => {
  try {
    const file = (await req.file) || null;
    // Create by nanti ganti jwt
    const { type, model, manufacture, price } = req.body;
    let newCar;

    if (!type || !model || !manufacture || !price || !file) {
      return next(
        new ApiError(
          "type, model, manufacture, price, and image is required",
          400
        )
      );
    }

    if (file !== null) {
      const split = file.originalname.split(".");
      const extension = split[split.length - 1];

      const img = await imagekit.upload({
        file: file.buffer,
        fileName: `IMG-${Date.now()}.${extension}`,
      });

      newCar = await Car.create({
        type,
        model,
        manufacture,
        price,
        createdBy: req.user.id,
        image: img.url,
      });
    } else {
      newCar = await Car.create({
        type,
        model,
        manufacture,
        price,
        createdBy: req.user.id,
      });
    }

    res.status(201).json({
      status: "Success",
      message: "Car successfully created",
      requestAt: req.requestTime,
      data: { newCar },
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

const deleteCar = async (req, res, next) => {
  try {
    const id = req.params.id;

    // Contoh Implementasi
    const car = await Car.findOne({
      where: {
        id,
      },
    });

    if (!car) {
      return next(new ApiError(`Data with id '${id}' is not found`, 404));
    }

    const deletedBy = req.user.id;

    await Car.update(
      {
        deletedBy,
      },
      {
        where: {
          id,
        },
      }
    );

    await Car.destroy({
      where: {
        id,
      },
    });

    res.status(200).json({
      status: "Success",
      message: `Car with id '${car.id}' is successfully deleted`,
      requestAt: req.requestTime,
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

const updateCar = async (req, res, next) => {
  try {
    const file = (await req.file) || null;

    const id = req.params.id;

    // Last update by nanti ganti jwt
    const { type, model, manufacture, price } = req.body;

    console.log(file);

    const car = await Car.findOne({
      where: {
        id,
      },
    });

    if (!car) {
      return next(new ApiError(`Data with id '${id}' is not found`, 404));
    }

    if (file !== null) {
      const split = file.originalname.split(".");
      const extension = split[split.length - 1];

      const img = await imagekit.upload({
        file: file.buffer,
        fileName: `IMG-${Date.now()}.${extension}`,
      });

      await Car.update(
        {
          type,
          model,
          manufacture,
          price,
          lastUpdatedBy: req.user.id,
          image: img.url,
        },
        {
          where: {
            id,
          },
        }
      );
    } else {
      await Car.update(
        {
          type,
          model,
          manufacture,
          price,
          lastUpdatedBy: req.user.id,
        },
        {
          where: {
            id,
          },
        }
      );
    }

    const updatedCar = await Car.findOne({
      where: {
        id,
      },
    });

    res.status(200).json({
      status: "Success",
      message: "Car successfully updated",
      requestAt: req.requestTime,
      data: { updatedCar },
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

module.exports = {
  getAllCar,
  getCarById,
  createCar,
  deleteCar,
  updateCar,
};

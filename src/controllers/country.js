const { country, profile } = require("../../models");

const Joi = require("joi");

exports.addCountry = async (req, res) => {
    
  try {
    const countryExist = await country.findOne({
      where: {
        name: req.body.name,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    if(countryExist){
      return res.send({
          status: "failed",
          message: "Country already exist"
      })
  }
    const newCountry = await country.create(req.body);
    const getCountry = await country.findOne({
      where: {
        name: newCountry.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    res.send({
      status: "success",
      message: "Add Country finished",
      data: getCountry,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.getCountries = async (req, res) => {
  try {
    const countries = await country.findAll({
      
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "success",
      data: countries,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.getCountry = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await country.findOne({
      where:{
        id,
      },
      
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "success",
      data: {
        country: data,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.updateCountry = async (req, res) => {
  try {
    const { id } = req.params;

    const newData = await country.update(req.body, {
      where: {
        id,
      },
    });
    const getCountry = await country.findOne({
      where:{
        id
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },

    })

    res.send({
      status: "success",
      message: `Update country id: ${id} finished`,
      data: getCountry,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.deleteCountry = async (req, res) => {
  try {
    const { id } = req.params;

    await country.destroy({
      where: {
        id,
      },
    });

    res.send({
      status: "success",
      data: {
        id: id,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

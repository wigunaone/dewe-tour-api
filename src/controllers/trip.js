const { trip,country, user } = require("../../models");

const Joi = require("joi");

exports.addTrip = async (req, res) => {
  try {
    const { ...data } = req.body;
    const getCountry = await country.findOne({
      where: {
        id: req.body.idCountry
      }
    })
    const newTrip = await trip.create({
      ...data,
      photo: req.files.photo[0].filename,
      
    });
    
    let tripData = await trip.findOne({
      where: {
        id: newTrip.id,
      },
      include: [
        
        {
          model: country,
          as: "country",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", ],
      },
    });

    tripData = JSON.parse(JSON.stringify(tripData));

    res.send({
      status: "success",
      data: {
        ...tripData,
        photo: "http://localhost:5000/uploads/" + tripData.photo,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};


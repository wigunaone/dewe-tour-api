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

exports.getTrips = async (req, res) => {
  try {
    const trips = await trip.findAll({
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
        exclude: ["idCountry","createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "success",
      data: trips,
      // data: {
      //   id: trips.id,
      //   title: trips.title,
      //   country: trips.country,
      //   accomodation: trips.accomodation,
      //   transportation: trips.transportation,
      //   eat: trips.eat,
      //   day: trips.day,
      //   night: trips.night,
      //   dateTrip: trips.dateTrip,
      //   price: trips.price,
      //   quota: trips.quota,
      //   description:trips.description,
      //   photo: trips.photo
      // },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
}


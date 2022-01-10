const { trip,country, user,transaction } = require("../../models");

const Joi = require("joi");
const Sequelize = require('sequelize');
const { col } = require("sequelize");
const Op = Sequelize.Op;
const Fn = Sequelize.fn;
const Col = Sequelize.col;

exports.addTrip = async (req, res) => {
  try {
    const tripExist = await trip.findOne({
      where: {
        title: req.body.title,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    if(tripExist){
      return res.send({
          status: "failed",
          message: "Trip already exist"
      })
  }
    let filesQuantity = req.files.photo.length;
    console.log(req.files.photo)
    let filenames="";
    for(let i = 0; i< filesQuantity; i++){
      filenames = filenames+req.files.photo[i].filename+",";
      console.log(filenames);
    }
    let array = filenames.split(",");
   console.log(req.body)
    const newTrip = await trip.create({
      ...req.body,
      // eat: req.body.eat,
      photo: filenames,
      
    });
    // // console.log(newTrip)
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
    // let photo = tripData.split(" ");

    res.send({
      status: "success",
      data: {
        tripData,
    //     photo: 
    //     // "http://localhost:5000/uploads/" 
    //     tripData.photo,
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
    let tripData = await trip.findAll({
      
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
    tripData = tripData.map((item) => {
      return { ...item, photo: item.photo.split(",") };
    });
    res.send({
      status: "success",
      data: tripData
    });
    
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.getTripTransaction = async (req, res) => {
  try {
    let tripData = await trip.findAll({
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
    let sumData = await transaction.findAll({
      where: {
        // status: "Approved",
      },
      attributes: [
        'idTrip',
        [Fn('SUM', Col('total')), 'sumTotal']
      ],
      group: 'idTrip'
    })
    
    let tripD = JSON.parse(JSON.stringify(tripData));

    //mengubah string photos ke dalam array
    tripD = tripD.map((item) => {
      return { ...item, photo: item.photo.split(",") };
    });
    let total = JSON.parse(JSON.stringify(sumData));
    let data = [];
    
        for (let i = 0; i < tripD.length; i++){
          let falseObject = {
            ...tripD[i],
            sum: 0,
          };
            for (let j = 0; j < total.length; j++){

              if(tripD[i].id == total[j].idTrip){
                  let trueObject = {
                    ...tripD[i],
                    sum: total[j].sumTotal,
                  }
                  
                  data.push(trueObject) 
              }
            } 
            data.push(falseObject);
         }
         let ganjil = [];
         let genap = [];
    // })
    for(let k = 0; k <data.length; k++){
      let index = k +1;

      if( (index % 2) == 0){
        genap.push(data[k]);
      }
      else{
        ganjil.push(data[k])
      }
     
    }
    console.log(tripD.length)
    console.log(data.length)
    console.log(ganjil.length)
    res.send({
      status: "success",
      data: ganjil,
      secondData: data

    });
    
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};


exports.getTrip = async (req, res) => {
  const id = req.params.id;
  try {
    let tripData = await trip.findOne({
      where:{
        id
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
        exclude: ["idCountry","createdAt", "updatedAt"],
      },
    });
    
    // let photos = JSON.parse(JSON.stringify(tripData));
    let rawPhotos = tripData.photo.split(",");
    let photoQty = rawPhotos.length;
    let photos = [];
    for(let i = 0; i< photoQty; i++){
      photos.push("http://localhost:5000/uploads/"+rawPhotos[i]);
    }
    let data = {
      id: tripData.id,
      title: tripData.title,
      accomodation: tripData.accomodation,
      transportation: tripData.transportation,
      eat: tripData.eat,
      day: tripData.day,
      night: tripData.night,
      dateTrip: tripData.dateTrip,
      price: tripData.price,
      quota: tripData.quota,
      description: tripData.description,
      photos: photos,
      country: tripData.country.name,


    }
    console.log(photos[1]);
    res.send({
      status: "success",
      data: data
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.updateTrip = async (req, res) => {
  try {
    const { id } = req.params;

    const newData = await trip.update(req.body, {
      where: {
        id,
      },
    });
    const getTrip = await trip.findOne({
      where:{
        id
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
        exclude: ["idCountry","createdAt", "updatedAt"],
      },

    })

    res.send({
      status: "success",
      message: `Update Trip finished`,
      data: getTrip,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;

    await trip.destroy({
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

exports.searchTrip = async (req, res) => {
  const word = req.params.word;
  const searchWord = `%${word}%`;

  try {
    let tripData = await trip.findAll({
        where: {
            title: {
                [Op.like]: searchWord
            },
        },
        include: [
            {
                model: country,
                as: "country",
                attributes: {
                    exclude: ["createdAt","updatedAt","status","password","photo"]
                }
            }
        ],
        attributes: {
            exclude: ["createdAt","updatedAt"]
        },
    });
    
    tripData = JSON.parse(JSON.stringify(tripData)); 
    tripData = tripData.map((item) => {
      return { ...item, photo: item.photo.split(",") };
    });
    res.send({
      status: "success",
      data: tripData
    });
    
    
} catch (error) {
    console.log(error);
    res.send(500,{
        error: error,
    })
}
}
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Fn = Sequelize.fn;
const Col = Sequelize.col;
const {trip,user,country,transaction} = require("../../models")
const Joi = require("joi");
exports.getTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        let transactionData = await transaction.findOne({
            where: {
              id: id
            },
            include: [
              
              {
                model: trip,
                as: "trip",
                attributes: {
                  exclude: ["idCountry","createdAt", "updatedAt"],
                },
                include: [
                  {
                    model: country,
                    as: "country",
                    attributes: {
                      exclude: ["createdAt", "updatedAt"]
                    }
                  }
                ]
              },
              {
                model: user, 
                as: "user",
                attributes: {
                  exclude: ["createdAt", "updatedAt","password"],
                },
              
              }
            ],

            attributes: {
              exclude: ["idTrip","createdAt", "updatedAt", ],
            },
          });
        transactionData = JSON.parse(JSON.stringify(transactionData));
        res.send({
            data:transactionData
        })
    } catch (error) {
        console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
    }
}
exports.getTransactions = async (req,res) => {
    try{
        let transactionData = await transaction.findAll({
            
            include: [
              
              {
                model: trip,
                as: "trip",
                include:{
                  model: country,
                  as: "country",
                  attributes: {
                    exclude: [,"createdAt", "updatedAt"]
                  }
                  
                },
                attributes: {
                  exclude: ["idCountry","createdAt", "updatedAt"],
                },
              },
              {
                model: user, 
                as: "user",
                attributes: {
                  exclude: ["createdAt", "updatedAt","password"],
                },
              
              }
            ],
            attributes: {
              exclude: ["idTrip","createdAt", "updatedAt", ],
            },
          });
        transactionData = JSON.parse(JSON.stringify(transactionData));
        res.send({
            data:transactionData
        })
    }catch(error){
        console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
    }
}
exports.getUserTransaction = async (req,res) => {
  const idUser = req.user.id;
  try{
      let transactionData = await transaction.findAll({
          where:{
            idUser:idUser,
          },
          order: [
            ['id', 'DESC']
          ],
          include: [
            
            {
              model: trip,
              as: "trip",
              attributes: {
                
                exclude: ["idCountry","createdAt", "updatedAt"],
              },
              include: [
                {
                  model: country,
                  as: "country",
                  attributes: {
                
                    exclude: ["createdAt", "updatedAt"],
                  },
                }
              ]
              
            },
            {
              model: user, 
              as: "user",
              attributes: {
                exclude: ["createdAt", "updatedAt","password"],
              },
            
            }
          ],
          attributes: {
            exclude: ["idTrip","createdAt", "updatedAt", ],
          },
        });
      transactionData = JSON.parse(JSON.stringify(transactionData));
      res.send({
          data:transactionData
      })
  }catch(error){
      console.log(error);
  res.status(500).send({
    status: "failed",
    message: "Server Error",
  });
  }
}

exports.addTransaction = async (req,res) => {
    const idTrip = req.body.idTrip;

    try{
      console.log(req.body.idTrip)
        const {...data} = req.body;
        const getTrip = await trip.findOne({
            where: {
                id : idTrip
            },
            attributes: {
                exclude: ["idCountry","createdAt", "updatedAt", ],
              },
        })
        const total = req.body.qty * getTrip.price;
        const newData = await transaction.create ({
            ...data,
            idUser: req.user.id,
            dateTrip:getTrip.dateTrip,
            bookingDate: new Date(),
            status: "Waiting Payment",
            total: total,
            // attachment: req.files.attachment[0].filename,
        })
        let transactionData = await transaction.findOne({
            where: {
              id: newData.id,
            },
            include: [
              
              {
                model: trip,
                as: "trip",
                attributes: {
                  exclude: ["idCountry","createdAt", "updatedAt"],
                },
              },
            ],
            attributes: {
              exclude: ["idTrip","createdAt", "updatedAt", ],
            },
          });
        transactionData = JSON.parse(JSON.stringify(transactionData));
        res.send(200,{
            status: "success",
            data:transactionData
        })
    }catch(error){
        console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
    }

}
exports.updateTransaction = async (req, res) => {
  if(!req.files.attachment){
    return res.status(400).send({
      status:"failed",
      message: "please input photo"
    })
  }
    try {
        const id = req.params.id;

        console.log("test" ,req.files)
      // console.log(req.files.attachment[0].filename);
        const newData = await transaction.update({
            status: req.body.status,
            attachment: req.files.attachment[0].filename,
        }, 
        {
          where: {
            id: id,
          },
        });
        const getTransaction = await transaction.findOne({
          where:{
            id :id,
          },
          include: [
              
            {
              model: trip,
              as: "trip",
              attributes: {
                exclude: ["idCountry","createdAt", "updatedAt"],
              },
            },
          ],
          attributes: {
            exclude: ["idTrip","createdAt", "updatedAt", ],
          },
    
        })
    
        res.send({
          status: "success",
          message: `transaction payment: ${id} finished`,
          data: getTransaction,
        });
      } catch (error) {
        console.log(error);
        res.send({
          status: "failed",
          message: "Server Error",
        });
      }
}
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    console.log( id)
    const newData = await transaction.update({
      status: req.body.status,
    }, 
    {
      where: {
        id
      },
    });
    
    res.send({
      status: "success",
      message: `update id: ${id} finished`,
      data: req.body
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
}
exports.getTripTransaction = async (req, res) => {
  try {
    let transactionData = await transaction.findAll({
            
      include: [
        
        {
          model: trip,
          as: "trip",
          include:{
            model: country,
            as: "country",
            attributes: {
              exclude: [,"createdAt", "updatedAt"]
            }
            
          },
          attributes: {
            exclude: ["idCountry","createdAt", "updatedAt"],
          },
        },
        {
          model: user, 
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt","password"],
          },
        
        }
      ],
      attributes: {
        exclude: ["idTrip","createdAt", "updatedAt", ],
      },
      group: "idTrip"
    });
  transactionData = JSON.parse(JSON.stringify(transactionData));
  res.send({
      data:transactionData
  })
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

const {trip,country,transaction} = require("../../models")

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
              },
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
    
    try{
        const {...data} = req.body;
        const getTrip = await trip.findOne({
            where: {
                id: req.body.idTrip
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
            price:getTrip.price,
            total: total,
            attachment: req.files.attachment[0].filename,
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
exports.updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
    
        const newData = await transaction.update({
            idTrip: req.body.idTrip,
            qty: req.body.qty,
            status: req.body.status,
            attachment: req.files.attachment[0].filename,
        }, 
        {
          where: {
            id
          },
        });
        const getTransaction = await transaction.findOne({
          where:{
            id 
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
          message: `Update country id: ${id} finished`,
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
const { user } = require("../../models");
const bcrypt = require("bcrypt")
const Joi = require("joi");

// exports.addUsers = async (req, res) => {
//     const schema = Joi.object({
//         fullname: Joi.string().min(5).required(),
//         email: Joi.string().email().min(6).required(),
//         password: Joi.string().min(8).required(),
//         status: Joi.string().required(),
        
//     })

//     const {error} = schema.validate(req.body);

//     if (error)
//     return res.status(400).send({
//       error: {
//         message: error.details[0].message,
//       },
//     });
//     const salt = await bcrypt.genSalt(10);
//     // we hash password from request with salt
//     const hashedPassword = await bcrypt.hash(req.body.password, salt);
//   try {
//     const newUser = await user.create({
//         fullname: req.body.fullname,
//         email: req.body.email,
//         password: hashedPassword,
//         status: req.body.status
//     });
    

//     res.send({
//       status: "success",
//       message: "Add user finished",
//     });
//   } catch (error) {
//     console.log(error);
//     res.send({
//       status: "failed",
//       message: "Server Error",
//     });
//   }
// };

exports.getUsers = async (req, res) => {
  try {
    const users = await user.findAll({
      
      attributes: {
        exclude: ["gender","photo", "status","password", "createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "success",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const id  = req.user.id;

    const data = await user.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "success",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    let body;
    
      if(req.files.photo){
        const photo = {
          photo: req.files.photo[0].filename
        }
        body = Object.assign({}, req.body, {photo: req.files.photo[0].filename});
      }else{
        body = req.body;
      }
      
    console.log(req.body)
    console.log(body)
    const id  = req.user.id;
    
    await user.update(body, {
      where: {
        id,
      },
    });

    res.send({
      status: "success",
      message: `Update user id: ${id} finished`,
      data: req.body,
    });
  } catch (error) {
    console.log(error);
    res.send(500,{
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await user.destroy({
      where: {
        id,
      },
    });

    res.send({
      status: "success",
      data: {
        id: id
      }
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

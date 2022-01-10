const { user } = require("../../models");
const Joi = require("joi");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    const schema = Joi.object({
        fullname: Joi.string().min(5).required(),
        email: Joi.string().email().min(6).required(),
        password: Joi.string().min(6).required(),
        phone: Joi.string().min(11).required(),
        
    })

    const {error} = schema.validate(req.body);

    if (error)
    return res.status(400).send({
      error: {
        message: error.details[0].message,
      },
    });

  try {
    const userExist = await user.findOne({
        where: {
          email: req.body.email,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

      if(userExist){
          return res.send({
              status: "failed",
              message: "already exist"
          })
      }
    const salt = await bcrypt.genSalt(10);
    // we hash password from request with salt
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = await user.create({
        fullname: req.body.fullname,
        email: req.body.email,
        password: hashedPassword,
        phone: req.body.phone,
        address: req.body.address,
        status: "user"
    });
    
    const token = jwt.sign({ id: newUser.id,status: newUser.status }, process.env.TOKEN_KEY);

    res.send({
      status: "success",
      data:{
        email: newUser.email,
        token: token
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

exports.login = async (req, res) => {
    // our validation schema here
    const schema = Joi.object({
      email: Joi.string().email().min(6).required(),
      password: Joi.string().min(6).required(),
    });
  
    // do validation and get error object from schema.validate
    const { error } = schema.validate(req.body);
  
    // if error exist send validation error message
    if (error)
      return res.status(400).send({
        error: {
          message: error.details[0].message,
        },
      });
  
    try {
        const userExist = await user.findOne({
            where: {
              email: req.body.email,
            },
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          });
    
      
      // compare password between entered from client and from database
      const isValid = await bcrypt.compare(req.body.password, userExist.password);
  
      // check if not valid then return response with status 400 (bad request)
      if (!isValid) {
        return res.status(400).send({
          status: "failed",
          message: "credential is invalid",
        });
      }
  
      // generate token
      const token = jwt.sign({ id: userExist.id,status: userExist.status }, process.env.TOKEN_KEY);
  
      res.status(200).send({
        status: "success...",
        data: {
          id : userExist.id,
          name: userExist.id,
          email: userExist.email,
          status: userExist.status,
          token : token
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
  exports.checkAuth = async (req, res) => {
    try {
      const id = req.user.id;
  
      const dataUser = await user.findOne({
        where: {
          id,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt", "password"],
        },
      });
  
      if (!dataUser) {
        return res.status(404).send({
          status: "failed",
        });
      }
  
      res.send({
        status: "success",
        data: {
          user: {
            id: dataUser.id,
            name: dataUser.fullname,
            email: dataUser.email,
            status: dataUser.status,
          },
        },
      });
    } catch (error) {
      console.log(error);
      res.status({
        status: "failed",
        message: "Server Error",
      });
    }
  };
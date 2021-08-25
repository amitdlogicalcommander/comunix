const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const secret_key = process.env.JWT_SECRET;

exports.register = (req,res,next) => {
  req.check('email','email is not valid').isEmail();
  req.check('pswd','Password min 8').isLength({min:8});
  const error = req.validationErrors();
  if(error){
    res.status(400).json(error);
  } else{
    req.body.pswd = bcrypt.hashSync(req.body.pswd, saltRounds);
    next();
  }
}

exports.checkAuth = (req,res,next) => {
  try{
    if(!req.cookies || !req.cookies.token){
      throw new Error('missing ');
    }
    const token = req.cookies.token;
    jwt.verify(token, secret_key, (err, value) => {
      if (err) res.status(500).json({error: 'failed to authenticate token'});
      req.userData = value.data;
      next();
    });
  } catch(error){
    res.status(400).json({message: 'Auth failed'});
  }
}
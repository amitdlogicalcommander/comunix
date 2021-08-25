const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connection= require('../dal/mysql');
const secret_key = process.env.JWT_SECRET;

const createUser = async ({email,pswd}) => {
  return new Promise(function(resolve, reject) {
    let sql = "INSERT INTO users SET email = ?, pswd = ?";
    return connection.query(sql,[ email, pswd], function (err, result) {
    if (err) reject(err.message);
    console.log("1 record inserted");
     resolve(result);
    });
  });
};
const findUser = async (email) => {
  return new Promise(function(resolve, reject) {
    let sql = 'SELECT * FROM users WHERE email LIKE ? LIMIT 0, 1';
    return connection.query(sql,[ email], function (err, rows) {
    if (err || rows.length === 0) reject(err);
    console.log("1 record inserted",rows[0]);
    resolve(rows[0]);
    });
  })
};

exports.handleRegister = async (req,res) => {
  try{
    await createUser(req.body);
    res.render('index');
    return res.status(200);
  } catch(error){
    return res.status(400).json({message: 'Failed to register'});
  }
}

exports.handleLogin = async (req,res) => {
  req.check('email').isEmail();
  const errors = req.validationErrors();
  if (errors){
    res.status(422).json(errors);
  }else{
    try{
      const user = await findUser(req.body.email);
      const isComparePass = bcrypt.compareSync(req.body.pswd, user.pswd);
      if (isComparePass){
        const token = jwt.sign({email:user.email},secret_key);
        //res.io.emit("socketToMe", {token:token});
        const options =  { maxAge: 1000 * 60 * 15, httpOnly: true };
        res.cookie('token', token, options);
        res.render('chats', { title: 'chats' });
        res.status(200);
      } else {
        res.status(400).json({message: 'Password not valid'});
      }
    } catch(error){
      res.status(400).json({
        message: 'Username not yet registered'
      });
    }
  }
};
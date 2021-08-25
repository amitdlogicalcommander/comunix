const socketCtrl = require('./socket');


exports.handleSpin = async(req,res) => {
  try{
    await socketCtrl.sendMsg(res.io,1,'spin');
    return res.status(200);
  }catch(err){
    return res.status(400).json({message: 'Failed to send spin msg'});
  }
}

exports.handleWild = async (req,res) => {
  const {pickRandomSize} = req.body;
  try{
    await socketCtrl.sendMsg(res.io,pickRandomSize,'wild');
    return res.status(200);
  }catch(err){
    return res.status(400).json({message: 'Failed to send wild msg'});
  }
}

exports.handleBlast = async (req,res) => {
  res.io.emit("socketToMe", 'blast');
  res.status(200);
}
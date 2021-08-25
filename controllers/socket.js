
const { reject } = require('lodash');
var _ = require('lodash');


 

exports.handleConnectionSession =  (io) => {
  io.on('connection', function(socket) {
    console.log('Client connected!');
    socket.on('message', function (data) {
        console.log('Sending update!');
        socket.emit('update', 'Working!');
    });
  });
}

exports.sendMsg =  (io,pickRandomSize,msgValue) => {
  return new Promise((resolve, reject) => {
    io.of('/').adapter.clients((err, clients) => {
      if(err){reject(err)};
      const randomClientsArr = _.sampleSize(clients,pickRandomSize);
      console.log('clients=',clients,'randomClient=',randomClientsArr);
      for(let randomClient of randomClientsArr){
        io.to(randomClient).emit("socketToMe", msgValue);
      }
      resolve();
    });
  })
} 
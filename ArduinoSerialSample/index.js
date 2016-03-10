var serialport = require('serialport');

var portSettings = {
    baudrate: 9600,
    parser: serialport.parsers.readline("#"),
    parity: "none",
    dataBits: 8,
    stopBits: 1
}

function initSerialPort(callback){

    var SerialPort = serialport.SerialPort;

    serialport.list(function (err, ports) {
        ports.forEach(function(port) {

            if (port.manufacturer.toLowerCase().indexOf('arduino') > -1)
            {
                var sp = new SerialPort(port.comName, portSettings, false);

                sp.on('open', function(){

                    console.log("port open.");

                    sp.on('data', function(data) {

                        
                        
                        if(data == "ready") {
                            console.log('Board ready');
                            return callback(null, sp);
                        }
                        dataReceived(data);
                    });
                });

                sp.on('error', function(err) {
                    console.log('Error' + err);
                    return callback(err, null);
                });

                sp.open();
            } 
        });
    });
}


function write(port, data){

    console.log('Write to serial:', data);

    var buffer = new Buffer(data+"#", "ascii");

    port.write(buffer);
}

function dataReceived(data){
    console.log('data received: ' + data);
}

initSerialPort(function ready(err, port){

    if(port){
        setInterval(function(){
            var randomTemp = 45+ Math.random()*6;
            write(port, randomTemp );
        }, 1000);
    }
});




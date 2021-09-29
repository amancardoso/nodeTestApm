
const moment = require('moment-timezone');
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://test-network-server.witac.co:1883', {qos: 0, username: 'witac', password: 'NNSXS.ACS22OFNWWRKWY7S627GXWLDAUOTQWLWFGXKLKY.V3ZBVB7VTIHSKJGQ6IDGTAKMNTTMKFO725PRNMU64KAHDLODIUMQ'});

// Add this to the VERY top of the first file loaded in your app
var apm = require('elastic-apm-node').start({

  // Override the service name from package.json
  // Allowed characters: a-z, A-Z, 0-9, -, _, and space
  serviceName: 'nodeTestElk01',
  
  // Use if APM Server requires a secret token
  secretToken: '',
  
  // Set the custom APM Server URL (default: http://localhost:8200)
  serverUrl: 'http://localhost:8200',
  
  // Set the service environment
  environment: 'production'
  })
/**
 * LISTENING TEST
 */

client.on('connect', () => {
  const time = moment().tz('America/Argentina/Buenos_aires').format();  
    
  console.log(`\n[${time}] Connecting to mqtt...`);


  //-----------------------------------------------------------------

  console.log(`\n[${time}] Process Mock Topic test server INI`);

  // testing server mqtt
  client.subscribe('test/server');
  client.publish('test/server', 'Probando server mqtt');

  console.log(`\n[${time}] Process Mock Topic test server END`);

  //-----------------------------------------------------------------

  console.log(`\n[${time}] Process Standard Topics server INI`);

  // test data
  const deviceId = 'concetrador0001';
  // const deviceUId = '2000000000000001';
  const applicationId = 'witac';

  client.subscribe(`v3/$${applicationId}/devices/${deviceId}/join`);
  client.subscribe(`v3/${applicationId}/devices/${deviceId}/up`);
  client.subscribe(`v3/${applicationId}/devices/${deviceId}/down/queued`);
  client.subscribe(`v3/${applicationId}/devices/${deviceId}/down/sent`);
  client.subscribe(`v3/${applicationId}/devices/${deviceId}/down/ack`);
  client.subscribe(`v3/${applicationId}/devices/${deviceId}/down/nack`);
  client.subscribe(`v3/${applicationId}/devices/${deviceId}/down/failed`);
  client.subscribe(`v3/${applicationId}/devices/${deviceId}/service/data`);
  client.subscribe(`v3/${applicationId}/devices/${deviceId}/location/solved`);

  console.log(`\n[${time}] Process Standard Topics server END`);

  //-----------------------------------------------------------------

  console.log(`\n[${time}] Topics Witac TTN subscribed...\n\n\n`);
});

client.on('message', (topic, message) => {
  const time = moment().tz('America/Argentina/Buenos_aires').format();  
    
  console.log(`\n[${time}] received message ON WITAC TTN SERVER:\ntopic: ${topic}`);
  console.log(`[${time}] received message on topic:\n${message}\n`);
});

// Mqtt error calback
client.on('error', err => {
  console.log(err);
  client.end();
});

/**
 * Want to notify controller that garage is disconnected before shutting down
 */
function handleAppExit (options, err) {
    const time = moment().tz('America/Argentina/Buenos_aires').format();  

    console.log(`\n[${time}] handleExit monitor\n[${time}] options: ${JSON.stringify(options)}\n[${time}] error: ${JSON.stringify(err)}\n`)

    if (err) {
      console.log(err.stack)
    }
    
    if (options.exit) {
      process.exit()
    }
  }


/**
 * Handle the different ways an application can shutdown
 */
process.on('exit', handleAppExit.bind(null, {
    cleanup: true
}))

process.on('SIGINT', handleAppExit.bind(null, {
    exit: true
}))

process.on('uncaughtException', handleAppExit.bind(null, {
    exit: true
}))
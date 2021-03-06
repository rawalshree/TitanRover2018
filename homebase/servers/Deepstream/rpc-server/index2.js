const PromiseSocket = require('promise-socket')
const { getClient } = require('../common/deepstream');
const { createDataString, getJointNameFromAddress, getSpeedNameFromValue } = require('./utils')
const {
    ADD_COORDINATE,
    DELETE_ALL_COORDINATES,
    DELETE_COORDINATE,
    POP_COORDINATE
} = require('./constants');

const armEndpoint = {
    host: '192.168.1.2',
    port: 9080
};

const coordinatesEndpoint = {
    host: 'localhost',
    port: 9090
};

async function main() {
    const tcpArmClient = new PromiseSocket();
    // const tcpCoordinateClient = new PromiseSocket();
    const dsClient = await getClient('homebase');
    // await tcpCoordinateClient.connect(coordinatesEndpoint);

    await tcpArmClient.connect(armEndpoint);

    console.log('Ready to rpc provide on homebase deepstream.')

    // hook up rpc providers for deepstream
    // dsClient.rpc.provide('addCoordinate', async (data, response) => {
    //     try {
    //         const formattedData = createDataString(ADD_COORDINATE, data);
    //         console.log(`addCoordinate - formattedData: ${formattedData}`);
    //         const totalBytesSent = await tcpCoordinateClient.write(formattedData)
    //         response.send(`Successfully added your coordinate for: ${formattedData}`);
    //     }
    //     catch (err) {
    //         response.error(err.toString())
    //     }
    // });

    // dsClient.rpc.provide('popCoordinate', async (data, response) => {
    //     try {
    //         const formattedData = createDataString(POP_COORDINATE, data);
    //         console.log(`popCoordinate - formattedData: ${formattedData}`);
    //         const totalBytesSent = await tcpCoordinateClient.write(formattedData)
    //         response.send(`Successfully popped off the top coordinate for: ${formattedData}`);
    //     }
    //     catch (err) {
    //         response.error(err.toString())
    //     }
    // });

    // dsClient.rpc.provide('deleteCoordinate', async (data, response) => {
    //     try {
    //         const formattedData = createDataString(DELETE_COORDINATE, data);
    //         console.log(`deleteCoordinate - formattedData: ${formattedData}`);
    //         const totalBytesSent = await tcpCoordinateClient.write(formattedData)
    //         response.send(`Successfully deleted your coordinate for: ${formattedData}`);
    //     }
    //     catch (err) {
    //         response.error(err.toString())
    //     }
    // });

    // dsClient.rpc.provide('deleteAllCoordinates', async (data, response) => {
    //     try {
    //         const formattedData = createDataString(DELETE_ALL_COORDINATES, data);
    //         console.log(`deleteAllCoordinates - formattedData: ${formattedData}`);
    //         const totalBytesSent = await tcpCoordinateClient.write(formattedData)
    //         response.send(`Successfully deleted all the coordinates.`);
    //     }
    //     catch (err) {
    //         response.error(err.toString())
    //     }
    // });

    dsClient.rpc.provide('changeMotorSpeed', async (data, response) => {
        try {
            const { address, value } = data;
            const formattedData = createDataString(address, value);
            console.log(`changeMotorSpeed - formattedData: ${formattedData}`);

            const totalBytesSent = await tcpArmClient.write(formattedData)
            const jointName = getJointNameFromAddress(address);
            const speedName = getSpeedNameFromValue(value);
            response.send(`Successfully changed the motor of ${jointName} to ${speedName}.`);
        }
        catch (err) {
            response.error(err.toString())
        }
    });

    dsClient.rpc.provide('rotateMotor', async (data, response) => {
        try {
            const { address, value, direction } = data;
            const formattedData = `${address},${direction}${Math.abs(value)}`;
            console.log(`rotateMotor - formattedData: ${formattedData}`);

            const totalBytesSent = await tcpArmClient.write(formattedData)
            const jointName = getJointNameFromAddress(address);
            response.send(`Successfully rotated motor for ${jointName}.`);
        }
        catch (err) {
            response.error(err.toString())
        }
    });
};

// run the main function
main();
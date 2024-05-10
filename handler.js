const AWS = require('aws-sdk');
const { Client } = require('pg');

exports.handler = async (event, context) => {
    const secretName = "dev-sls-DBSecret";
    const regionName = "us-east-1";
    
    const secretsManagerClient = new AWS.SecretsManager({
        region: regionName
    });
    
    const secretPromise = secretsManagerClient.getSecretValue({ SecretId: secretName }).promise();
    
    let secretData;
    try {
        const secret = await secretPromise;
        secretData = JSON.parse(secret.SecretString);
    } catch (error) {
        console.error("Error retrieving secret:", error);
        throw error;
    }
    
    const dbOptions = {
        host: "testsaileshrdsproxy.proxy-crtlme88jyeh.us-east-1.rds.amazonaws.com",
        port: 5432,
        database: "testsaileshdb",
        user: secretData.username,
        password: secretData.password,
        ssl: {
            rejectUnauthorized: false
        }
    };
    
    const client = new Client(dbOptions);

    try {
        await client.connect();
        console.log("Connected to Aurora PostgreSQL database");
    } catch (error) {
        console.error("Error connecting to Aurora PostgreSQL database:", error);
        throw error;
    }
    

    const query = "SELECT * FROM mytable;";
    let results;
    try {
        const res = await client.query(query);
        results = res.rows;
        console.log("Data fetched successfully:", results);

    } catch (error) {
        console.error("Error executing SQL query:", error);
        throw error;
    } finally {
        await client.end();
    }
    
    return {
        statusCode: 200,
        body: JSON.stringify('Data fetched successfully')
    };
};

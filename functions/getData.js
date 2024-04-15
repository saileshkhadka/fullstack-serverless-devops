const AWS = require('aws-sdk');
const { Client } = require('pg');

exports.handler = async (event) => {
    const secretName = "arn:aws:secretsmanager:us-east-1:287655590105:secret:DatabasePassword-GEDTJnV2cYE0-4e4w1z";
    const region = "us-east-1";
    const secret = await getSecret(secretName, region);
    const client = new Client({
        user: "taskdevops",
        host: secret.host,
        database: "taskDevOps",
        password: secret.password,
        port: 5432
    });

    await client.connect();

    const res = await client.query('SELECT * FROM mytable');

    await client.end();

    const response = {
        statusCode: 200,
        body: JSON.stringify(res.rows),
    };

    return response;
};

const getSecret = async (secretName, region) => {
    const secretsManager = new AWS.SecretsManager({ region: region });
    const data = await secretsManager.getSecretValue({ SecretId: secretName }).promise();

    if ('SecretString' in data) {
        return JSON.parse(data.SecretString);
    } else {
        const buff = new Buffer(data.SecretBinary, 'base64');
        return JSON.parse(buff.toString('ascii'));
    }
};
const AWS = require('aws-sdk')
const documentClient = new AWS.DynamoDB.DocumentClient()
const secretsmanager = new AWS.SecretsManager()
AWS.config.update({ region: process.env.AWS_REGION })

/**
 * Secret Manager
 */
async function getSecret() {
    const params = {
        SecretId: 'openai_key'
    }
    const res = await secretsmanager.getSecretValue(params).promise()
    return res.SecretString
}

/**
 * DynamoDB
 */
async function getCachedAnswer(key) {
    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {
            id: key
        }
    }

    const result = await documentClient.get(params).promise()
    return result.Item
}

async function saveAnswer(props) {
    const params = {
        TableName: process.env.TABLE_NAME,
        Item: {
            id: props.id,
            content: props.content
        }
    }

    await documentClient.put(params).promise()
}

/**
 * ChatGPT
 */
async function askQuestion(question) {
    const secret = await getSecret()
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${secret}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: question }]
        })
    }

    return fetch('https://api.openai.com/v1/chat/completions', options).then(
        (response) => response.json()
    )
}

exports.handler = async (event) => {
    const question = JSON.parse(event.body).input
    const savedRes = await getCachedAnswer(question)
    if (savedRes) {
        return {
            statusCode: 200,
            body: JSON.stringify({
                status: 'ok',
                data: savedRes.content
            })
        }
    }

    const res = await askQuestion(question)
    const content = res.choices[0].message.content
    await saveAnswer({
        id: question,
        content
    })

    return {
        statusCode: 200,
        body: JSON.stringify({
            status: 'ok',
            data: content
        })
    }
}

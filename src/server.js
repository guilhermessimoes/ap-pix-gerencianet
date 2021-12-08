if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()    
}

const axios = require('axios')
const fs = require('fs')
const path = require('path')
const https = require('https')

const cert = fs.readFileSync(
    path.resolve(__dirname,`../certs/${process.env.GN_CERT}` )
)

const agent = new https.Agent({
    pfx: cert,
    passphrase: '',
})

const credentials = Buffer.from(`${process.env.GN_CLIENT_ID}:${process.env.GN_CLIENT_SECRET}`).toString('base64')

axios({
    method: 'POST',
    url: `${process.env.GN_ENDPOINT}/oauth/token`,
    headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json'
    },
    httpsAgent: agent,
    data: {
        grant_type: 'client_credentials'
    }
}).then((response) => console.log(response.data))

console.log(credentials)
console.log(cert)
console.log(process.env.GN_CERT)

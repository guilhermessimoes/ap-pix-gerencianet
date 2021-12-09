if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()    
}


const express = require('express')
const GNRequest = require('./apis/gerencianet')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())

app.set('view engine', 'ejs')
app.set('views', 'src/views')

const reqGNAlready = GNRequest({
    clientID: process.env.GN_CLIENT_ID,
    clientSecret: process.env.GN_CLIENT_SECRET
})

app.get('/', async (req, res) => {
    const reqGN = await reqGNAlready
    const dataCob = {
        calendario: {
            expiracao: 3600
        },  
        valor: {
            original: '100.00'
        },
        chave: 'f90a2e45-ba54-41b9-b1d6-0dff8ce9559e',
        solicitacaoPagador: 'Cobrança dos serviços Prestado.'
    }
    
    const cobResponse = await reqGN.post('/v2/cob', dataCob)    
    const qrcodeResponse = await reqGN.get(`/v2/loc/${cobResponse.data.loc.id}/qrcode`)
  
    res.render('qrcode', {qrcodeImage: qrcodeResponse.data.imagemQrcode})
})


app.get('/cobrancas', async(req,res) =>{
    const reqGN = await reqGNAlready

    const cobResponse = await reqGN.get('/v2/cob?inicio=2021-02-22T16:01:35Z&fim=2021-12-10T20:10:00Z')

    res.send(cobResponse.data)

})

app.post('/webhook(/pix)?', (req, res) => {
    console.log(req.body)
    res.send('200')
})
app.listen(3000, ()=>{ 
})



//console.log(credentials)
//console.log(cert)
//console.log(process.env.GN_CERT)


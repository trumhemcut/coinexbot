import dotenv from 'dotenv'
import restify from 'restify'
import * as botbuilder from 'botbuilder'
import coinpriceApi from './coinpriceApi'
import fs from 'fs'
import { connect } from 'tls';

dotenv.config()

const listenPort = process.env.port || process.env.PORT || 3978

var server = restify.createServer()
server.listen(listenPort, '::', () => {
    console.log('%s listening to %s', server.name, server.url)
})
server.use(restify.plugins.bodyParser())
server.post('/api/coinprices', coinpriceApi)

var connector = new botbuilder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
})

server.post('/api/messages', connector.listen())

var bot = new botbuilder.UniversalBot(connector, [
    (session, args, next) => {
        session.send('Hi, I can help you to query coin prices (i.e. ETC, ADA, XRP, ...). You can also request me to exchange from BTC to another.')
        botbuilder.Prompts.text(session, `I'm available to help for now :)`)
    },
    (session, result, next) => {
        session.dialogData.description = result.response
        // session.send(`Got it. Your query is "${session.dialogData.description}"`)
        session.send(new botbuilder.Message(session).addAttachment({
            contentType: "application/vnd.microsoft.card.adaptive",
            content: createCard('BTC', '')
        }))
    }
])

const createCard = (coin, data) => {
    var tokenPriceCard = fs.readFileSync('./cards/tokenPrice.json', 'UTF-8')

    return JSON.parse(tokenPriceCard)
}
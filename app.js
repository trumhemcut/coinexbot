import dotenv from 'dotenv'
import restify from 'restify'
import * as botbuilder from 'botbuilder'
import { connect } from 'tls';

dotenv.config()

var server = restify.createServer()
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log('%s listening to %s', server.name, server.url)
})

var connector = new botbuilder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
})

server.post('/api/messages', connector.listen())

var bot = new botbuilder.UniversalBot(connector, [
    (session, args, next) => {
        session.send('You said: %s which was %s characters', session.message.text.length, session.message.text)
    }
])
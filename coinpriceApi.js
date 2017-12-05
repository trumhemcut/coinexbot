import { request } from "http";

module.exports = (req, res) => {
    console.log('Coin price query received: %s', req.body)

    res.send('Hello')
}
const http = require('http');
const app = require('./app');
const basicPath = require('path').resolve;

const port = process.env.PORT || 4000;
const server = http.createServer(app)
const io = require('socket.io')(server)
app.locals.basicPath = basicPath;

io.sockets.on('connection', (socket) => {
    console.log('The user connected')
    app.locals.io = io;
    app.locals.socket = socket;
})

server.listen(port)
console.log(`Working ${process.env.PORT} PORT`)

const app = require('express')()
const http = require('http')
const server = http.createServer(app)
const PORT = 4001

const bodyParse = require('body-parser')
const cors = require('cors')

const io = require('socket.io')(server)

const Room = require("./model/RoomSchema");
const connect = require("./config/db");

app.use(bodyParse.json())
app.use(cors())

var userNamed = []

io.on('connection', socket => {
    console.log('user connected')
    socket.on('user_name', (data) => {
        console.log(userNamed)
        var c = userNamed.includes(data.userNamed)
        console.log(c)
        if (c) {
            io.sockets.emit('user_named', { userNamed: c })
        } else {
            userNamed.push(data.userNamed)
            io.sockets.emit('user_named', { userNamed: c })
        }
        console.log(userNamed)
    })
    socket.on('user_logout', (data) => {
        console.log(data)
        var c = userNamed.indexOf(data.username)
        console.log(c)
        if (c > -1)
            userNamed.splice(c, 1)
        console.log(userNamed)
    })
    socket.on('create_room', (data) => {

        console.log(data)
        let room = new Room({
            roomName: data.roomName,
            roomOwner: data.roomOwner,
            roomMod: []
        });
        room.save((err, product) => {
            console.log(product.id)
            io.sockets.emit('view_room', Object.assign({
                id: product.id,
                ...data
            }))
        });
    })
    socket.on('chat_room', (data) => {
        console.log(data)
    })
    socket.on('add_chat', (data) => {
        console.log(data)
        let roomChat = {
            messageChat: data.message,
            senderChat: data.sender,
            createAtChat: data.createdAt
        }
        Room.findByIdAndUpdate(
            { _id: data.roomId },
            { $push: { roomChat: roomChat } },
            { new: true },
            (err, res) => {
                console.log(err)
                console.log("test" + res.roomChat.slice(-1).pop())
                io.sockets.emit('new_chat', Object.assign({
                    id: res.roomChat.slice(-1).pop()._id,
                    ...data
                }))
            })
    })
    socket.on('edit_room', (data) => {
        console.log(data)
        let roomMod = data.username
        Room.findOneAndUpdate(
            { _id: data.roomId },
            { $push: { roomMod: roomMod } },
            (err) => console.log(err))
        io.sockets.emit('edit_room', (data))
    })
    socket.on('delete_chat', (data) => {
        console.log(data)
        Room.findOneAndUpdate({ _id: data.roomId },
            {
                $pull: {
                    roomChat: { _id: data.chatId }
                }
            }, err => console.log(err))
        io.sockets.emit('deleted_chat', data)
    })
    connect.then(db => {
        console.log("connected correctly to database server")
    })
    io.on('disconnect', () => {
        console.log('user disconnected')
    })
})

app.get('/api/room', (req, res) => {
    res.statusCode = 200
    connect.then(db => {
        Room.find({}).then(data => {
            res.json(data)
        })
    })
})

app.get('/api/room/:roomid', (req, res) => {
    res.statusCode = 200
    console.log(req.params.roomid)
    connect.then(db => {
        Room.findOne({ _id: req.params.roomid })
            .then(data => {
                res.json(data.roomChat)
            })
    })
})

// app.delete('/api/room/:roomid/:chatid', (req, res) => {
//     res.statusCode = 200
//     console.log(req.params.roomid)
//     console.log(req.params.chatid)
//     connect.then(db => {
//         Room.findOne({ _id: req.params.roomid, roomChat: [{ _id: req.params.chatid }] }).remove().exec()
//     })
// })
// app.post('/', (req, res) => {
//     res.statusCode = 200
//     console.log(req.body.username)
//     const userFind = userLoged.find(user => {
//         return user == req.body.username
//     })
//     if (userFind) {
//         res.send({ userFind: true })
//     } else {
//         userLoged.push(req.body.username)
//         res.send({ userFind: false })
//     }
//     console.log(userLoged)
//     console.log(userFind)
// })


// app.post('/api/room/create', (req, res) => {
//     // console.log(req.body)
//     let room = new Room({
//         roomName: req.body.roomName,
//         roomOwner: req.roomOwner,
//         roomMod: [],
//         roomChat: {}
//     });
//     room.save();
// })

// app.get('/api/room/:id', (req, res) => {
//     var id = req.param.id

// })

// app.get('/room/:id', (req, res) => {
//     socket.on('text client', (data) => {
//         console.log('text message: ', data)
//         io.sockets.emit('text server', data)
//         let room = new Room({
//             roomName: data.roomName,
//             roomOwner: data.roomOwner,
//             roomMod: [],
//             roomChat: {}
//         });
//         room.save();
//     })
// })

server.listen(PORT, () => { console.log('Server on port ' + PORT) })
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const roomSchema = new Schema({
    roomName: {
        type: String
    },
    roomOwner: {
        type: String
    },
    roomMod: {
        type: [String]
    },
    roomChat: [{
        messageChat: {
            type: String
        },
        senderChat: {
            type: String
        },
        createAtChat: {
            type: String
        }
    }]
});

let Room = mongoose.model("Room", roomSchema);
module.exports = Room;
const conversationsService = require("./services/conversationsService");
const messagesService = require("./services/messagesService");
const usersService = require("./services/usersService");
const dotenv = require("dotenv")
dotenv.config()
const PORT = process.env.PORT || 8900 
const io = require("socket.io")(PORT, {
    cors: {
        origin: ["http://localhost:3000", "https://titki-clone-app.vercel.app"],
    },
});

let users = [];

const addUser = (user, socketId) => {
    users.push({ user, socketId });
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
    return users.find((user) => user.user._id === userId);
};

const getUserBySocketId = (socketId) => {
    return users.find((user) => user.socketId === socketId);
}

io.on("connection", (socket) => {
    //when ceonnect
    console.log("a user connected.");

    socket.on("addConversation", async ({ senderId, receiverId }) => {
        try {
            const user = getUser(senderId)

            const conversationSaved = await conversationsService.createConversation({ senderId, receiverId })
            await io.to(`${user.socketId}`).emit("getConversationByTwoUser", conversationSaved)
        } catch (err) {
            console.log(err)
        }
    })

    socket.on("getConversationByTwoUser", async ({ senderId, receiverId }) => {
        try {
            const user = getUser(senderId)
            if (user) {
                const conversation = await conversationsService.getConversationOfTwoUser(senderId, receiverId)
                await io.to(`${user.socketId}`).emit("getConversationByTwoUser", conversation)
            }

        } catch (err) {
            console.log("Error tow conversation")
        }
    })

    socket.on("getConversationsByUser", async (userId) => {

        try {
            
            const user = getUser(userId)
            if (user) {
                const conversations = await conversationsService.getConversationByUserId(userId)
                await conversations.forEach(con => {

                })
                io.to(`${user.socketId}`).emit("getConversationsByUser", conversations)
            }

        } catch (err) {
            console.log("Error Conversation user")
        }
    })

    socket.on("getNotifyByUser", async (data) => {
        
    })

    socket.on("getMessages", async (data) => {
        try {
            const { userId, conversationId } = data

            const user = getUser(userId)
            const messages = await messagesService.getMessageByConversation(conversationId)
            await io.to(`${user.socketId}`).emit("getMessages", { conversationId: conversationId, messages: messages })
        } catch (err) {
            console.log(err)
        }
    })

    //take userId and socketId from user
    socket.on("addUser", async (userId) => {
        try {
            const user = getUser(userId)
            if (!user) {
                const findUser = await usersService.findById(userId)
                await addUser({ ...findUser, status: 1 }, socket.id);

                const updatedUser = await usersService.update(
                    userId,
                    {
                        ...findUser,
                        password: findUser.isAdmin === 1 ? "duy123" : findUser.password,
                        status: 1
                    }
                )

                await io.emit("getUsers", users);
            }

        } catch (err) {
            console.log(err)
        }



    });

    //send and get message
    socket.on("sendMessage", async (data) => {
        const { conversationId, sender, receiver, text } = data
        const user = getUser(receiver);
        const findSender = getUser(sender)
        const message = await messagesService.createMessage(
            {
                conversationId: conversationId,
                sender: sender,
                text: text
            }
        )
        await io.to(`${findSender.socketId}`)
            .emit(
                `sendMessage`,
                {
                    ...message,
                    createdAt: Date.now()
                }
            )

        if (user) {
            io.to(`${user.socketId}`).emit("getMessage", {
                conversationId,
                sender,
                text,
                createdAt: Date.now()
            });
        }
    });

    //when disconnect
    socket.on("disconnect", async () => {
        console.log("a user disconnected!");

        try {
            const user = await getUserBySocketId(socket.id)
            removeUser(socket.id);
            io.emit("getUsers", users);
            if (user) {
                const findUser = await usersService.findById(user.userId)
                await usersService.update(
                    user.userId,
                    {
                        ...findUser,
                        password: findUser.isAdmin === 1 ? "duy123" : findUser.password,
                        status: 0
                    }
                )

            }
        } catch (err) {
            console.log(err)
        }


    });
});
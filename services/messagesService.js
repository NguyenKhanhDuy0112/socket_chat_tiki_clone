const api = require('./api')

const createMessage = (data) => {
    return api.post(api.url.messages, data).then(res => res.data)
}

const getMessageByConversation = (conversationId) => {
    return api.get(`${api.url.messages}/${conversationId}`).then(res => res.data)
}

const messagesService = {
    createMessage,
    getMessageByConversation
}

module.exports = messagesService
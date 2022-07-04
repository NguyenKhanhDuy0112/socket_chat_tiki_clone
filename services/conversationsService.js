const api = require('./api')

const getConversationByUserId = (userId) => {
    return api.get(`${api.url.conversations}/${userId}`).then(res => res.data)
}

const getConversationOfTwoUser = (firstUser, secondUser) => {

    return api.get(`${api.url.conversations}/${firstUser}/${secondUser}`).then(res => res.data)
}

const createConversation = (data) => {
    return api.post(`${api.url.conversations}`, data).then(res => res.data)
}

const conversationsService = {
    getConversationByUserId,
    getConversationOfTwoUser,
    createConversation,
}

module.exports =  conversationsService;
const conversationsService = require("../services/conversationsService");

class ConversationController{

    async getConversationByTwoUser(senderId, receiveId){
        const conversation = await conversationsService.getConversationOfTwoUser(senderId, receiveId)
        return conversation.data
    }
}

module.exports = new ConversationController()
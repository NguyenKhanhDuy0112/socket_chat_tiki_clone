const api = require('./api')

const findById = (id) => {
    return api.get(`${api.url.users}/${id}`).then(res => res.data)
}

const update = (id ,data) => {
    return api.put(`${api.url.users}/${id}`, data).then(res => res.data)
}

const usersService = {
    findById,
    update,
}

module.exports = usersService;
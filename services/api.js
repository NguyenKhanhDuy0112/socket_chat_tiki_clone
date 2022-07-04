const axios = require('axios')

const url = {
    baseUrl : process.env.API_URL,
    categories: '/categories',
    products: "/products",
    users : '/users',
    bills: "/bills",
    trademarks: "/trademarks",
    billDetails: "/bill-details",
    productDetails: "/product-details",
    conversations: "/conversations",
    messages: "/messages",
    coupons: "/coupons",
    location: "/location",
    comments: '/comments',
    actions: "/actions"
}

const instance = axios.create({
    baseURL : url.baseUrl,
    headers: {
        "Content-Type":"application/json",
        Accept:"application/json"
    }
})

const api = {
    url,
    instance,
    get:instance.get,
    put:instance.put,
    delete:instance.delete,
    post:instance.post
}


module.exports =  api;



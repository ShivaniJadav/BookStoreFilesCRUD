const { login } = require('../controllers/userController')

class userRoute {
    constructor(router) {
        this.route(router)
    }

    route(router) {
        router.post('/login', login);
    }
}

module.exports = userRoute;
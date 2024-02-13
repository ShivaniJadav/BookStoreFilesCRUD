const { getAllBooks, addBooks, deleteBooks } = require('../controllers/bookController')
const { verifyToken } = require('../middleware/authController');

class bookRoute {
    constructor(router) {
        this.route(router)
    }

    route(router) {
        router.get('/home', verifyToken, getAllBooks);
        router.post('/addBook', verifyToken, addBooks);
        router.delete('/deleteBook/:name', verifyToken, deleteBooks);
    }
}

module.exports = bookRoute;
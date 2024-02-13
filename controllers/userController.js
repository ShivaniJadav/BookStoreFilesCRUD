const jwt = require('jsonwebtoken');

login = function (req, res) {
    var { username, password } = req.body, token = {};
    if (username == "regular_user" && password == "user1234") {
        token = jwt.sign({ user: username, role: 'user' }, 'bookstore', { expiresIn: '1D' });
    } else if (username == "admin_user" && password == "admin1234") {
        token = jwt.sign({ user: username, role: 'admin' }, 'bookstore', { expiresIn: '1D' });
    } else {
        res.json({ msg: "Invalid credentials!" });
    }
    res.json({ msg: "Logged In successfully!", token });
}

module.exports = { login };
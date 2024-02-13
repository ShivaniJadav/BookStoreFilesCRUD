const fs = require('fs');
const csvReader = require('csv-parser');
const csvWriter = require('csv-writer');

addBooksBulk = async function (fileToRead, booksToAdd) {
    try {
        var writer = await csvWriter.createObjectCsvWriter({
            path: fileToRead,
            header: [
                { id: "Book Name", title: "Book Name" },
                { id: "Author", title: "Author" },
                { id: "Publication Year", title: "Publication Year" }
            ],
            recordDelimiter: `\n`
        })
        await writer.writeRecords(booksToAdd);
        return 0;
    } catch (err) {
        return 1;
    }

}

getAllBooks = function (req, res) {
    var books = [];

    fs.createReadStream('files\\regularUser.csv')
        .pipe(csvReader())
        .on('data', (book) => books.push(book))
        .on('end', () => {
            if (req.body.role && req.body.role == 'admin') {
                fs.createReadStream('files\\adminUser.csv')
                    .pipe(csvReader())
                    .on('data', (book) => books.push(book))
                    .on('end', () => { res.json({ count: books.length, books: books }) })
                    .on('error', (err) => { res.json({ err, res: 1, books: [] }) });
            } else {
                res.json({ count: books.length, books: books })
            }
        })
        .on('error', (err) => res.json({ err: err, books: [] }));
}

addBooks = function (req, res) {
    if (req.body.role && req.body.role == 'admin') {
        if (typeof req.body.name == "undefined" || req.body.name == "" || typeof req.body.name != "string") {
            res.json({ msg: "Please enter valid name for a book!" });
        } else if (typeof req.body.auther == "undefined" || req.body.auther == "" || typeof req.body.auther != "string") {
            res.json({ msg: "Please enter valid name for an auther!" });
        } else if (typeof req.body.year == "undefined" || req.body.year == "" || typeof req.body.year != "number" || req.body.year.toString().length != 4 || !(req.body.year >= 1800 && req.body.year <= new Date().getUTCFullYear())) {
            res.json({ msg: "Please enter valid year of publication!" });
        } else if (req.body.role && req.body.role == 'admin') {
            var fileToRead = 'files\\regularUser.csv';
            var writer = csvWriter.createObjectCsvWriter({
                path: fileToRead,
                header: [
                    { id: "name", title: "Book Name" },
                    { id: "auther", title: "Author" },
                    { id: "publishedIn", title: "Publication Year" }
                ],
                append: 'a',
                recordDelimiter: `\n`
            })
            writer.writeRecords([{ name: req.body.name, auther: req.body.auther, publishedIn: req.body.year }])
                .then(() => {
                    res.json({ msg: "book added to the file!" });
                })
        }
    } else {
        res.json({ msg: "You are not authorized for this operation!" });
    }
}

deleteBooks = function (req, res) {
    if (req.body.role && req.body.role == 'admin') {
        if (typeof req.params.name == "undefined" || req.params.name == "" || typeof req.params.name != "string") {
            res.json({ msg: "Please enter valid name for a book!" });
        } else {
            var fileToRead = 'files\\regularUser.csv';
            var books = [], flag = 0;

            fs.createReadStream(fileToRead)
                .pipe(csvReader())
                .on('data', (book) => {
                    if (book["Book Name"].toLowerCase() != req.params.name.toString().toLowerCase()) {
                        books.push(book)
                    } else {
                        flag = 1;
                    }
                })
                .on('end', async () => {
                    if (flag == 0) {
                        res.json({ msg: `Book with the name \'${req.params.name}\' not found!` });
                    } else {
                        var data = await addBooksBulk(fileToRead, books);
                        if (data == 0) {
                            res.json({ msg: "book deleted from the file" });
                        } else {
                            res.json({ msg: "Something went wrong!", err: response.err });
                        }
                    }
                }).on('error', (err) => res.json(err));
        }
    }
    else {
        res.json({ msg: "You are not authorized for this operation!" });
    }
}

module.exports = {
    getAllBooks,
    addBooks,
    deleteBooks
}
const express = require('express')
const router = express.Router()

const upload = require('../../middlware/file')

const { Book } = require('../../models')
const db = {
    books: []
}

function getIndex(array, id) {
    return array.findIndex(item => item.id === id)
}

function getBookFile(req, books) {
    const selectedBook = books.filter(book => book.id === req.params.id)
    const file = `public/uploads/${selectedBook[0].fileBook}`
    return file
}

router.get('/', (req, res) => {
    const { books } = db

    if (books.length) {
        res.json(books)
    } else {
        res.send('Пока нет ни одной книги :(')
    }
})

router.get('/err', (req, res) => {
    throw new Error('Something wrong!')
})

router.get('/:id', (req, res) => {
    const { books } = db
    const { id } = req.params
    const bookIndex = getIndex(books, id)

    if (bookIndex === -1) {
        res.status(404).res.json(`Такая книга не найдена`)
    } else {
        res.json(books[bookIndex])
    }
})

router.post('/', upload.single('book'), (req, res) => {
    const { books } = db
    const { title, description, authors, favorite, fileCover, fileName } = req.body
    const fileBook = req.file ? req.file.filename : null
    const book = new Book(title, description, authors, favorite, fileCover, fileName, fileBook)
    books.push(book)

    res.status(201)
    res.json(book)
})

router.put('/:id', upload.single('book'), (req, res) => {
    const { books } = db
    const { id } = req.params
    const { title, description, authors, favorite, fileCover, fileName } = req.body
    const fileBook = req.file ? req.file.filename : null
    const bookIndex = getIndex(books, id)

    if (bookIndex === -1) {
        res.status(404).res.json(`Такая книга не найдена`)
    } else {
        books[bookIndex] = {
            ...books[bookIndex],
            title,
            description,
            authors,
            favorite,
            fileCover,
            fileName,
            fileBook
        }
        res.json(books[bookIndex])
    }
})

router.delete('/:id', (req, res) => {
    const { books } = db
    const { id } = req.params
    const bookIndex = getIndex(books, id)

    if (bookIndex === -1) {
        res.status(404).res.json(`Такая книга не найдена`)
    } else {
        books.splice(bookIndex, 1)
        res.status(204).end()
    }
})

router.get('/:id/download', (req, res) => {
    const { books } = db

    if (books.length) {
        res.download(getBookFile(req, books), err => {
            if (err) res.status(404).json()
        })
    } else {
        res.status(404).json(`Книги отсутствуют!`)
    }
})

module.exports = router

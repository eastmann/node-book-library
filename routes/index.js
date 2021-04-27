const express = require('express')
const router = express.Router()

const upload = require('../middlware/file')

const { Book } = require('../models')
const db = {
    books: []
}

function getIndex(array, id) {
    return array.findIndex(item => item.id === id)
}

router.get('/', (req, res) => {
    const { books } = db

    res.render('pages/index', {
        title: 'Библиотека',
        books: books
    })
})

router.get('/create', (req, res) => {
    res.render('pages/create', {
        title: 'Библиотека | Добавить',
        book: {}
    })
})

router.post('/create', upload.single('book'), (req, res) => {
    const { books } = db
    const { title, description, authors, favorite, fileCover, fileName } = req.body
    const fileBook = req.file ? req.file.filename : null
    const book = new Book(title, description, authors, favorite, fileCover, fileName, fileBook)
    books.push(book)

    res.redirect('/')
})

router.get('/:id', (req, res) => {
    const { books } = db
    const { id } = req.params
    const bookIndex = getIndex(books, id)

    if (bookIndex === -1) {
        res.status(404).redirect('/404')
    } else {
        res.render('pages/view', {
            title: 'Библиотека | Просмотр',
            book: books[bookIndex]
        })
    }
})

router.get('/update/:id', (req, res) => {
    const { books } = db
    const { id } = req.params
    const bookIndex = getIndex(books, id)

    if (bookIndex === -1) {
        res.status(404).redirect('/404')
    } else {
        res.render('pages/update', {
            title: 'Библиотека | Изменить',
            book: books[bookIndex]
        })
    }
})

router.post('/update/:id', upload.single('book'), (req, res) => {
    const { books } = db
    const { id } = req.params
    const { title, description, authors, favorite, fileCover, fileName } = req.body
    const fileBook = req.file ? req.file.filename : null
    const bookIndex = getIndex(books, id)

    if (bookIndex === -1) {
        res.status(404).redirect('/404')
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
        res.redirect(`/`)
    }
})

router.post('/delete/:id', (req, res) => {
    const { books } = db
    const { id } = req.params
    const bookIndex = getIndex(books, id)

    if (bookIndex === -1) {
        res.status(404).res.redirect('/404')
    } else {
        books.splice(bookIndex, 1)
        res.redirect('/')
    }
})

module.exports = router

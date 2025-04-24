const express = require('express')
const exphbs = require('express-handlebars')
const mysql = require('mysql2')
require('dotenv').config()

const app = express()

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(express.static('public'))


app.get('/', (req, res) => {
    res.render('home')
})

const conn = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
})

app.post('/books/insertbook', (req, res) => {

    const title = req.body.title
    const pageqty = req.body.pageqty

    const query = 'INSERT INTO books (title, pageqty) VALUES (?, ?)'
    conn.query(query, [title, pageqty], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Erro ao inserir livro');
        }
        res.redirect('/books');
    })
})

app.get('/books', (req, res) => {
    const query = 'SELECT * FROM books'

    conn.query(query, function (err, data) {
        if (err) {
            console.log(err)
            return
        }

        const books = data


        res.render('books', { books })
    })
})

app.get('/books/:id', (req, res) => {
    const id = req.params.id

    const query = `SELECT * FROM books WHERE id = ${id}`

    conn.query(query, function (err, data) {
        if (err) {
            console.log(err)
            return
        }
        const book = data[0]

        res.render('book', { book })
    })
})

conn.connect(function (err) {

    if (err) {
        console.log(err)
    }

    console.log('Conectou ao MYSQL')

    app.listen(3000)
})
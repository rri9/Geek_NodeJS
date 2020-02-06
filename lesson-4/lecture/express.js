const express = require('express');
const path = require('path');
const consolidate = require('consolidate');

const app = express();

// Настраиваем handlebars
app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

// Middleware
// app.use('/users', express.json());
app.use(express.json());
// Необходимо для парсинга body в пост запросах. extended указывает на возможность парсть вложенные структуры.
app.use(express.urlencoded({extended: true}));
// Опишем статику для стилей. Аналогично можно расписать для других статичных ресурсов.
app.use('/styles', express.static(path.resolve(__dirname, 'assets/css')));

// написание собственного middleware
app.use((req, res, next) => {
    console.log('middleware1');
    req.user = { name: 'John' };
    next(); // res.redirect('/...');
});

// Роутинг
// описываем общий обработчик для всех роутов
app.all('/', (req, res, next) => {
    console.log('all');
    next();
});
app.get('/', (req, res) => {
    // console.log('Hello World');
    // res.send('Hello World!');
    // res.json({ message: 'Hello World!' });
    // res.send('<h2>Hello World!</h2>');
    res.sendFile(path.resolve(__dirname, 'index.html'));
});
app.get('/user', (req, res) => {
    res.render('user', {
        fullName: 'John Snow',
        achievements: ['Главный сторож стены', 'Winter is coming!'],
    });
});

app.get('/users', (req, res) => {
    res.send('users');
});

app.get('/users/:id', (req, res) => {
    console.log(req.params, req.query);
    res.send('Params');
});

app.post('/tasks', (req, res) => {
    console.log(req.body);
    res.send('OK');
});

app.listen(8000, () => {
    console.log('Server has been started!');
});

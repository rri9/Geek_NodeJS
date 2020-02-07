const express = require('express'),
  app = express(),
  path = require('path'),
  hbs = require('hbs');

const connParams = {
  host: '127.0.0.1',
  port: '3306',
  database: 'mysql',
  user: 'root',
  password: 'pwd',
};

const Conn = require('./connection');
const conn = new Conn(connParams);
conn.execCmd('USE homeworkDB;');

app.set('view engine', 'hbs'); //По умолчанию используем шаблоны hbs
app.set('views', path.resolve(__dirname, 'views')); //Каталог с шаблонами

app.use('/styles', express.static(path.resolve(__dirname, 'assets')));
app.use(express.urlencoded({ extended: true }));

app.all('/', async (req, res, next) => {
  console.log('Receved request at /');
  // res.send('Cars DB');
  const carsArr = await getAllCars();
  console.log(carsArr);

  res.render('index.hbs', {
    cars: carsArr,
    // [
    //   {
    //     id: 1,
    //     mark: 'KIA',
    //     model: 'CEED',
    //     year: 2014,
    //     price: 750000,
    //   },
    // ],
  });
});

app.listen(8000, () => {
  console.log('Server listenning on port 8000...');
});

function getAllCars() {
  conn
    .execCmd('SELECT * FROM cars;')
    .then(result => result)
    .finally(() => conn.closeConn())
    // .catch(err => { throw err; });
    .catch(() => console.log('Запрос к БД не выполнен!'));
}

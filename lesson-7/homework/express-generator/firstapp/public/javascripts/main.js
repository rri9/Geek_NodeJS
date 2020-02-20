let app = new Vue({
  el: '#app',
  data: {
    isAutenticated: false,
    message: '',
    autherror: false,
    username: '',
    password: '',
    remember: false,
    cars: [],
    showAddCar: false,
    addCarObj: {
      mark: '',
      model: '',
      year: undefined,
      price: 0,
    },
  },
  methods: {
    getToken: async function (event) {
      event.preventDefault();

      const props = {
        username: this.username,
        password: this.password,
        remember: this.remember,
      };
      let formBody = [];
      Object.keys(props).forEach(prop => {
        const encodedKey = encodeURIComponent(prop);
        const encodedValue = encodeURIComponent(props[prop]);
        formBody.push(encodedKey + '=' + encodedValue);
      });
      formBody = formBody.join('&');

      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: formBody,
      });
      const result = await response.json();
      if (!result.autherror) {
        //TODO Почему не работает на запись с HttpOnly?
        // document.cookie = `token=${result.token}; HttpOnly; path=/`;
        document.cookie = `token=${result.token}; path=/`;
        this.isAutenticated = true;
        return;
      }

      this.message = result.message;
      this.isAutenticated = false;
      this.autherror = true;
    },
    getCarsAll: async function () {
      const response = await fetch('/cars');
      const result = await response.json();

      if (result.autherror) {
        this.isAutenticated = false;
      } else {
        this.isAutenticated = true;
        this.cars = result.cars;
      }
    },
    addCarShow: function (event) {
      event.preventDefault();
      this.showAddCar = true;
    },
    addCar: async function (event) {
      event.preventDefault();
      let formBody = [];
      Object.keys(this.addCarObj).forEach(prop => {
        const encodedKey = encodeURIComponent(prop);
        const encodedValue = encodeURIComponent(this.addCarObj[prop]);
        formBody.push(encodedKey + '=' + encodedValue);
      });
      formBody = formBody.join('&');

      const response = await fetch('/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: formBody,
      });
      const result = await response.json();
      console.log('  In addCar method', result);
      if (result) {
        this.getCarsAll();
        this.showAddCar = false;
      }
    },
    delCar: async function (event) {
      event.preventDefault();
      console.log('  In delCar method data-id = ', event.target.dataset.id);
      //TODO fetch метод delete
    },
  },
  mounted() {
    this.getCarsAll();
  },
  template: `
<div>
  <div class="auth" v-if="!isAutenticated">
    <h2>Авторизация</h2>

    <div class="error-message" v-if="autherror">
      {{message}}
    </div></br>

    <form action="#" method="POST">
      <input type="text" v-model="username" placeholder="username" name="username"><br>
      <input type="password" v-model="password" placeholder="password" name="password"><br>
      <input type="checkbox" v-model="remember" name="remember" id="remember" value="true"><label for="remember">Запомнить меня</label><br>
      <input type="submit" @click="getToken">
    </form>

    <a href="/register">Зарегистрироваться</a>

    <div>
      <h3>Ввели</h3>
      <p>Логин: {{username}}</p>
      <p>Пароль: {{password}}</p>
      <p>rem: {{remember}}</p>
    </div>
  </div>
  
  <div class="cars" v-else>
    <div class="addCar" v-if="showAddCar">
    <h1>Add Car to DB:</h1>
    <form action="#">
      <label>Марка: <input type="text" v-model="addCarObj.mark" name="mark" id="mark" placeholder="Марка"></label><br>
      <label>Модель: <input type="text" v-model="addCarObj.model" name="model" id="model" placeholder="Модель"></label><br>
      <label>Год выпуска: <input type="number" v-model="addCarObj.year" max="2025" min="1900" name="year" id="year" placeholder="1900"></label><br>
      <label>Цена: <input type="number" v-model="addCarObj.price" name="price" id="price"> руб.</label><br>
      <input type="submit" value="Добавить" @click="addCar">
    </form>
    </div>

    <div class="cars-table" v-else>
      <!--//TODO Поправить структуру div class="cars" для vue-->
      <h1>Cars DB</h1>
      <form action="#">
        <button @click="addCarShow">Добавить</button>
      </form>
      <form action="#">
      <!--//TODO  -->
        <button @click="">Изменить</button>
        <label>id: <input type="number" name="id" id="id"></label>
      </form>
      <table>
        <thead>
          <tr>
            <td>#</td>
            <td>id</td>
            <td>Mark</td>
            <td>Model</td>
            <td>Year</td>
            <td>Price</td>
            <td class="no-border">delete</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(car, index) in cars">
            <td>{{index + 1}}</td>
            <td>{{car.id}}</td>
            <td>{{car.mark}}</td>
            <td>{{car.model}}</td>
            <td>{{car.year}}</td>
            <td>{{car.price}}</td>
            <!--//TODO  -->
            <!-- <td class="no-border"><a href="/cars/del?id={{car.id}}">x</a></td> -->
            <td class="no-border"><button @click="delCar" :data-id="car.id">x</button></td>
          </tr>
        </tbody>
      </table>
      <!--//TODO  -->
      <a href="/logout">Выход</a>
    </div>
  </div>
</div>
  `,
});

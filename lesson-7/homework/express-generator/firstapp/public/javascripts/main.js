const app = new Vue({
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
    showChangeCar: false,
    changeCarObj: {
      id: '',
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
        //TODO HttpOnly только со стороны сервера, большинство браузеров не дает даже на запись
        // document.cookie = `token=${result.token}; HttpOnly; path=/`;
        document.cookie = `token=${result.token}; path=/`;
        this.getCarsAll();
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
      if (result) {
        this.getCarsAll();
        this.showAddCar = false;
      }
    },
    delCar: async function (event) {
      event.preventDefault();
      const response = await fetch(`/cars/${event.target.dataset.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      });
      const result = await response.json();
      if (result.affectedRows === 1) {
        this.getCarsAll();
      }
    },
    changeCarShow: function (event) {
      event.preventDefault();
      //TODO Проверка не пустой ли ид и есть ли он в карс
      if (this.changeCarObj.id) {
        document.querySelector('#id').classList.remove('id-need');
        this.showChangeCar = true;
        this.changeCarObj = this.cars.find((car) => car.id === +this.changeCarObj.id);
      } else {
        document.querySelector('#id').classList.add('id-need');
      }
    },
    changeCar: async function (event) {
      event.preventDefault();
      let formBody = [];
      Object.keys(this.changeCarObj).forEach(prop => {
        const encodedKey = encodeURIComponent(prop);
        const encodedValue = encodeURIComponent(this.changeCarObj[prop]);
        formBody.push(encodedKey + '=' + encodedValue);
      });
      formBody = formBody.join('&');

      const response = await fetch('/cars', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: formBody,
      });
      const result = await response.json();
      if (result) {
        this.getCarsAll();
        this.showChangeCar = false;
      }
    },
    logout: function () {
      document.cookie = `token=""; path=/; max-age=-1`;
      this.message = '';
      this.isAutenticated = false;
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
  </div>
      
  <div class="cars" v-else>
      
    <div v-if="showAddCar || showChangeCar">
      
      <div v-if="showAddCar">
        <h1>Add Car to DB:</h1>
        <form action="#">
          <label>Марка: <input type="text" v-model="addCarObj.mark" name="mark" id="mark" placeholder="Марка"></label><br>
          <label>Модель: <input type="text" v-model="addCarObj.model" name="model" id="model" placeholder="Модель"></label><br>
          <label>Год выпуска: <input type="number" v-model="addCarObj.year" max="2025" min="1900" name="year" id="year" placeholder="1900"></label><br>
          <label>Цена: <input type="number" v-model="addCarObj.price" name="price" id="price"> руб.</label><br>
          <input type="submit" value="Добавить" @click="addCar">
        </form>
      </div>
      <div v-if="showChangeCar">
        <h1>Change Car in DB:</h1>
        <form action="#">
          <label>Марка: <input type="text" v-model="changeCarObj.mark" name="mark" id="mark" placeholder="Марка"></label><br>
          <label>Модель: <input type="text" v-model="changeCarObj.model" name="model" id="model" placeholder="Модель"></label><br>
          <label>Год выпуска: <input type="number" v-model="changeCarObj.year" max="2025" min="1900" name="year" id="year" placeholder="1900"></label><br>
          <label>Цена: <input type="number" v-model="changeCarObj.price" name="price" id="price"> руб.</label><br>
          <input type="submit" value="Изменить" @click="changeCar">
        </form>
      </div>
    </div>
    <div class="cars-table" v-else>
      <h1>Cars DB</h1>
      <form action="#">
        <button @click="addCarShow">Добавить</button>
      </form>
      <form action="#">
        <button @click="changeCarShow">Изменить</button>
        <label>id: <input type="number" v-model="changeCarObj.id" name="id" id="id"></label>
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
            <td class="no-border"><button @click="delCar" :data-id="car.id">x</button></td>
          </tr>
        </tbody>
      </table>
      <button @click="logout">Выход</button>
    </div>
  </div>
</div>
  `,
});

/*
    <div v-if="showAddCar>
      <h1>Add Car to DB:</h1>
      <form action="#">
        <label>Марка: <input type="text" v-model="addCarObj.mark" name="mark" id="mark" placeholder="Марка"></label><br>
        <label>Модель: <input type="text" v-model="addCarObj.model" name="model" id="model" placeholder="Модель"></label><br>
        <label>Год выпуска: <input type="number" v-model="addCarObj.year" max="2025" min="1900" name="year" id="year" placeholder="1900"></label><br>
        <label>Цена: <input type="number" v-model="addCarObj.price" name="price" id="price"> руб.</label><br>
        <input type="submit" value="Добавить" @click="addCar">
      </form>
    </div>


    <div v-else-if="showChangeCar>
        <h1>Change Car in DB:</h1>
        <form action="#">
          <label>Марка: <input type="text" v-model="addCarObj.mark" name="mark" id="mark" placeholder="Марка"></label><br>
          <label>Модель: <input type="text" v-model="addCarObj.model" name="model" id="model" placeholder="Модель"></label><br>
          <label>Год выпуска: <input type="number" v-model="addCarObj.year" max="2025" min="1900" name="year" id="year" placeholder="1900"></label><br>
          <label>Цена: <input type="number" v-model="addCarObj.price" name="price" id="price"> руб.</label><br>
          <input type="submit" value="Добавить" @click="addCar">
        </form>
    </div>
*/

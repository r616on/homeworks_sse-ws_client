import createRequest from '../libs/createRequest';

export default class Сhat {
  constructor(parentEl) {
    this.parentEl = parentEl;
    this.url = 'localhost';
    this.port = 7070;

    this.onClick.bind(this);
    this.loginBtn.bind(this);
    this.wsMessage.bind(this);

    // this.onFormEdit.bind(this);
    // this.editStatus.bind(this);
    // this.fullTic.bind(this);

    this.ws = new WebSocket(`ws://${this.url}:${this.port}/ws`);

    this.ws.addEventListener('open', (evt) => {
      console.log('open');
    });

    this.ws.addEventListener('message', (evt) => {
      // handle evt.data
      this.wsMessage(evt);
    });
    this.ws.addEventListener('close', (evt) => {
      console.log('close');

      // After this we can't send messages
    });
    this.ws.addEventListener('error', () => {
      console.log(evt);
      console.log('error');
    });
  }

  static get markup() {
    return ` <div class='chat'>
      <div class="login login__activ">
        <div class="login-row">
           <div class="login-title">Выбирите псевдоним</div>
           <input class="login-input" type="text" name="name" placeholder="Выбирите псевдоним"/>
           <button class="login-btn">Продолжить</button>
        </div>
        

      </div>
      <div class='chat__row'>
        <div class='user'>
          <div class='user__row'>
           
          </div>
        </div>
        <div class='chat-body'>
          <div class='chat-body__row'>

            <div class='massage'>
              <div class='massage-item'>
                <div class='massage-title'>
                  <div class='author'> chat </div>
                  <div class='date'> 10.02.2021</div>
                </div>
                <div class='massage-text'> Добрый вечер! отправть сообщение для всех)</div>
              </div>
              </div>            
            
          </div>
          <div class='input'>
              <input class='input__massage' type='text' placeholder='Введите ваше сообщение' / >
            </div>
        </div>
      </div>
    </div>`;
  }

  static get widgetSelector() {
    return '.chat';
  }
  static get massageRowSelector() {
    return '.chat-body__row';
  }
  static get userRowSelector() {
    return '.user__row';
  }
  static get userSelector() {
    return '.user-item';
  }
  static get massageSelector() {
    return '.massage';
  }

  bindToDOM() {
    this.parentEl.innerHTML = this.constructor.markup;
    this.widget = this.parentEl.querySelector(this.constructor.widgetSelector);
    this.widget.addEventListener('click', (evt) => this.onClick(evt));
    this.widget
      .querySelector('.input__massage')
      .addEventListener('keyup', (evt) => this.sendMessage(evt));
  }

  onClick(e) {
    /// login btn
    if (e.target.closest('.login-btn')) {
      this.loginBtn(e);
    }
  }
  sendMessage(e) {
    const inputMessege = this.parentEl.querySelector('.input__massage');
    if (e.code === 'Enter') {
      this.ws.send(JSON.stringify({ textMassage: inputMessege.value, method: 'message' }));
      inputMessege.value = '';
    }
  }
  loginBtn(e) {
    const input = e.target.closest('.login').querySelector('.login-input');
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ login: input.value, method: 'register' }));
    } else {
      // Reconnect
      this.ws = new WebSocket(`ws://${this.url}:${this.port}/ws`);
    }
  }
  wsMessage(evt) {
    const rowUser = this.parentEl.querySelector(this.constructor.userRowSelector);
    const data = JSON.parse(evt.data);
    if (data.method === 'register' && data.status === 'ok') {
      this.parentEl.querySelector('.login').classList.remove('login__activ');
    } else if (data.method === 'register' && data.status === 'no') {
      alert('Логин уже занят');
    }
    if (data.method === 'message') {
      this.addMassage(data);
    }
    if (data.method === 'update') {
      const { arrUser, userAutor } = data;
      rowUser.innerHTML = '';
      arrUser.forEach((user) => {
        if (user === userAutor) {
          user = 'You';
        }
        this.addAuthor(user);
      });
    }
  }
  addAuthor(user) {
    const author = document.createElement('div');
    author.className = 'user-item';
    if (user === 'You') {
      user = 'You';
      author.classList.add('red');
    }
    author.innerText = user;
    this.parentEl.querySelector(this.constructor.userRowSelector).append(author);
  }
  dellAuthor(data) {
    const { id } = data;
    [...this.parentEl.querySelector(this.constructor.userRowSelector)].forEach((element) => {
      if (element.dataset.id === id) {
        element.remove();
      }
    });
  }

  addMassage(data) {
    const { id, date, textMassage } = data;
    let { author } = data;
    const massage = document.createElement('div');
    if (data.userAutor === 'true') {
      author = 'You';
    }
    massage.className = 'massage';
    massage.dataset.id = id;
    massage.innerHTML = `
         <div class='massage-item'>
                <div class='massage-title'>
                  <div class='author'>${author}</div>
                  <div class='date'> ${date}</div>
                </div>
                <div class='massage-text'>${textMassage}</div>
              </div>
            `;
    if (data.userAutor === 'true') {
      massage.classList.add('you');
      massage.querySelector('.massage-title').classList.add('red');
    }
    this.parentEl.querySelector(this.constructor.massageRowSelector).append(massage);
  }
}

// (async () => {
//   const input = e.target.closest('.login').querySelector('.login-input');
//   console.log(input.value);
//   const response = await fetch(`${this.url}:${this.port}/login/`, {
//     body: JSON.stringify({ login: `${input.value}` }),
//     method: 'POST',
//   });
//   const status = await response.status;
//   if (status === 204) {
//     this.parentEl.querySelector('.login').classList.remove('login__activ');
//     console.log('ok');
//   } else if (status === 205) {
//     alert('Логин уже занят');
//   }
// })();

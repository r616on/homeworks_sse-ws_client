export default class Сhat {
  constructor(parentEl) {
    this.parentEl = parentEl;
    // this.url = 'localhost';
    this.url = 'ahj-homeworks-sse.herokuapp.com/';
    this.port = 7070;
    this.name = '';

    this.onClick.bind(this);
    this.loginBtn.bind(this);
    this.wsMessage.bind(this);
    this.connect.bind(this);
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

  connect() {
    /// if localhost
    /// this.ws = new WebSocket(`ws://${this.url}:${this.port}/ws`);
    this.ws = new WebSocket(`wss://${this.url}:${this.port}/ws`);

    this.ws.addEventListener('open', () => {
      console.log('open');
    });

    this.ws.addEventListener('message', (evt) => {
      // handle evt.data
      this.wsMessage(evt);
    });
    this.ws.addEventListener('close', () => {
      const rowUser = this.parentEl.querySelector(this.constructor.userRowSelector);
      rowUser.innerHTML = '';
      this.parentEl.querySelector('.login').classList.add('login__activ');
      this.parentEl.querySelector('.chat-body__row').innerHTML = '';
      console.log('close');

      // After this we can't send messages
    });
    this.ws.addEventListener('error', () => {
      console.log('error');
    });
  }

  bindToDOM() {
    this.parentEl.innerHTML = this.constructor.markup;
    this.widget = this.parentEl.querySelector(this.constructor.widgetSelector);
    this.connect();
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
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ textMassage: inputMessege.value, method: 'message' }));
        inputMessege.value = '';
      } else {
        this.connect();
      }
    }
  }

  loginBtn(e) {
    const input = e.target.closest('.login').querySelector('.login-input');
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ login: input.value, method: 'register' }));
      input.value = '';
    } else {
      // Reconnect
      this.connect();
    }
  }

  wsMessage(evt) {
    const rowUser = this.parentEl.querySelector(this.constructor.userRowSelector);
    const data = JSON.parse(evt.data);
    if (data.method === 'register' && data.status === 'ok') {
      this.parentEl.querySelector('.login').classList.remove('login__activ');
      this.name = data.name;
    } else if (data.method === 'register' && data.status === 'no') {
      alert('Логин уже занят');
    }
    if (data.method === 'message') {
      this.addMassage(data);
    }
    if (data.method === 'update') {
      rowUser.innerHTML = '';
      data.arrUser.forEach((user) => {
        if (user === this.name) {
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

  addMassage(data) {
    const { id, date, textMassage } = data;
    let { author } = data;
    const massage = document.createElement('div');
    if (author === this.name) {
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
    if (author === 'You') {
      massage.classList.add('you');
      massage.querySelector('.massage-title').classList.add('red');
    }
    this.parentEl.querySelector(this.constructor.massageRowSelector).append(massage);
  }
}

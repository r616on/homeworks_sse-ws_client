export default class wsAPI {
  constructor(url) {
    this.url = url;
    const ws = new WebSocket('ws://localhost:7070/ws');
    ws.binaryType = 'blob'; // arraybuffer
    ws.addEventListener('open', () => {
      console.log('connected');
      // After this we can send messages
      ws.send('hello!');
    });
    ws.addEventListener('message', (evt) => {
      // handle evt.data
      console.log(evt);
    });
    ws.addEventListener('close', (evt) => {
      console.log('connection closed', evt);
      // After this we can't send messages
    });
    ws.addEventListener('error', () => {
      console.log('error');
    });
  }
}

c;

if (ws.readyState === WebSocket.OPEN) {
  ws.send();
} else {
  // Reconnect
}

class Chat {
  constructor(element) {
    this.element = typeof element === 'string' ? document.querySelector(element) : element;

    this.messageInput = this.element.querySelector('.chat__message');
    this.messageForm = this.element.querySelector('.chat__form');
    this.chat = this.element.querySelector('.chat__messages');

    this.onSendMessage = this.onSendMessage.bind(this);
    this.onMessage = this.onMessage.bind(this);

    this.messageForm.addEventListener('submit', this.onSendMessage);

    const ws = new WebSocket('ws://localhost:7070/ws');

    ws.addEventListener('message', this.onMessage);
    ws.addEventListener('open', (event) => {
      console.log('open');

      console.log(event);
    });
    ws.addEventListener('close', (event) => {
      console.log('close');

      console.log(event);
    });
    ws.addEventListener('error', (event) => {
      console.log('error');

      console.log(event);
    });

    this.ws = ws;
  }

  onSendMessage(e) {
    e.preventDefault();

    if (this.ws.readyState !== WebSocket.OPEN) {
      return;
    }

    const message = this.messageInput.value;

    this.ws.send(message);
  }

  onMessage(e) {
    console.log(e);

    const m = JSON.parse(e.data);

    const { chat, message } = m;

    if (chat) {
      this.chat.textContent = chat.join('\n');
    }

    if (message) {
      this.chat.textContent += '\n' + message;
    }
  }
}

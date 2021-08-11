import Сhat from './Сhat/Сhat';

document.addEventListener('DOMContentLoaded', () => {
  const perent = document.querySelector('.container');
  const widget = new Сhat(perent);
  widget.bindToDOM();
  //widget.allTicketsReq();
});
async () => {
  const response = await fetch('http://localhost:7070/cont/', {
    body: JSON.stringify({ method: 'ok' }),
    method: 'POST',
  });
  if (response.ok) {
    // console.log(response);
    const data = await response.json();
    console.log(data);
  }

  const ws = new WebSocket('ws://localhost:7070/ws');
  // ws.binaryType = 'blob'; // arraybuffer

  ws.addEventListener('open', (evt) => {
    console.log('open');

    // After this we can send messages
    ws.send(JSON.stringify('hello!'));
  });
  ws.addEventListener('message', (evt) => {
    // handle evt.data
    console.log('message');
    console.log(JSON.parse(evt.data));
  });
  ws.addEventListener('close', (evt) => {
    console.log('close');

    // After this we can't send messages
  });
  ws.addEventListener('error', () => {
    console.log(evt);
    console.log('error');
  });

  ///
};

// const xhr = new XMLHttpRequest();
//     xhr.open('GET', "http://localhost:7070/");
//     xhr.send();

//   /* eslint-disable consistent-return */
//   xhr.addEventListener('load', () => {
//     if (xhr.status >= 200 && xhr.status < 300) {
//       try {
//         const data = JSON.parse(xhr.responseText);
//         call(data);
//       } catch (e) {
//         return console.error(e);
//       }
//     }
//   });

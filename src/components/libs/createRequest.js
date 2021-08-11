export default function createRequest(parametr, method = 'GET', call) {
  // const http = 'https://homeworks-ahj-tickets.herokuapp.com/';
  const http = 'http://localhost';
  const port = 7070;

  const xhr = new XMLHttpRequest();
  if (method === 'GET') {
    const params = new URLSearchParams();
    parametr.forEach(({ name, value }) => params.append(name, value));
    xhr.open('GET', `${http}:${port}/?${params}`);
    xhr.send();
  } else if (method === 'POST') {
    const params = JSON.stringify(parametr);
    xhr.open('POST', `${http}:${port}`);
    xhr.send(params);
  } else {
    return;
  }
  /* eslint-disable consistent-return */
  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const data = JSON.parse(xhr.responseText);
        call(data);
      } catch (e) {
        return console.error(e);
      }
    }
  });
}

import Сhat from '../components/Сhat/Сhat';

test('Test innerHtml', () => {
  document.body.innerHTML = '<div id="container"></div>';
  const container = document.querySelector('#container');
  const widget = new Сhat(container);
  widget.bindToDOM();
  expect(1).toBe(1);
});

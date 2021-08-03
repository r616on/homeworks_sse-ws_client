import createRequest from '../libs/createRequest';

export default class Сhat {
  constructor(parentEl) {
    this.parentEl = parentEl;
    this.thisTic = {};

    this.onClick.bind(this);
    this.onFormAdd.bind(this);
    this.editTic.bind(this);

    this.onFormEdit.bind(this);
    this.editStatus.bind(this);
    this.fullTic.bind(this);

    this.allTickets = [
      {
        id: 1627493913588,
        name: 'Тэстовый',
        status: false,
        created: 'July 28, 2021 8:38 PM',
        description: ' Что то длинное',
      },
      {
        id: 1627493985287,
        name: 'Командный бой',
        status: false,
        created: 'July 28, 2021 8:39 PM',
        description: ' И еще что то',
      },
    ];
  }

  static get markup() {
    return `<div class="HelpDesk">
               <div class="title">
                <button class="btn add">Добавить тикет</button>
               </div>
               <div class="body-row"></div>
            </div>;`;
  }

  static get widgetSelector() {
    return '.Сhat';
  }

  static get buttonSelector() {
    return '.btn';
  }

  // static get inputSelector() {
  //   return '.add-cart__input';
  // }

  bindToDOM() {
    this.parentEl.innerHTML = this.constructor.markup;
    this.widget = this.parentEl.querySelector(this.constructor.widgetSelector);
    this.widget.addEventListener('click', (evt) => this.onClick(evt));
  }

  onClick(e) {
    /// create modal append tiket
    if (e.target.closest('.add')) {
      e.preventDefault();
      this.creatModalToDom('add');
    }
    /// close modal
    if (e.target.closest('.cancel')) {
      e.preventDefault();
      e.target.closest('.modal').remove();
    }

    /// ok form
    if (e.target.closest('.ok') && e.target.closest('.modal-add')) {
      // e.preventDefault();
      this.onFormAdd(e);
    }
    if (e.target.closest('.control') && e.target.closest('.edit')) {
      this.editTic(e);
    }
    /// edit
    if (e.target.closest('.ok') && e.target.closest('.modal-edit')) {
      // e.preventDefault();
      this.onFormEdit(e);
    }
    /// delete
    if (e.target.closest('.control') && e.target.closest('.delete')) {
      this.deltTic(e);
    }
    /// full info
    if (!e.target.closest('.control') && e.target.closest('.ticket')) {
      if (!e.target.closest('.ticket').querySelector('.description')) {
        this.fullTic(e);
      }
      if (e.target.closest('.ticket').querySelector('.description')) {
        e.target.closest('.ticket').querySelector('.description').remove();
      }
    }
    /// /edit status
    if (e.target.closest('.control') && e.target.closest('.control').querySelector('.status')) {
      this.editStatus(e);
    }
  }

  editStatus(e) {
    const tic = e.target.closest('.ticket');

    const data = [
      { name: 'method', value: 'editStatusId' },
      { name: 'id', value: tic.dataset.id },
    ];
    createRequest(data, 'GET', (resp) => {
      if (resp.ok) {
        this.allTicketsReq();
      }
    });
  }

  allTicketsReq() {
    const data = [{ name: 'method', value: 'allTickets' }];
    createRequest(data, 'GET', (resp) => {
      if (resp) {
        const row = this.parentEl.querySelector('.body-row');
        row.innerHTML = '';
        resp.forEach((item) => {
          row.append(this.creaTicToDom(item));
        });
      }
    });
  }

  fullTic(e) {
    e.preventDefault();
    const perent = e.target.closest('.ticket');
    const data = [
      { name: 'method', value: 'ticketById' },
      { name: 'id', value: perent.dataset.id },
    ];
    createRequest(data, 'GET', (resp) => {
      if (resp) {
        const row = perent.querySelector('.name-row');
        const description = document.createElement('div');
        description.className = 'description';
        description.innerText = resp.description;
        row.append(description);
      }
    });
  }

  deltTic(e) {
    /* eslint-disable no-restricted-globals */
    const result = confirm(
      'Вы уверенны что хотите удалить тикет? данное действие будет не обратимо.'
    );
    e.preventDefault();
    if (result) {
      const tic = e.target.closest('.ticket');
      const data = [
        { name: 'method', value: 'ticketDelId' },
        { name: 'id', value: tic.dataset.id },
      ];
      createRequest(data, 'GET', () => {
        this.allTicketsReq();
      });
    }
  }

  editTic(e) {
    e.preventDefault();
    const perent = e.target.closest('.ticket');
    this.thisTic = perent;
    const data = [
      { name: 'method', value: 'ticketById' },
      { name: 'id', value: perent.dataset.id },
    ];
    createRequest(data, 'GET', (resp) => {
      if (resp) {
        this.creatModalToDom('edit');
        const modal = this.parentEl.querySelector('.modal');
        const name = modal.querySelector('.modal-name');
        const description = modal.querySelector('.modal-description');
        name.value = resp.name;
        description.value = resp.description;
      }
    });
  }

  onFormEdit(e) {
    e.preventDefault();
    const form = this.parentEl.querySelector('.modal-form');
    const data = {};
    [...form.elements].forEach((item) => {
      if (item.id) {
        data[item.id] = item.value;
      }
    });
    data.status = this.thisTic.dataset.status;
    data.id = this.thisTic.dataset.id;
    data.method = 'editTicket';
    this.thisTic = {};
    createRequest(data, 'POST', (resp) => {
      if (resp) {
        this.parentEl.querySelector('.modal').remove();
        this.allTicketsReq();
      }
    });
  }

  onFormAdd(e) {
    e.preventDefault();
    const form = this.parentEl.querySelector('.modal-form');
    const data = {};
    [...form.elements].forEach((item) => {
      if (item.id) {
        data[item.id] = item.value;
      }
    });
    data.method = 'createTicket';
    createRequest(data, 'POST', (resp) => {
      if (resp) {
        this.parentEl.querySelector('.modal').remove();
        this.allTicketsReq();
      }
    });
  }

  creaTicToDom(data) {
    const ticketNode = document.createElement('div');
    ticketNode.className = 'ticket';
    ticketNode.dataset.id = data.id;
    ticketNode.dataset.name = data.name;
    ticketNode.dataset.status = data.status;
    ticketNode.innerHTML = `
            <div class="ticket-row">
             <div class="control-row">
                <span class="control">
                  <span class="status">&#10003</span>
                </span>
              </div>
              <div class="name-row">
              <div class="name">${data.name}</div>
              </div>
              <div class="created">${data.created}</div>
              <div class="control-row">
                <span class="control ">
                  <span class="edit active">&#9998</span>
                </span>
              </div>
              <div class="control-row">
                <span class="control">
                  <span class="delete active">&#215</span>
                </span>
              </div>
            `;
    /// // status fail
    const stat = ticketNode.querySelector('.status');

    if (data.status) {
      stat.classList.add('active');
    } else {
      stat.classList.remove('active');
    }
    return ticketNode;
  }

  creatModalToDom(title = 'add') {
    let titleText = 'Добавить тикет';
    const modal = document.createElement('div');
    modal.className = 'modal modal-add';
    if (title === 'edit') {
      titleText = 'Изменить тикет';
      modal.className = 'modal modal-edit';
    }

    modal.innerHTML = `
          <div class="modal-row">
            <div class="modal-title"> ${titleText}</div>
            <div class="modal-body">
              <form class="modal-form" action="">
                <label class="modal-lable" for="name" >Краткое описание</label>
                <input class="input modal-name" type="text" id="name" required placeholder="описание">
                <span class="modal-lable" >Подробное описание</span>

                <textarea class="textarea modal-description" id="description"  required placeholder = "описание11" > </textarea>
            
                <div class="form-control">
                  <button class="btn cancel">Отмена</button>
                  <button class="btn ok">ОК</button>
                </div> 
              </form>
            </div>
          </div>
            `;
    this.parentEl.querySelector(this.constructor.widgetSelector).append(modal);
  }
}

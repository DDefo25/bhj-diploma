/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if ( !element ) {
      throw new Error('Передан пустой элемент');
    }
    this.element = element;

    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render( this.lastOptions );
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    this.element.querySelector('.remove-account').addEventListener('click', () => {
      this.removeAccount();
    })
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    const id = this.lastOptions.account_id;
    if ( id ) {
      const removeConfim = confirm('Вы действительно хотите удалить счёт?');
      if (removeConfim) {
        Account.remove( {id}, (err, response) => {
          if ( !err && response.success ) {
            App.getWidget('accounts').update();
            App.updateForms();
          } else if ( response.success ) {
            alert(response.error);
          }
        })
        this.clear();
      }
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction( id ) {
    const removeConfim = confirm('Вы действительно хотите удалить эту транзакцию?');
    if (removeConfim) {
      Transaction.remove( {id}, (err, response) => {
        if ( !err && response.success ) {
          this.update();
          App.getWidget("accounts").update();
        }
      })
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    if ( options ) {
      this.lastOptions = options;

      Account.get( options['account_id'], (err, response) => {
        if ( !err && response.success ) {
          this.renderTitle( response.data.name );
        } else if ( !response.success ) {
          console.log(options['account_id'], response)
          alert(response.error);
        }
      })

      Transaction.list( options, (err, response) => {
        if ( !err, response ) {
          this.renderTransactions( response.data );
        } else if ( !response.success ) {
          console.log(options, response)
          alert(response.error);
        }
      })
    }
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счёта');
    this.lastOptions = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    this.element.querySelector('.content-title').textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    const _date = new Date(date);
    const monthsName = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    const day = _date.getDate() >= 10 ? _date.getDate() : `0${_date.getDate()}`;
    const hours = _date.getHours() >= 10 ? _date.getHours() : `0${_date.getHours()}`;
    const minutes = _date.getMinutes() >= 10 ? _date.getMinutes() : `0${_date.getMinutes()}`;
    return (`${day} ${monthsName[ _date.getMonth() ]} ${_date.getFullYear()} г. в ${hours}:${minutes}`);
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    const {
        created_at,
        id,
        name,
        sum,
        type,
    } = item;

    const transaction = createElement({tag: 'div', _class: `transaction transaction_${type} row`});

    const transDetails = createElement({
      tag: 'div', 
      _class: `col-md-7 transaction__details`,
      innerHTML: `
        <div class="transaction__icon">
            <span class="fa fa-money fa-2x"></span>
        </div>
        <div class="transaction__info">
            <h4 class="transaction__title">${name}</h4>
            <div class="transaction__date">${this.formatDate( created_at )}</div>
        </div>
      `,
    });

    const transSum = createElement({
      tag: 'div', 
      _class: `col-md-3`, 
      innerHTML: `
        <div class='transaction__summ'>${sum}<span class='currency'>₽</span>
        </div>
      `,
    });

    const transControls = createElement({
      tag: 'div', 
      _class: `col-md-2 transaction__controls`,
    });

    const transRemoveBtn = createElement({
      tag: 'button', 
      _class: `btn btn-danger transaction__remove`,
      innerHTML: `
        <i class='fa fa-trash'></i>  
      `,
      data: {id: id},
    })

    transRemoveBtn.onclick = () => this.removeTransaction( id );

    transControls.append(transRemoveBtn);
    transaction.append(transDetails, transSum, transControls);

    return transaction;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    const content = this.element.querySelector('.content');
    content.innerHTML = '';

    data.forEach(transaction => {
      content.append( this.getTransactionHTML(transaction) );
    })
  }
}
/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element)

    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    const currentUser = User.current();
    if (currentUser) {
      Account.list(currentUser, (err, response) => {
        if ( !err && response.success ) {
          const accountsSelectEl = this.element.querySelector('.accounts-select');
          accountsSelectEl.innerHTML = '';
          response.data.forEach(item => {
            const account = document.createElement('option');
            account.value = item.id;
            account.textContent = item.name;
            accountsSelectEl.append(account);
          })
        } else if ( !response.success ) {
          console.log(currentUser, response)
          alert(response.error);
        }
      })
    }
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    const modalName = data.type === 'expense' ? 'newExpense' : data.type === 'income' ? 'newIncome' : null;

    if (!modalName) {
      throw new Error('Тип транзакции не определен');
    }

    Transaction.create(data, (err, response) => {
      if (!err, response.success) {
        App.update();
        this.clear();
        App.getModal( modalName ).close();
      } else if ( !response.success ) {
        App.getModal( modalName ).throwError( response.error );
      }
    })
  }
}
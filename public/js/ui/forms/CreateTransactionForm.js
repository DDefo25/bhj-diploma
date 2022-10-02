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
    Account.list(currentUser, (err, response) => {
      if ( !err && response.success ) {
        const accountsSelectEl = this.element.querySelector('.accounts-select');
        response.data.forEach(item => {
          const account = document.createElement('option');
          account.value = item.id;
          account.textContent = item.name;
          accountsSelectEl.append(account);
        })
      } else if ( !response.success ) {
        alert(response.error);
      }
    })
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {
      if (!err, response.success) {
        this.clear();
        App.getModal('newIncome').close();
        App.getModal('newExpense').close();
        App.update();
      } else if ( !response.success ) {
        alert(response.error);
      }
    })
  }
}
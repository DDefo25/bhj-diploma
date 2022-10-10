/**
 * Класс CreateAccountForm управляет формой
 * создания нового счёта
 * */
class CreateAccountForm extends AsyncForm {
  /**
   * Создаёт счёт с помощью Account.create и закрывает
   * окно в случае успеха, а также вызывает App.update()
   * и сбрасывает форму
   * */
  onSubmit(data) {
    Account.create(data, (err, response) => {
      if (!err && response.success) {
        this.clear();
        App.getModal('createAccount').close();
        App.update();
      } else if (!response.success) {
        App.getModal( 'createAccount' ).throwError( response.error );
      }
    })
  }
}
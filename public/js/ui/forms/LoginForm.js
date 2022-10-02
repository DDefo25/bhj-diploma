/**
 * Класс LoginForm управляет формой
 * входа в портал
 * */
class LoginForm extends AsyncForm {
  /**
   * Производит авторизацию с помощью User.login
   * После успешной авторизации, сбрасывает форму,
   * устанавливает состояние App.setState( 'user-logged' ) и
   * закрывает окно, в котором находится форма
   * */
  onSubmit(data) {
    User.login(data, (err, response) => {
      if(!err && response.success) {
        this.clear();
        App.getModal( 'login' ).close()
        App.setState( 'user-logged' );
      } else if (!response.success) {
        alert(response.error);
      }
    })
  }
}
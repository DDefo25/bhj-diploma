/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    const btn = document.querySelector('.sidebar-toggle');
    const sidebarMiniEl = btn.closest('.sidebar-mini');
    btn.addEventListener('click', () => {
      sidebarMiniEl.classList.toggle('sidebar-open');
      sidebarMiniEl.classList.toggle('sidebar-collapse');
    })
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    const btnEls = document.querySelectorAll('.menu-item');
    btnEls.forEach(el => {
      el.addEventListener('click', ev => {
        switch (el.className.match(/(?:.+menu-item_)|\w+/g)[1]) {
          case 'register': 
            App.getModal( 'register' ).open();
            break;
          case 'login':
            App.getModal( 'login' ).open();
            break;
          case 'logout':
            User.logout((err, response) => {
              if (!err && response.success) {
                App.setState( 'init' );
              }
            })
            break;
        }
        


        ev.preventDefault();
      })
    })
  }
}
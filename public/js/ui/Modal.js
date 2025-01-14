/**
 * Класс Modal отвечает за
 * управление всплывающими окнами.
 * В первую очередь это открытие или
 * закрытие имеющихся окон
 * */
class Modal {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью Modal.registerEvents()
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element){
    if ( !element ) {
      throw new Error(`Передан пустой элемент`);
    }
    this.element = element;

    this.registerEvents();
  }

  /**
   * При нажатии на элемент с data-dismiss="modal"
   * должен закрыть текущее окно
   * (с помощью метода Modal.onClose)
   * */
  registerEvents() {
    const btnEls = this.element.querySelectorAll(`[data-dismiss='modal']`);
    btnEls.forEach(el => {
      el.onclick = ev => {
        this.onClose();
        ev.preventDefault();
      }
    });
  }

  /**
   * Срабатывает после нажатия на элементы, закрывающие окно.
   * Закрывает текущее окно (Modal.close())
   * */
  onClose() {
    this.close();

    this.clearError();
  }
  /**
   * Открывает окно: устанавливает CSS-свойство display
   * со значением «block»
   * */
  open() {
    this.element.style.display = 'block';
  }
  /**
   * Закрывает окно: удаляет CSS-свойство display
   * */
  close(){
    this.element.style.display = '';
  }

  throwError( error ) {
    this.clearError();

    const errorEl = createElement({
      tag: 'div',
      _class: 'error__title',
      innerHTML: `<span>${error}</span>`,
    })

    this.element.querySelector('.modal-body').append(errorEl);
  }

  clearError() {
    const errorEl = this.element.querySelector('.error__title');
    
    if (errorEl) {
      errorEl.remove();
    }
  }

}
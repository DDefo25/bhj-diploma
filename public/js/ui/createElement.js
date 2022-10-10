function createElement(options) {
    const {tag, _class, textContent, innerHTML, data} = options;
    const element = document.createElement(tag);
    element.classList = _class;

    if (innerHTML) {
        element.innerHTML = innerHTML;
    } else if (textContent) {
        element.textContent = textContent;
    }

    if (data) {
        for ( let item in data ) {
            element.dataset[item] = data[item];
        }
    }

    return element;
}
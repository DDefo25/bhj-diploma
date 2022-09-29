/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    let { 
        method, 
        url, 
        responseType = 'json', 
        callback,
        data,
    } = options;    
    const xhr = new XMLHttpRequest();
    xhr.responseType = responseType;
    
    xhr.onload = () => {
        if (xhr.statusText = 'OK') {
            callback(null, xhr.response);
        } else {
            callback(new Error(`Не удалось получить ответ от ${url}`))
        }
    }

    xhr.onerror = () => {
        callback(new Error(`Не удалось отправить запрос по ${url}`))
    }

    switch (method) {
        case 'GET':
            let urlAdd = url + '?';
            for( const key in data ) {
                urlAdd += `${key}=${data[key]}&`
            }
            xhr.open( method, data ? urlAdd : url);
            xhr.send();
            break;
        default:
            xhr.open(method, url)
            formData = new FormData;
            for( const key in data ) {
                formData.append( key, data[key] )
            }
            xhr.send( formData );
    }
};

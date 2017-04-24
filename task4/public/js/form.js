(function () {
    const form = $('.filter__form');

    function sendAjaxJson(url, data, cb) {
        let xhr = new XMLHttpRequest();

        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function (e) {
            let result = JSON.parse(xhr.responseText);
            cb(result.data);
        };
        xhr.send(JSON.stringify(data));
    }

    function prepareData(e) {
        e.preventDefault();
        let data = {};

        $('.news').html('Загрузка...');

        form.serializeArray().forEach(function (item) {
            data[item.name] = item.value;
        });

        sendAjaxJson('/load', data, function (data) {
            if (typeof data === 'string') {
                $('.news').html(data);
            } else {
                let template = Handlebars.compile($('#news-template').html());

                $('.news').html(template({ news: data.data }));
            }
        });
    }

    $(function () {
        form.on('submit', prepareData);
    });
})();
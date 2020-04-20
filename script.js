//DOM объекты 
const formSearch = document.querySelector(".form-search"),
    inputCitiesFrom = formSearch.querySelector(".input__cities-from"),
    dropdownCitiesFrom = formSearch.querySelector(".dropdown__cities-from"),
    inputCitiesTo = formSearch.querySelector(".input__cities-to"),
    dropdownCitiesTo = formSearch.querySelector(".dropdown__cities-to"),
    inputDateDepart = formSearch.querySelector(".input__date-depart"),
    cheapestTicket = document.getElementById('cheapest-ticket'),
    otherCheapTickets = document.getElementById('other-cheap-tickets');
//ссылки на даты
const cityesApi = 'Data/cities.json',
    proxy = ' https://cors-anywhere.herokuapp.com/',
    APY_KEY = 'be89f1280b6177f28fd06effe1a6dddb',
    colendar = 'http://min-prices.aviasales.ru/calendar_preload',
    kartaCen = 'Data/supported_directions.json',
    max = 10;
let city = [];
let dt;
//функция получения данных
const getData = (url, callback, erors) => {

    const request = new XMLHttpRequest();
    request.open('GET', url);

    request.addEventListener('readystatechange', () => {
        if (request.readyState !== 4) return;
        if (request.status === 200) {
            callback(request.response);
        } else {
            erors(request.status);
        }

    });
    request.send();

}
//функция для живого поиска
const showCity = (input, list) => {
    list.textContent = "";
    if (input.value === "") return;

    const filterCity = city.filter((item) => {

        const fixItem = item.toLocaleLowerCase();

        return fixItem.startsWith(input.value.toLocaleLowerCase());
    });
    filterCity.forEach((item) => {

        const li = document.createElement('li');
        li.classList.add('dropdown__city');
        li.textContent = item;
        list.append(li);
    });
}


//функция для выбора из списка
const togle = (input, list) => {

    input.value = event.target.innerHTML;
    list.textContent = '';
}

getData(cityesApi, (data) => {
    dt = JSON.parse(data);

    dt.forEach((item) => {
        if (item.name != null) {
            city.push(item.name, item.name_translations.en);
        }

    });

    city = city.sort((a, b) => {
        if (a > b) return 1;
        if (a == b) return 0;
        if (a < b) return -1;
    });

});
createeror = (strings) => {

    const ticket = document.createElement('article');
    ticket.classList.add('ticket');
    deep = strings;
    ticket.insertAdjacentHTML('afterbegin', deep);
    console.log(ticket);
    return ticket;
}
const renderCheap = (data, date) => {
    const cheapTicketYear = JSON.parse(data).best_prices;
    const cheapTicketDay = cheapTicketYear.filter((item) => {
        return item.depart_date === date;
    });
    renderCheapDay(cheapTicketDay);
    renderCheapYear(cheapTicketYear);
}
const getNameCity = (code) => {
    const objCity = dt.find((item) => item.code === code);
    return objCity.name;
}
const getDatе = (date) => {
    return new Date(date).toLocaleString('ru', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}
const getChanges = (num) => {
    if (num) {
        return num === 1 ? 'С 1 пересадкой' : 'С 2 пересадками';
    } else {
        return 'Без пересадок';
    }
}
const GetLinkAv = (data) => {
    let link = 'https://www.aviasales.ru/search/';
    console.log(data);
    const dat = new Date(data.depart_date);
    link += data.origin;
    const day = dat.getDate();
    link += day < 10 ? '0' + day : day;
    const month = dat.getMonth();
    link += month < 10 ? '0' + month : month;
    link += data.destination;
    link += '1';
    return link;
}
const createCard = (data) => {
    const ticket = document.createElement('article');
    ticket.classList.add('ticket');

    let deep = '';
    if (data) {

        deep = `
            <h3 class="agent">${data.gate}</h3>
    <div class="ticket__wrapper">
        <div class="left-side">
        
            <a href='${GetLinkAv(data)}'  class="button button__buy">Купить
                за ${data.value}₽</a>
    
        </div>
        <div class="right-side">
            <div class="block-left">
                <div class="city__from">Вылет из города
                    <span class="city__name">${getNameCity(data.origin)}</span>
                </div>
                <div class="date">${getDatе(data.depart_date)}</div>
            </div>
    
            <div class="block-right">
                <div class="changes">${getChanges(data.number_of_changes)}</div>
                <div class="city__to">Город назначения:
                    <span class="city__name">${getNameCity(data.destination)}</span>
                </div>
            </div>
        </div>
    </div>
            `;
    } else {
        deep = '<h3>Билетов на эту дату нет</h3>';
    }

    ticket.insertAdjacentHTML('afterbegin', deep);

    return ticket;
}

const renderCheapDay = (ticket) => {
    cheapestTicket.innerHTML = '<h2>Самый дешевый билет на выбранную дату</h2>';
    cheapestTicket.style.display = 'block';
    console.log(ticket[0]);
    const tic = createCard(ticket[0]);
    cheapestTicket.append(tic);

}
const renderCheapYear = (tickets) => {
    otherCheapTickets.innerHTML = '<h2>Самые дешевые билеты на другие даты</h2>';
    otherCheapTickets.style.display = 'block';
    tickets.sort((a, b) => a.value - b.value);
    for (let i = 0; i < tickets.length && i < max; i++) {
        const tic = createCard(tickets[i]);
        otherCheapTickets.append(tic);
    }
}
//Ivents - ивенты
inputCitiesFrom.addEventListener('input', () => {
    showCity(inputCitiesFrom, dropdownCitiesFrom);
});

dropdownCitiesFrom.addEventListener('click', () => {
    togle(inputCitiesFrom, dropdownCitiesFrom);

});

inputCitiesTo.addEventListener('input', () => {
    showCity(inputCitiesTo, dropdownCitiesTo);
});

dropdownCitiesTo.addEventListener('click', () => {
    togle(inputCitiesTo, dropdownCitiesTo);
});
formSearch.addEventListener('submit', (event) => {
    event.preventDefault();
    const fromName = dt.find((item) => {
        return inputCitiesFrom.value === item.name || inputCitiesFrom.value === item.name_translations.en;
    });
    const toName = dt.find((item) => {
        return inputCitiesTo.value === item.name || inputCitiesTo.value === item.name_translations.en;
    });

    let formData = {
        from: fromName,
        to: toName,
        when: inputDateDepart.value,
    }
    if (formData.from === undefined || formData.to === undefined) {
        console.log('er')
        const tik = createeror('<h3>Введите корректно название города</h3>');
        otherCheapTickets.innerHTML = '';
        otherCheapTickets.append(tik);

        otherCheapTickets.style.display = 'block';
    } else {
        const requestData = `?depart_date=${formData.when}&origin=${formData.from.code}&destination=${formData.to.code}&one_way=true&token=${APY_KEY}`;
        getData(colendar + requestData, (response) => {
            renderCheap(response, formData.when);
        }, () => {

            const tik = createeror('<h3>Такого направления нету</h3>');
            otherCheapTickets.innerHTML = '';
            otherCheapTickets.append(tik);

            otherCheapTickets.style.display = 'block';
        });

    }

});
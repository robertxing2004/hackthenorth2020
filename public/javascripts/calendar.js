function addOne(date) {
    let n = new Date(date);
    n.setDate(n.getDate() + 1);
    return n;
}

function loadCalendarAvailabilities(start, available, useravailable, num, eventId) {
    let day = new Date(start);
    let table = document.getElementById('calendar').getElementsByTagName('tbody')[0];
    let date = document.getElementById('date');
    let year = day.getFullYear();
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'june', 'july', 'sep', 'oct', 'nov', 'dec']
    date.innerHTML += months[day.getMonth()];
    let row = 0, col = day.getDay();
    for (let i = 0; i < 28; ++i) {
        if (col == 7) {col = 0; ++row;}
        let td = table.rows[row].cells[col];
        td.innerHTML = day.getDate();
        td.setAttribute('onclick', 'toggleAvailability("' + eventId + '",' + i +')');
        td.setAttribute('data-percentage', Math.round(available[i]*100/num));
        if (useravailable[i] > 0) td.classList.add('userselected');
        day = addOne(day);
        ++col;
    }
    date.innerHTML += '-' + months[day.getMonth()] + ', ' + year;
}
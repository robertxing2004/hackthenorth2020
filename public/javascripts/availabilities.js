function checkAvailability(availabilities) {
    available = [0, 0, 0, 0, 0, 0, 0];
    for (i of availabilities) {
        ++available[i.delta];
    }
    return available;
}

async function toggleAvailability(eventId, delta) {
    let res = await (await fetch(
        '/toggleavailability',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                eventid: eventId,
                delta: delta
            })
        }
    )).json();
    console.log(res.message);
    alert(res.message);
    location.reload();
}

async function getAvailabilities(eventId) {
    let res = await (await fetch(
        '/getavailabilities',
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                eventid: eventId
            })
        }
    )).json();
    console.log(res);
    return res;
}
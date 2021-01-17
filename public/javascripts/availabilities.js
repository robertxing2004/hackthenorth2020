function checkAvailability(availabilities) {
    available = [];
    for (let i = 0; i < 28; ++i) available.push(0);
    for (i of availabilities) {
        ++available[i.delta];
    }
    return available;
}

async function toggleAvailability(eventId, delta) {
    let res = await (await fetch(
        '/users/toggleavailability',
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
    location.reload();
    return res.message;
}

async function getAvailabilities(eventId) {
    let res = await (await fetch(
        '/users/getavailabilities',
        {
            method: 'POST',
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

function getUserAvailabilities(availabilities, userid) {
    let useravailable = [0, 0, 0, 0, 0, 0, 0];
    for (let a of availabilities) {
        if (a.userid == userid) useravailable[a.delta] = 1;
    }
    return useravailable;
}
async function createEvent(eventName, eventDescription, groupId, start) {
    let res = await (await fetch(
        '/users/createevent',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                eventname: eventName,
                description: eventDescription,
                groupid: groupId,
                start: start
            })
        }
    )).json();
    location.reload();
    return res.message;
}

async function getEvents(groupId) {
    let res = await (await fetch(
        '/users/getevents',
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                groupid: groupId
            })
        }
    )).json();
    console.log(res);
    return res;
}

async function deleteGroup(eventName) {
}//TODO


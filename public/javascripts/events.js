async function createEvent(eventName, eventDescription, groupId, start) {
    let res = await (await fetch(
        '/createevent',
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
    console.log(res.message);
    alert(res.message);
    location.reload();
}

async function getEvents(groupId) {
    let res = await (await fetch(
        '/getevents',
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


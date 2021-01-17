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
    alert(res.message); //how to make alert after page reload ??
    location.reload();
    return res.message;
}

async function getEvents(groupId) {
    let res = await (await fetch(
        '/users/getevents',
        {
            method: 'POST',
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


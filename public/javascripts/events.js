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

async function getEvents() {
}

async function deleteGroup(eventName) {
}//TODO


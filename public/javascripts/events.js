async function searchUsers(search) {
    let res = await (await fetch(
        '/users/searchusers',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                search: search
            })
        }
    )).json();
    return res;
}

async function addToGroup(userId, groupId, groupName) {
    let res = await (await fetch(
        '/users/addtogroup',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userid: userId,
                groupid: groupId,
                groupname: groupName
            })
        }
    )).json();
    return res.message;
}

async function getGroupUsers(groupId) {
    let res = await (await fetch(
        '/users/getgroupusers',
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
    return res;
}

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

async function deleteEvent(eventId) {
    let res = await (await fetch(
        '/users/deleteevent',
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
    location.reload();
    alert(res.message);
}


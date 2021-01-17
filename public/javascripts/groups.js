async function createGroup(groupName) {
    let res = await (await fetch(
        '/users/creategroup',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                groupname: groupName
            })
        }
    )).json();
    return res.message;
}

async function getGroups() {
    let res = await (await fetch(
        '/users/getgroups',
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )).json();
    return res;
}

async function getGroupUsers(groupId) {
    let res = await (await fetch(
        '/users/getgroupusers',
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
    return res;
}

async function deleteGroup(groupId) {
    let res = await (await fetch(
        '/users/deletegroup',
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
    location.reload();
    alert(res.message);
}
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
    console.log(res.message);
    alert(res.message);
    location.reload();
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
    console.log(res);
    return res;
}

async function deleteGroup(groupId) {

} //TODO

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
    console.log(res.message);
    alert(res.message);
    location.reload();
}
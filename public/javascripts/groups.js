async function createGroup(groupName) {
    let res = await (await fetch(
        '/creategroup',
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

} //TODO

async function deleteGroup(groupId) {

} //TODO

async function addToGroup(userId, groupId, groupName) {
    let res = await (await fetch(
        '/addtogroup',
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
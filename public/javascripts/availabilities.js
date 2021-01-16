function checkAvailability(availabilities) {
    available = [0, 0, 0, 0, 0, 0, 0];
    for (i of availabilities) {
        ++available[i.delta];
    }
    return available;
}


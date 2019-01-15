export function isArray(list) {
    return Array.isArray(list);
}

export function isEqualArray(before, after) {
    let length = before.length;
    if (length !== after.length) return false;
    for (let i = 0; i < length; i++) {
        if (before[i] !== after[i]) return false;
    }
    return true;
}

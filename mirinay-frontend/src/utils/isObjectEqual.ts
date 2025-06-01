export function isObjectEqual(obj1: string | object, obj2: string | object) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}

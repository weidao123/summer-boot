/**
 * 对象深度合并
 * @param obj1 原始对象
 * @param obj2 需要合并的对象
 */
export function deepMerge(obj1: object, obj2: object) {
    for (const k in obj1) {
        if (!isEmpty(obj2[k]) && typeof obj1[k] === 'object') {
            deepMerge(obj1[k], obj2[k]);
            continue;
        }

        if (!isEmpty(obj2[k])) {
            obj1[k] = obj2[k];
        }
    }
}

export function isEmpty(...args) {
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === null || arg === '' || arg === undefined) {
            return true;
        }
    }
    return false;
}

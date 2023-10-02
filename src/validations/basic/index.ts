export function isRequired(value: any | undefined | null) {
    if (value === 0)
        return true;
    return Boolean(value);
}

export function minLength(value: string | undefined, min: number) {
    if (value)
        return value.length > min;
    return false;
}
export function maxLength(value: string, max: number) {
    if (value)
        return value.length < max;
    return false;
}
export function matchPattern(value: string | undefined, regex: RegExp) {
    if (value)
        return regex.test(value)
    return false
}

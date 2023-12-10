import { matchPattern, minLength } from "@validations/basic";

export function validateEmailPattern(email: string | undefined) {
    return matchPattern(email, /[\w.%+-]+@([\w-]+\.)+[\w-]{2,3}/);
}
export function validatePasswordLength(password: string | undefined) {
    return minLength(password, 8)
}

export function validatePasswordPattern(password: string | undefined) {
    return matchPattern(password, /^(?=.*\d)(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
}

export async function validateUniqueEmail(email: string | undefined) {

}
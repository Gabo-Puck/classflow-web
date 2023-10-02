import { ValidatorFunction } from "@validations/index";

interface ValidatorObject<T> {
    validator: ValidatorFunction<T>;
    message: string | null;
}

export function executeValidations<T>(value: T, validations: ValidatorObject<T>[]) {
    if (validations.length <= 0) {
        return null
    }
    for (let i = 0; i < validations.length; i++) {
        const { validator, message } = validations[i];
        if (!validator(value))
            return message;
    }
    return null
}
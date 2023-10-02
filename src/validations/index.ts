export interface ValidatorFunction<T> {
    (value: T): boolean;
}
export * from "@validations/exec-validations.validator"
export * from "@validations/login"
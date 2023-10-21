import { ERROR_TYPES, axiosClassflow } from "./axios";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios"

interface Response<R> {
    message: string;
    data: R
}

export interface ResponseClassflow<T> extends AxiosResponse<Response<T>> {
}
export interface ErrorClassflow<T> extends AxiosError<Response<T>> {
}

interface IService<R, E> {
    go: () => Promise<R>
    onSend: () => void;
    onSuccess: (data: AxiosResponse<Response<R>>) => void;
    onError: (data: AxiosError<Response<E>>) => void;
    onErrorNoResponse: (data: E) => void;
    onErrorPreparing: (data: E) => void;
    onFinally: () => void;
}

class Service<D, R, E>{
    axios = axiosClassflow;
    url: string;
    data?: D;
    config?: AxiosRequestConfig<D> | undefined;
    onSend = () => { };
    onSuccess = (data: AxiosResponse<Response<R>>) => { console.log({ data }) };
    onError = (data: AxiosError<Response<E>>) => { console.log({ data }) };
    onErrorNoResponse = (error: any) => { console.log({ error }); };
    onErrorPreparing = (error: any) => { console.log({ error }); };
    onFinally = () => { };
    constructor(url: string, config: AxiosRequestConfig<D> | undefined, data?: D) {
        this.url = url;
        this.config = config
        this.data = data;
    }
}

export class ClassflowGetService<D, R, E> extends Service<D, R, E> implements IService<R, E>{
    go = async () => {
        return await this.axios.get<D, R>(this.url, this.config);
    }
}
export class ClassflowPostService<D, R, E> extends Service<D, R, E> implements IService<R, E>{
    go = async () => {
        return await this.axios.post<D, R>(this.url, this.data, this.config);
    }
}
export class ClassflowDeleteService<D, R, E> extends Service<D, R, E> implements IService<R, E>{
    go = async () => {
        return await this.axios.delete<D, R>(this.url, this.config);
    }
}
export class ClassflowPutService<D, R, E> extends Service<D, R, E> implements IService<R, E>{
    go = async () => {
        let xd = await this.axios.put<D, R>(this.url, this.data, this.config);
        return xd;
    }
}

class ClassflowExecutor {
    async exec(request: IService<any, any>) {
        try {
            request.onSend();
            let response = await request.go();
            request.onSuccess(response);
        } catch (error: any) {
            switch (error.errorCause) {
                case ERROR_TYPES.NO_RESPONSE:
                    request.onErrorNoResponse(error);
                    break;
                case ERROR_TYPES.STATUS:
                    request.onError(error);
                    break;
                case ERROR_TYPES.PREPARING:
                    request.onErrorPreparing(error);
                    break;
            }
        } finally {
            request.onFinally();
        }
    }
}
export const classflowAPI = new ClassflowExecutor();
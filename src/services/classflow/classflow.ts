import { ERROR_TYPES, axiosClassflow } from "./axios";
import { AxiosRequestConfig } from "axios"

interface IService<R> {
    go: () => Promise<R>
    onSend: () => void;
    onSuccess: (data: R) => void;
    onError: (data: any) => void;
    onErrorNoResponse: (data: R) => void;
    onErrorPreparing: (data: R) => void;
    onFinally: () => void;
}

class Service<D, R>{
    axios = axiosClassflow;
    url: string;
    data: D;
    config?: AxiosRequestConfig<D> | undefined;
    onSend = () => { };
    onSuccess = (data: R) => { console.log({ data }) };
    onError = (data: any) => { console.log({ data }) };
    onErrorNoResponse = (error: any) => { console.log({ error }); };
    onErrorPreparing = (error: any) => { console.log({ error }); };
    onFinally = () => { };
    constructor(url: string, config: AxiosRequestConfig<D> | undefined, data: D) {
        this.url = url;
        this.config = config
        this.data = data;
    }
}

export class ClassflowGetService<D, R> extends Service<D, R> implements IService<R>{
    go = async () => {
        return await this.axios.get<D, R>(this.url, this.config);
    }
}
export class ClassflowPostService<D, R> extends Service<D, R> implements IService<R>{
    go = async () => {
        return await this.axios.post<D, R>(this.url, this.data, this.config);
    }
}
export class ClassflowDeleteService<D, R> extends Service<D, R> implements IService<R>{
    go = async () => {
        return await this.axios.delete<D, R>(this.url, this.config);
    }
}
export class ClassflowPutService<D, R> extends Service<D, R> implements IService<R>{
    go = async () => {
        let xd = await this.axios.put<D, R>(this.url, this.data, this.config);
        return xd;
    }
}

class ClassflowExecutor {
    async exec(request: IService<any>) {
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
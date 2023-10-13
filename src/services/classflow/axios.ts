import axios, { AxiosError, AxiosHeaderValue, AxiosResponse, AxiosResponseHeaders, InternalAxiosRequestConfig } from "axios"
export enum ERROR_TYPES {
    "STATUS",
    "NO_RESPONSE",
    "PREPARING"
}
const CLASSFLOW_API = import.meta.env.VITE_CLASS_FLOW_API;
if (!CLASSFLOW_API)
    throw new Error("CLASSFLOW_API missing");

const axiosInstance = axios.create({
    baseURL: CLASSFLOW_API,
    timeout: 2500,
    withCredentials: true
});

// Agregar un interceptor a la petición
axiosInstance.interceptors.request.use(function (config) {
    // Haz algo antes que la petición se ha enviada
    if (config.method && config.baseURL && config.url) {
        let method = config.method;
        let baseUrl = config.baseURL;
        let url = config.url?.replace(baseUrl, "");
        let data = config.data;
        console.log({
            baseUrl,
            method,
            url,
            data
        });
    }
    return config;
}, function (error) {
    console.log({
        error
    });
    // Haz algo con el error de la petición
    return Promise.reject(error);
});

// Agregar una respuesta al interceptor
axiosInstance.interceptors.response.use(function (response) {
    // Cualquier código de estado que este dentro del rango de 2xx causa la ejecución de esta función 
    // Haz algo con los datos de la respuesta

    return response;
}, function (error) {
    // Cualquier código de estado que este fuera del rango de 2xx causa la ejecución de esta función
    // Haz algo con el error
    let response;
    if (error.response) {
        // La respuesta fue hecha y el servidor respondió con un código de estado
        // que esta fuera del rango de 2xx
        response = { ...error, errorCause: ERROR_TYPES.STATUS }
    } else if (error.request) {
        // La petición fue hecha pero no se recibió respuesta
        // `error.request` es una instancia de XMLHttpRequest en el navegador y una instancia de
        // http.ClientRequest en node.js
        response = { ...error, errorCause: ERROR_TYPES.NO_RESPONSE }
    } else {
        // Algo paso al preparar la petición que lanzo un Error
        response = { ...error, errorCause: ERROR_TYPES.PREPARING }
    }
    console.log(response);
    return Promise.reject(error);
});

export const axiosClassflow = axiosInstance;
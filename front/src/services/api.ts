import axios, {AxiosResponse} from 'axios';
import {ITableDataRq,Response} from "../models/typings";


const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 2000,
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE",
        "Access-Control-Allow-Headers": "x-access-token, Origin, X-Requested-With, Content-Type, Accept",
    }
});

export const apiService = {
    getTableList: (rq: ITableDataRq): Promise<AxiosResponse<Response>> => {
       return api.post<Response>("/get_table_list", rq)
    },

    getTableData: (rq: ITableDataRq): Promise<AxiosResponse<Response>> => {
        return api.post<Response>('/get_table_data', rq);
    },
}

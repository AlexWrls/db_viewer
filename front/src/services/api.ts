import axios, {AxiosResponse} from 'axios';
import {ITableDataRq,Response} from "../models/typings";

const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_URL || 'https://db.viewer.com'
    : 'http://localhost:8080';

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
    findAllTableName: (rq: ITableDataRq): Promise<AxiosResponse<Response>> => {
       return api.post<Response>("/api/find_all_table_name", rq)
    },

    findTableRows: (rq: ITableDataRq): Promise<AxiosResponse<Response>> => {
        return api.post<Response>("/api/find_table_rows", rq);
    },
}

import axios from 'axios';
import { APIRootPath } from '@fed-exam/config';

export type Ticket = {
    id: string,
    title: string;
    content: string;
    creationTime: number;
    userEmail: string;
    labels?: string[];
}

export type TicketsData = {
    tickets?: Ticket[];
    resultsFound: number;
}

export type ApiClient = {
    GetTickets: (query: string, page: number, from: string, to: string, email: string, tags: string) => Promise<TicketsData>;
}

export const createApiClient = (): ApiClient => {
    return {
        GetTickets: async (query: string, page: number, from: string, to: string, email: string, tags: string) => {
            return axios.get(`${APIRootPath}/?search=${query}&page=${page}&after=${from}&before=${to}&from=${email}&tags=${tags}`).then((res) => res.data);
        }
    }
}

import axios from 'axios';

export const fetcher = <T>(url: string): Promise<T> =>
    axios.get<T>(url).then((res) => res.data);

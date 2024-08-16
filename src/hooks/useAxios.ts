import axios from 'axios';
import { useEffect, useState } from 'react'

interface configObjectProps {
    axiosInstance: any,
    method: string,
    url: string,
    requestConfig?: any,
}

const useAxios = () => {

    const [controller, setController] = useState<AbortController>()

    const axiosFetch = async (configObject: configObjectProps) => {
        const {
            axiosInstance,
            method,
            url,
            requestConfig = {},
        } = configObject;

        const ctrl = new AbortController();
        setController(ctrl);

        try {
            const res = await axiosInstance[method](url, {
                ...requestConfig,
                signal: ctrl.signal,
            })
            console.log(res);
            return res.data;
        } catch (err: any) {
            if (axios.isCancel(err)) {
                console.log('Request canceled', err.message);
            } else {
                throw err;
            }
        }
    };

    useEffect(() => {
        return () => {
            if (controller) {
                controller.abort();
            }
        };
    }, [controller]);

    return { axiosFetch }
}

export default useAxios
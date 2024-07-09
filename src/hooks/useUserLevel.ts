import { useCallback } from 'react';
import useAxios from './useAxios';
import { useLocalStorage } from './useLocalStorage';
import axiosInstance from '../api/axios';

const useUserLevel = () => {
    const { axiosFetch } = useAxios();
    const { getItem } = useLocalStorage();

    const updateUserLevel = useCallback(async (levelNumber: number) => {
        const localStorageUser = getItem('CYBERNETIC_USER')
        const userId = localStorageUser?.userId
        console.log("callback was called")
        try {
            const response = await axiosFetch({
                axiosInstance,
                method: 'post',
                url: '/user/game-play-level/update',
                requestConfig: {
                    userId: userId,
                    levelNumber: levelNumber,
                },
            });
            console.log(response);
        } catch (error) {
            throw error;
        }
    }, [axiosFetch, getItem]);

    return { updateUserLevel };
}

export default useUserLevel;

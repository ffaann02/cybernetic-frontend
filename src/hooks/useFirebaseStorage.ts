import axiosInstance from "../api/axios";

export const useFirebaseStorage = () => {
    const uploadImage = async (blob: Blob, filename: string, path: string) => {
        const formData = new FormData();
        formData.append('image', blob, filename);
        try {
            const response = await axiosInstance.post('/firebase/upload-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                params: {
                    path: path
                }
            });
            console.log(response);
        } catch (err) {
            console.error('Error uploading image:', err);
        }
    };

    return { uploadImage };
};
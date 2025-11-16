import api from "./api";

export const allClassService = {
    //Get list containing every class
    async getListOfClasses() {
        try {
            return await api.get(`/allClasses/list-classes`);
        } catch(error) {
            throw error;
        }
    },
}
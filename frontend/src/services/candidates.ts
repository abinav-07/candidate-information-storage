import { AxiosResponse } from "axios"
import { API } from "../utils/apis"

export const fetchCandidates = async (): Promise<AxiosResponse<any>> => {
    return await API.get(`/admin/candidate`)
}

export const deleteCandidateProfile = async (
    candidateId: number,
): Promise<AxiosResponse<any>> => {
    return await API.delete(`/admin/candidate/${candidateId}`);
};


import { AxiosResponse } from "axios"
import { API } from "../utils/apis"
import { ICreateCandidate, IUpdateCandidate } from "@/types/candidates";
import { removeBlankAttributes } from "@/utils/removeBlankAttributes";

export const fetchCandidates = async (): Promise<AxiosResponse<any>> => {
    return await API.get(`/admin/candidate`)
}

export const fetchOneCandidate = async (candidateId: number): Promise<AxiosResponse<any>> => {
    return await API.get(`/admin/candidate/${candidateId}`)
}

export const upsertCandidateProfile = async (
    values: ICreateCandidate,
): Promise<AxiosResponse<any>> => {
    const payload = removeBlankAttributes(values)
    return await API.post(`/admin/candidate`, payload);
};

export const updateCandidateProfile = async (
    { candidate_id, ...rest }: IUpdateCandidate,
) => {
    const payload = removeBlankAttributes(rest)

    return await API.patch(`/admin/candidate/${candidate_id}`, { ...payload });
};

export const deleteCandidateProfile = async (candidateId: number): Promise<AxiosResponse<any>> => {
    return await API.delete(`/admin/candidate/${candidateId}`)
}

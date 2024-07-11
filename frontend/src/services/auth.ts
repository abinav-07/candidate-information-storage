import { ILoginForm } from "@/types";
import { API } from "@/utils";
import { AxiosResponse } from "axios";

export const loginUser = async (
    values: ILoginForm,
): Promise<AxiosResponse<any[]>> => {
    return await API.post(`/auth/login`, values);
};

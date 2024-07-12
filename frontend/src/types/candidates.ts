export interface ICreateCandidate {
    first_name: string
    last_name: string
    email: string
    free_text: string
    phone_number?: string,
    linkedin_url?: string
    github_url?: string
    availability_start_time?: string
    availability_end_time?: string
}

export interface IUpdateCandidate extends ICreateCandidate {
    candidate_id: number
}

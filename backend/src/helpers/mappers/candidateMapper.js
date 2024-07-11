exports.candidateDataMapper = (candidateData) => {
    return {
      candidate_id:candidateData?.id,
      first_name: candidateData?.first_name,
      last_name: candidateData?.last_name,
      email: candidateData?.email,
      free_text:candidateData?.free_text,

    //   Optional Data
      phone_number:candidateData?.phone_number,

      linkedin_url:candidateData?.linkedin_url,

      github_url:candidateData?.github_url,

      availability_start_time:candidateData?.availability_start_time,

      availability_end_time:candidateData?.availability_end_time,

      created_at:candidateData?.created_at
    }
  }
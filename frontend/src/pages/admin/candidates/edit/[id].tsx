import PrivateRoute from "@/pages/privateRoute"
import { useRouter } from "next/router"

const EditCandidateProfile: React.FC = () => {
    const router = useRouter()
    const { id } = router?.query
    return (
        <>
            {id}
        </>
    )
}

export default PrivateRoute(EditCandidateProfile) 
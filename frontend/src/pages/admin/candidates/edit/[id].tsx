import CandidateProfileForm from "@/components/candidates/form"
import PrivateRoute from "@/pages/privateRoute"
import { Layout } from "antd"
import { Content, Header } from "antd/es/layout/layout"
import { useRouter } from "next/router"

const EditCandidateProfile: React.FC = () => {
  const router = useRouter()
  const { id } = router?.query
  return (
    <Layout>
      <Header className="content-header">
        <h3>Edit Candidate Profile</h3>
      </Header>
      <Content className="candidate-form-layout">
        <CandidateProfileForm id={String(id)} />
      </Content>
    </Layout>
  )
}

export default PrivateRoute(EditCandidateProfile)

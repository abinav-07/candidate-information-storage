import CandidateProfileForm from "@/components/candidates/form"
import PrivateRoute from "@/pages/privateRoute"
import { Layout } from "antd"
import { Content, Header } from "antd/es/layout/layout"

const UpsertCandidateProfile: React.FC = () => {
  return (
    <Layout>
      <Header className="content-header">
        <h3>Create Candidate Profile</h3>
      </Header>
      <Content className="candidate-form-layout">
        <CandidateProfileForm />
      </Content>
    </Layout>
  )
}

export default PrivateRoute(UpsertCandidateProfile)

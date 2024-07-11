import PrivateRoute from "@/privateRoute"
import { Result } from "antd"
import styled from "styled-components"

const Container = styled.div`
  font-size: 20px;
  line-height: 27px;
`

const PageNotFound = () => {
  return (
    <Result
      status={"404"}
      title={"404"}
      subTitle={<Container>{`Sorry, the page you visited does not exist.`}</Container>}
    />
  )
}

export default PrivateRoute(PageNotFound)

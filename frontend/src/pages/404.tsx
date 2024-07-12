
import { Result } from "antd"
import styled from "styled-components"
import PrivateRoute from "./privateRoute"

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

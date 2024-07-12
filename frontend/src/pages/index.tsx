import Head from "next/head"
import Candidates from "./admin/candidates"

function Home() {
  return (
    <>
      <Head>
        <title> {"Top Page"}</title>
      </Head>
      <Candidates />
    </>
  )
}

export default Home

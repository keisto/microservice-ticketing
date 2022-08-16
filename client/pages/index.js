import buildClient from '../api/build-client'

function Home({ currentUser }) {
  console.log(currentUser)
  // axios.get('/api/users/current').catch((err) => {
  //   console.log(err.message)
  // })
  return currentUser ? <h1>Signed in</h1> : <h1>Please login</h1>
}

Home.getInitialProps = async (context) => {
  const client = buildClient(context)
  const { data } = await client.get('/api/users/current')
  // const { data } = await buildClient(context).get('/api/users/current')

  return data
}

export default Home

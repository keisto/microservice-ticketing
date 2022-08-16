import { useEffect } from 'react'
import useRequest from '../../hooks/use-request'
import Router from 'next/router'

function Register() {
  const { doRequest, errors } = useRequest({
    url: '/api/users/logout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/'),
  })

  useEffect(() => {
    doRequest()
  }, [])

  return <div>Logging out...</div>
}

export default Register

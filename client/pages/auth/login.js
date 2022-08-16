import { useState } from 'react'
import axios from 'axios'
import useRequest from '../../hooks/use-request'
import { useRouter } from 'next/router'

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const { doRequest, errors } = useRequest({
    url: '/api/users/login',
    method: 'post',
    body: { email, password },
    onSuccess: () => router.push('/'),
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    await doRequest()
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>
      <div className="mb-3">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control"
        />
      </div>
      {errors}
      <button className="btn btn-primary">Login</button>
    </form>
  )
}

export default Register

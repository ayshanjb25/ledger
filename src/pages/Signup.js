import React from 'react'
import Header from '../components/Header'
import SignUpSignIn from '../components/SignupSignin'

const Signup = () => {
  return (
    <div>
      <Header/>
      {/* <Wave /> */}
      <div className='wrapper'><SignUpSignIn/>
     </div>
    </div>
  )
}

export default Signup

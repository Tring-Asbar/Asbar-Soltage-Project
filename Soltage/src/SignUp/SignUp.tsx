import '../SignIn/SignIn.scss'
import logo from '../assets/images/SoltageLogo.png'

export const SignUp = () => {
  return (
    <div className="login_page">
      <div className="login_content">
        <h1>Welcome to the Soltage Nexus</h1>
        <h1>Mangement Platform</h1>
        <p>The Nexus platform provides a central point of connection and collaboration for Soltage's portfolio of projects.</p>
      </div>
      <div className="login_container">
      <div className="login_sub-container">
          <img src={logo} alt="" />
          <h1>Welcome, Sign Up</h1>
          <p className="content">Please create your Soltage Nexus log in credentials by providing the details below</p>
      </div>
      </div>
    </div>
  )
}

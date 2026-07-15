import {Component} from 'react'
import {withRouter, Link} from 'react-router-dom'
import API_BASE_URL from '../../config/api'
import './index.css'

class RegisterForm extends Component {
  state = {
    username: '',
    password: '',
    showError: false,
    errorMsg: '',
    successMsg: '',
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = `${API_BASE_URL}/register`
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(userDetails),
    }

    try {
      const response = await fetch(url, options)
      const data = await response.json()

      if (response.ok) {
        this.setState({
          successMsg: '✅ Registered successfully! Redirecting to login...',
          showError: false,
          errorMsg: '',
        })
        setTimeout(() => {
          this.props.history.push('/login')
        }, 1500)
      } else {
        this.setState({showError: true, errorMsg: data.error_msg || 'Registration failed. Please try again.'})
      }
    } catch (error) {
      this.setState({showError: true, errorMsg: 'Unable to connect to server. Please try again later.'})
    }
  }

  render() {
    const {username, password, showError, errorMsg, successMsg} = this.state

    return (
      <div className="login-form-container">
        <form className="form-container" onSubmit={this.onSubmitForm}>
          <h1 className="form-title">Register</h1>

          <label className="input-label" htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            className="username-input-field"
            value={username}
            onChange={this.onChangeUsername}
            placeholder="Enter username"
            required
          />

          <label className="input-label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="password-input-field"
            value={password}
            onChange={this.onChangePassword}
            placeholder="Enter password"
            required
          />

          <button type="submit" className="login-button">Register</button>

          {showError && <p className="error-message">*{errorMsg}</p>}
          {successMsg && <p className="success-message">{successMsg}</p>}

          <p className="form-switch-text">
            Already a user? <Link to="/login">Login here</Link>
          </p>
        </form>
      </div>
    )
  }
}

export default withRouter(RegisterForm)

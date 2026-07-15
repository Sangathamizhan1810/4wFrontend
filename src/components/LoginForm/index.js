import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect, Link} from 'react-router-dom'

import UserContext from '../../context/UserContext'
import CartContext from '../../context/CartContext'
import API_BASE_URL from '../../config/api'

import './index.css'

class LoginForm extends Component {
  static contextType = UserContext

  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = (jwtToken, resetCart) => {
    const {history} = this.props
    const {username} = this.state
    this.context.setUsername(username)
    
    // ✅ Reset cart when user logs in (new context value)
    if (resetCart) {
      resetCart()
    }

    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  submitForm = async (event, resetCart) => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = `${API_BASE_URL}/login`
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(userDetails),
    }

    try {
      const response = await fetch(url, options)
      const data = await response.json()

      if (response.ok) {
        this.onSubmitSuccess(data.jwt_token, resetCart)
      } else {
        this.onSubmitFailure(data.error_msg || 'Login failed. Please try again.')
      }
    } catch (error) {
      this.onSubmitFailure('Unable to connect to server. Please try again later.')
    }
  }

  render() {
    const {username, password, showSubmitError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <CartContext.Consumer>
        {({resetCart}) => (
          <div className="login-form-container">
            <form
              className="form-container"
              onSubmit={event => this.submitForm(event, resetCart)}
            >
              <h1 className="form-title">Login</h1>

              <label className="input-label" htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                className="username-input-field"
                placeholder="Enter username"
                value={username}
                onChange={this.onChangeUsername}
                required
              />

              <label className="input-label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="password-input-field"
                placeholder="Enter password"
                value={password}
                onChange={this.onChangePassword}
                required
              />

              <button type="submit" className="login-button">Login</button>

              {showSubmitError && <p className="error-message">*{errorMsg}</p>}

              <p className="form-switch-text">
                New user? <Link to="/register">Register here</Link>
              </p>
            </form>
          </div>
        )}
      </CartContext.Consumer>
    )
  }
}

export default LoginForm

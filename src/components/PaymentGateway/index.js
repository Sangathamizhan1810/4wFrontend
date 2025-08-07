import {Component} from 'react'
import UserContext from '../../context/UserContext'
import './index.css'

class PaymentGateway extends Component {
  state = {
    countdown: 10,
    isSuccess: false,
  }

  componentDidMount() {
    this.timerId = setInterval(this.tick, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.timerId)
    clearTimeout(this.redirectTimer)
  }

  tick = () => {
    this.setState(prevState => {
      if (prevState.countdown === 1) {
        clearInterval(this.timerId)
        this.setState({countdown: 0, isSuccess: true})

        // Start redirect timer after success
        this.redirectTimer = setTimeout(() => {
          this.props.history.replace('/')
        }, 5000)

        return {countdown: 0, isSuccess: true}
      }
      return {countdown: prevState.countdown - 1}
    })
  }

  render() {
    return (
      <UserContext.Consumer>
        {({username}) => (
          <div className="payment-container">
            <h1 className="payment-heading">Payment Gateway</h1>
            <p className="payment-username">User: {username}</p>
            {!this.state.isSuccess ? (
              <p className="payment-countdown">
                Processing Payment... {this.state.countdown}s
              </p>
            ) : (
              <h2 className="payment-success">
                🎉 Purchase Successful! Redirecting to Home...
              </h2>
            )}
          </div>
        )}
      </UserContext.Consumer>
    )
  }
}

export default PaymentGateway
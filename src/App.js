import {Component} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'

import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import Home from './components/Home'
import Products from './components/Products'
import ProductItemDetails from './components/ProductItemDetails'
import Cart from './components/Cart'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import CartContext from './context/CartContext'
import UserContext from './context/UserContext'
import PaymentGateway from './components/PaymentGateway'

import './App.css'

class App extends Component {
  state = {
    cartList: [],
    username: '',
  }

  setUsername = username => {
    this.setState({username})
  }

  removeAllCartItems = () => {
    this.setState({cartList: []})
  }

  resetCart = () => {
  this.setState({cartList: []})
}

  incrementCartItemQuantity = id => {
    this.setState(prevState => ({
      cartList: prevState.cartList.map(eachCartItem =>
        id === eachCartItem.id
          ? {...eachCartItem, quantity: eachCartItem.quantity + 1}
          : eachCartItem
      ),
    }))
  }

  decrementCartItemQuantity = id => {
    const {cartList} = this.state
    const product = cartList.find(item => item.id === id)
    if (product.quantity > 1) {
      this.setState(prevState => ({
        cartList: prevState.cartList.map(eachCartItem =>
          id === eachCartItem.id
            ? {...eachCartItem, quantity: eachCartItem.quantity - 1}
            : eachCartItem
        ),
      }))
    } else {
      this.removeCartItem(id)
    }
  }

  removeCartItem = id => {
    const updatedCart = this.state.cartList.filter(item => item.id !== id)
    this.setState({cartList: updatedCart})
  }

  addCartItem = product => {
    const {cartList} = this.state
    const existing = cartList.find(item => item.id === product.id)
    if (existing) {
      this.setState(prevState => ({
        cartList: prevState.cartList.map(each =>
          each.id === product.id
            ? {...each, quantity: each.quantity + product.quantity}
            : each
        ),
      }))
    } else {
      this.setState({cartList: [...cartList, product]})
    }
  }

  render() {
    const {cartList, username} = this.state

    return (
      <UserContext.Provider value={{username, setUsername: this.setUsername}}>
        <CartContext.Provider
          value={{
            cartList,
            addCartItem: this.addCartItem,
            removeCartItem: this.removeCartItem,
            incrementCartItemQuantity: this.incrementCartItemQuantity,
            decrementCartItemQuantity: this.decrementCartItemQuantity,
            removeAllCartItems: this.removeAllCartItems,
            resetCart: this.resetCart,
          }}>
          <Switch>
            <Route exact path="/login" component={LoginForm} />
            <Route exact path="/register" component={RegisterForm} />
            <ProtectedRoute exact path="/" component={Home} />
            <ProtectedRoute exact path="/products" component={Products} />
            <ProtectedRoute exact path="/products/:id" component={ProductItemDetails} />
            <ProtectedRoute exact path="/cart" component={Cart} />
            <ProtectedRoute exact path="/payment" component={PaymentGateway} />
            <Route path="/not-found" component={NotFound} />
            <Redirect to="/not-found" />
          </Switch>
        </CartContext.Provider>
      </UserContext.Provider>
    )
  }
}

export default App


// jwtToken "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJhaHVsIiwicm9sZSI6IlBSSU1FX1VTRVIiLCJpYXQiOjE2MjMwNjU1MzJ9.D13s5wN3Oh59aa_qtXMo3Ec4wojOx0EZh8Xr5C5sRkU"

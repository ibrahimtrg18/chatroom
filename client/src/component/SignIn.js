import React, { Component } from "react"
import socketIOClient from 'socket.io-client'

class SignIn extends Component {
  constructor() {
    super()
    this.state = {
      username: "",
      userNamed: null,
      userLogin: false
    }
  }

  componentDidMount() { }

  handleChange = (e) => {
    this.setState({ username: e.target.value })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    console.log(this.state.username)
    const socket = socketIOClient("http://localhost:4001")
    socket.emit('user_name', {
      userNamed: this.state.username
    })
    socket.on('user_named', (data) => {
      this.setState({ userNamed: data.userNamed })
      if (this.state.userNamed) {

      } else {
        this.props.history.push({
          pathname: '/room',
          state: {
            username: this.state.username,
            userNamed: this.state.userNamed
          }
        })
        socket.off('user_named')
      }
    })
  }

  render() {
    return (
      <div className="container h-100">
        <div className="row h-100 align-items-center">
          <div className="col-6 mx-auto">
            <div className="jumbotron">
              <form className="form center" onSubmit={this.handleSubmit}>
                <div className="form-group mr-1 mb-2">
                  <label><h5 className="font-weight-bold">Enter Your Name :</h5></label>
                  <input type="text" className="form-control" placeholder="" onChange={this.handleChange} />
                </div>
                <input type="submit" className="btn btn-primary float-right m-1"></input>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default SignIn
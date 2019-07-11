import React, { Component } from "react"
import { withRouter } from "react-router-dom"
import socketIOClient from 'socket.io-client';

class CreateRoom extends Component {
  constructor(props) {
    super(props)
    this.state = {
      endpoint: "http://localhost:4001/api/room/create",
      roomName: "",
      roomOwner: this.props.location.state.username
    }
  }

  handleChange = (e) => {
    this.setState({ roomName: e.target.value })
    console.log(this.state.roomName)
  }

  handleSubmit = (e) => {
    e.preventDefault()
    // console.log(this.state.roomName)
    // fetch(this.state.endpoint, {
    //   method: 'post',
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     "roomName": this.state.roomName,
    //     "roomOwner": this.state.roomOwner
    //   })
    // })
    const socket = socketIOClient("http://localhost:4001")
    socket.emit('create_room', {
      roomName: this.state.roomName,
      roomOwner: this.state.roomOwner
    })
    this.props.history.push({
      pathname: "/room",
      state: {
        username: this.props.location.state.username,
      }
    })
  }

  render() {
    console.log(this.state.roomOwner)
    return (
      <div className="container h-100">
        <div className="row justify-content-center align-item-center">
          <form className="form-group border border-primary p-3" onSubmit={this.handleSubmit}>
            <label>
              Create Room
            </label>
            <input type="text" className="form-control" placeholder="Name Rooms" onChange={this.handleChange}></input>
            <input type="submit" className="btn btn-primary float-right m-1"></input>
          </form>
        </div>
      </div>
    )
  }
}

export default withRouter(CreateRoom);
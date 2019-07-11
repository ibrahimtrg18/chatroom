import React, { Component } from 'react'
import socketIOClient from 'socket.io-client'

class EditRoom extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: this.props.location.state.username,
      roomId: this.props.location.state.roomId,
      roomMod: "",
    }
  }

  componentDidMount = () => {
    console.log(this.state.roomName)
  }

  handleChange = (e) => {
    this.setState({ roomMod: e.target.value })
  }

  handleSubmit = (e) => {
    var socket = socketIOClient("http://localhost:4001")
    socket.emit('edit_room', {
      roomId: this.state.roomId,
      username: this.state.roomMod
    })
    this.props.history.push({
      pathname: '/room',
      state: {
        username: this.state.username
      }
    })
  }

  render() {
    return (
      <div className="container h-100">
        <div className="row justify-content-center align-item-center">
          <form className="form-group border border-primary p-3" onSubmit={this.handleSubmit}>
            <label>
              Edit Room
            </label>
            <input type="text" className="form-control" name="roomMod" placeholder="Mod Rooms" onChange={this.handleChange} />
            <input type="submit" className="btn btn-primary float-right m-1"></input>
          </form>
        </div>
      </div>
    )
  }
}

export default EditRoom
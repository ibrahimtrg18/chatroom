import React, { Component } from "react"
import { Link, Redirect } from 'react-router-dom'
import socketIOClient from 'socket.io-client';
import { withRouter } from 'react-router-dom'

class Room extends Component {
  constructor(props) {
    super(props)
    this.state = {
      endpoint: "http://localhost:4001/api/room",
      roomId: "",
      roomName: "",
      roomOwner: "",
      roomMod: [],
      roomList: [],
      username: this.props.location.state.username,
      userNamed: null
    }
  }

  componentDidMount() {
    console.log(this.state.username)
    fetch(this.state.endpoint)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        data.map(item => {
          this.setState({
            roomId: item._id,
            roomName: item.roomName,
            roomOwner: item.roomOwner,
            roomMod: item.roomMod
          })
          this.state.roomList.push({
            roomId: this.state.roomId,
            roomName: this.state.roomName,
            roomOwner: this.state.roomOwner,
            roomMod: this.state.roomMod
          })
          this.setState({ roomId: "" })
        })
      })
      .catch(error => console.log(error))
    const socket = socketIOClient("http://localhost:4001")
    socket.on('user_named', (data) => {
      this.setState({ userNamed: data.userNamed })
    })
    socket.on('view_room', (data) => {
      console.log(data)
      this.setState({
        roomId: data.id,
        roomName: data.roomName,
        roomOwner: data.roomOwner
      })
      this.state.roomList.push({
        roomId: this.state.roomId,
        roomName: this.state.roomName,
        roomOwner: this.state.roomOwner
      })
      this.setState({ roomId: "" })
    })
  }

  handleClick = () => {
    var socket = socketIOClient("http://localhost:4001")
    this.props.history.push('/')
    socket.emit('user_logout', ({
      username: this.state.username
    }))
  }

  render() {
    console.log(this.state.roomList)
    const roomListView = this.state.roomList.map(item => {
      return (
        <div key={item.roomId} className="col-3 border border-primary p-1 m-1">
          <h3>{item.roomName}</h3>
          <p><small>Owner: {item.roomOwner}</small></p>
          {
            this.state.username == item.roomOwner &&
            <Link to={{
              pathname: "/room/" + item.roomId + "/edit",
              state: {
                roomId: item.roomId,
                roomName: item.roomName,
                username: this.state.username
              }
            }} className="btn btn-info float-left">Edit</Link>
          }
          <Link to={{
            pathname: "/room/" + item.roomId,
            state: {
              roomId: item.roomId,
              roomOwner: item.roomOwner,
              roomMod: item.roomMod,
              username: this.state.username
            }
          }} className="btn btn-info float-right">Join</Link>
        </div>
      )
    })
    // console.log(this.state.username)
    return (
      <div className="container">
        <h2><u>Chat Section</u></h2>
        <div className="row">
          {roomListView.length > 0 ? roomListView : <h5>'no rooms'</h5>}
          <div className="fixed-bottom">
            <p className="d-flex float-left">{this.state.username}</p>
            <button onClick={this.handleClick} className="d-flex float-right btn btn-primary m-2">Log Out</button>
            <Link to={{
              pathname: "/room/create",
              state: {
                username: this.state.username,
              }
            }} className="d-flex float-right btn btn-primary m-2">Create</Link>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Room)
import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';

class Chat extends Component {
  constructor(props) {
    super(props)
    this.state = {
      endpoint: "http://localhost:4001/api/room/" + this.props.location.state.roomId,
      roomId: this.props.location.state.roomId,
      roomMod: this.props.location.state.roomMod,
      roomOwner: this.props.location.state.roomOwner,
      sender: this.props.location.state.username,
      message: "",
      id: "",
      responseSender: "",
      responseMessage: "",
      responseCreatedAt: "",
      responseId: "",
      list: []
    }
  }

  componentDidMount = () => {
    console.log(this.state.endpoint)
    console.log(this.state.roomMod)
    fetch(this.state.endpoint)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        data.map(item => {
          this.setState({
            responseId: item._id,
            responseMessage: item.messageChat,
            responseSender: item.senderChat,
          })
          this.state.list.push({
            id: this.state.responseId,
            message: this.state.responseMessage,
            sender: this.state.responseSender,
          })
          this.setState({ message: "" })
        })
        console.log(this.state.list)
      })
      .catch(error => {
        console.error(error);
      })
    const socket = socketIOClient("http://localhost:4001");
    socket.on('new_chat', (data) => {
      console.log(data)
      this.setState({
        responseId: data.id,
        responseMessage: data.message,
        responseSender: data.sender,
      })
      this.state.list.push({
        id: this.state.responseId,
        message: this.state.responseMessage,
        sender: this.state.responseSender,
      })
      this.setState({ message: "" })
      console.log(this.state.list)
    })
    socket.on('deleted_chat', data => {
      this.setState({
        list: this.state.list.filter(item => item.id != data.chatId)
      })
      this.setState({ message: "" })
    })
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    var scrollingElement = (document.scrollingElement || document.body);
    scrollingElement.scrollTop = scrollingElement.scrollHeight;
  }

  handleChange = (e) => {
    this.setState({ message: e.target.value })
    console.log(this.state.message)
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const socket = socketIOClient("http://localhost:4001/");
    socket.emit('add_chat', {
      roomId: this.state.roomId,
      message: this.state.message,
      sender: this.state.sender,
    })
  }

  handleClick = (id) => {
    // fetch("http://localhost:4001/api/room/" + this.props.location.state.roomId + id, {
    //   method: 'delete',
    //   body: JSON.stringify({
    //     roomId: this.state.roomId,
    //     chatId: id
    //   })
    // })
    //   .then(response => response.json())
    //   .then(data => console.log(data))
    // console.log(id)
    const socket = socketIOClient("http://localhost:4001/");
    socket.emit('delete_chat', {
      roomId: this.state.roomId,
      chatId: id
    })
  }

  render() {
    if (this.state.roomMod) {
      var c = this.state.roomMod.includes(this.state.sender)
      console.log(c)
    }
    const listChat = this.state.list.map((chat, index) => {
      return (
        <div key={index} className="m-1">
          <div className="list-group-item list-group-item-action">
            <div className="justify-content-between">
              {this.state.sender == chat.sender |
                this.state.roomOwner == this.state.sender |
                c ?
                <button
                  className="btn btn-outline-danger d-flex float-right"
                  onClick={() => this.handleClick(chat.id)}>
                  <small>delete</small>
                </button> : <div></div>}
              <h5 className="mb-1">{chat.sender}</h5>
            </div>
            <p className="mb-1">{chat.message}</p>
          </div>
        </div>
      )
    })
    return (
      <div className="container p-1">
        <div className="row">
          <div className="col-12">
            <ul className="list-group">
              {listChat}
            </ul>
          </div>
          <form className="form-inline input-group input-group-lg" onSubmit={this.handleSubmit} style={style}>
            <input className="form-control" type="text" onChange={this.handleChange} value={this.state.message} placeholder="Message" />
            <input className="btn btn-primary ml-2" type="submit" value="Submit" />
          </form>
        </div>
      </div>
    )
  }
}

var style = {
  backgroundColor: "#F7F7F7",
  borderTop: "1px solid #E7E7E7",
  textAlign: "center",
  padding: "20px",
  position: "fixed",
  left: "0",
  bottom: "0",
  height: "80px",
  width: "100%",
}

export default Chat;

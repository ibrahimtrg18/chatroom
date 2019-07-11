import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import SignIn from './component/SignIn';
import ChatRoom from './component/ChatRoom';
import ViewRoom from './component/ViewRoom'
import CreateRoom from './component/CreateRoom';
import EditRoom from './component/EditRoom'

class App extends Component {
  render() {
    return (
      <Router>
        <div className='routes'>
          <Switch>
            <Route exact path='/' component={SignIn} />
            <Route exact path='/room/create' component={CreateRoom} />
            <Route exact path='/room/:id/edit' component={EditRoom} />
            <Route exact path='/room/:id' component={ChatRoom} />
            <Route exact path='/room' component={ViewRoom} />
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App;

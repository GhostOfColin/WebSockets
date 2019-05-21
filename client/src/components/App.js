import React from "react";
import { Switch, Route, Link } from "react-router-dom";
import AuthRoute from "../util/route_util";
import Nav from "./Nav";
import Login from "./Login";
import Signup from "./Signup";
import ChannelIndex from "./channels/ChannelIndex";
import CreateChannel from "./channels/CreateChannel";
import MainChat from './messages/main_chat';
import openSocket from 'socket.io-client';
const io = openSocket('http://localhost:5000');

class App extends React.Component {

  componentDidMount() {
    console.log("test");
    this.socket = io.connect('http://localhost:5000');
    this.socket.on('NEW_MESSAGE', message => {
      console.log(message);
    });
    this.socket.on('connection', message => console.log(message));
  }

  render() {
    return (
      <div>
        <h1>
          <Link to="/">Ezee Chat</Link>
          <Link to="/mainchat">Main Chat</Link>
        </h1>
        <Route path="/" component={Nav} />
        <Switch>
          <Route exact path="/channels/create" component={CreateChannel} />
          <Route path="/channels" component={ChannelIndex} />
          <Route path="/mainChat" component={MainChat} />
          <AuthRoute exact path="/login" component={Login} routeType="auth" />
          <AuthRoute exact path="/signup" component={Signup} routeType="auth" />
        </Switch>
      </div>
    );
  }
};

export default App;
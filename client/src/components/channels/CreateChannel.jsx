import React, { Component } from "react";
import { Mutation } from "react-apollo";

import Mutations from "../../graphql/mutations";
import Queries from "../../graphql/queries";
const { CREATE_CHANNEL } = Mutations;
const { CREATE_CHANNELS } = Queries;

class CreateChannel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: "",
      name: ""
    };
  }

  update(field) {
    return e => this.setState({ [field]: e.target.value });
  }

  updateCache(cache, { data }) {
    let channels;
    try {
      channels = cache.readQuery({ query: CREATE_CHANNELS });
    } catch (err) {
      return;
    }
    
    if (channels) {
      let channelArray = channels.channels;
      let newChannel = data.createChannel;
      cache.writeQuery({
        query: CREATE_CHANNELS,
        data: { channels: channelArray.concat(newChannel) }
      });
    }
  }

  handleSubmit(e, createChannel) {
    e.preventDefault();
    let name = this.state.name;
    createChannel({
      variables: {
        name: name,
      }
    });
  }

  render() {
    return (
      <Mutation
        mutation={CREATE_CHANNEL}
        onError={err => this.setState({ message: err.message })}
        update={(cache, data) => this.updateCache(cache, data)}
        onCompleted={data => {
          const { name } = data.createChannel;
          this.setState({
            message: `New channel ${name} was created successfully`
          });
        }}
      >
        {(createChannel, { data }) => (
          <div>
            <form onSubmit={e => this.handleSubmit(e, createChannel)}>
              <input
                onChange={this.update("name")}
                value={this.state.name}
                placeholder="Name"
              />
              <button type="submit">Create Channel</button>
            </form>
            <p>{this.state.message}</p>
          </div>
        )}
      </Mutation>
    );
  }
}

export default CreateChannel;

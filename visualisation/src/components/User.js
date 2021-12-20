import React from 'react';
import axios from 'axios';

export default class User extends React.Component {
  state = {
    login: "",
    id: ""
  }

  componentDidMount() {
    axios.get(`https://api.github.com/users/alicedoherty`)
      /*.then(res => res.json())*/
      .then(res => {
        const userData = res.data;
        this.setState({
          login: userData.login,
          id: userData.id,
        })
      });
  }

  render() {
    return (
      <ul>
          <li>Login: {this.state.login}</li>
          <li>ID: {this.state.id}</li>
      </ul>
    )
  }
}
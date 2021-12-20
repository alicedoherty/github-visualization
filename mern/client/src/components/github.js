import React, {Component}  from "react";
import axios from 'axios'

export default class GitHubSearch extends Component {
    constructor(props){ 
      super(props); 
       this.state = { 
        username: "",
       };
    }

    getUser(username) {
       return fetch(`https://api.github.com/users/${username}`)
       .then(response => response.json())
       .then(response => {
         return response;
        })
   }

  //   getUserRepo(username) {
  //     return fetch(`https://api.github.com/users/${username}/repos`)
  //     .then(response => response.json())
  //     .then(response => {
  //      return response;
  //    })
  //  }

    async handleSubmit(e) {
        e.preventDefault();

        let user = await this.getUser(this.refs.username.value);
        this.setState({ 
          //avatar_url: user.avatar_url,
          username: user.login,
          followers: user.followers,
          following: user.following,
          url: user.url,
        });

        const newUser = {
          username: this.state.username,
          followers: this.state.followers,
          following: this.state.following,
          url: this.state.url,
        };

        axios
          .post("http://localhost:5000/record/add", newUser)
          .then((res) => console.log(res.data));

        // empty state after posting data to db
        // this.setState({
        //   person_name: "",
        //   person_position: "",
        //   person_level: "",
        // });
    }

  // let repo = await this.getUserRepo(this.refs.username.value);
  //    this.setState({ name: repo.name,
  //    description: repo.description,
  //    git_url: repo.git_url,
  //    stargazers_count: repo.stargazers_count,
  //    forks_count: repo.forks_count,
  //    open_issues_count: repo.open_issues_count,
  //    size: repo.size,

  // })

  render() {
  //   let user;
  //   if(this.state.username) {
  //      user = 
  //      <div className="resultBadge">
  //        <img src={this.state.avatar_url}/>
  //        <p className="userInfo">
  //         Username: <br/>
  //         {this.state.username} 
  //        </p> 
  //        <p className="followerInfo">
  //         {this.state.followers} Followers
  //        </p>
  //        <p className="followingInfo">
  //          Following {this.state.following} users
  //        </p>
  //      </div>
  //  }

  //  let repo;
  //    if(this.state.userrepo) {
  //       repo =
  //         <div className="repoResults">
  //            <p>
  //              {this.state.name}
  //           </p>
  //         </div>
  //     }
        //this.myRef = React.createRef();

        return (
           <div className="GitHubSearch">
             <header className="search-header">
               <h1>Github User Search </h1>
             </header>
             <form onSubmit={e => this.handleSubmit(e)}>
                <input ref='username' type='text' placeholder='username' />
            </form>
            {/* <p className="search-intro">
               {user}
            </p> */}
   {/* <p>
     {repo}
    </p> */}
          </div>
);
}
}


// ReactDOM.render(<GitHubSearch/>, document.getElementById('container'));
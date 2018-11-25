import React, { Component } from 'react';
import './App.css';
import firebase from './firebase.js';

class App extends Component {

  constructor(){
    super();
    this.state = {
      currentItem: '',
      username: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit(e) {
     e.preventDefault();

     // save items to db
     const itemsRef = firebase.database().ref("items");
     itemsRef.push({
	     title: this.state.currentItem,
	     user: this.state.username
     });

     // clear item state
     this.setState({
	     username: '',
        currentItem: ''
     });
  }

  render() {
    return (
      <div className='app'>
        <header>
            <div className='wrapper'>
              <h1>Fun Food Friends</h1>

            </div>
        </header>
        <div className='container'>
          <section className='add-item'>
              <form onSubmit={this.handleSubmit}>
                <input type="text"
                  name="username"
                  placeholder="What's your name?"
                  onChange={this.handleChange}
                  value={this.state.username}
                />

                <input type="text"
                  name="currentItem"
                  placeholder="What are you bringing?"
                  onChange={this.handleChange}
                  value={this.state.currentItem}
                />

                <button>Add Item</button>
              </form>
          </section>
          <section className='display-item'>
            <div className='wrapper'>
              <ul>
              </ul>
            </div>
          </section>
        </div>
      </div>
    );
  }
}
export default App;
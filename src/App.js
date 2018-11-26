import React, {Component} from 'react';
import './App.css';
import firebase, {auth, provider} from './firebase.js';

class App extends Component {

	constructor() {
		super();
		this.state = {
			currentItem: '',
			username: '',
			items: [],
			user: null
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.logout = this.logout.bind(this);
		this.login = this.login.bind(this);
		this.setItems = this.setItems.bind(this);
	}

	componentDidMount() {

		// when database changes, update the items in our state
		const itemsRef = firebase.database().ref("items");
		itemsRef.on('value', (snapshot) => { this.setItems(snapshot) });

		// observer for user auth changes
		auth.onAuthStateChanged( (user) => {
			if(user){ this.setState({user}); }
		});
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

	handleDelete(itemId) {
		const itemToDelete = firebase.database().ref(`/items/${itemId}`);
		itemToDelete.remove();
	}

	// sets the items in state
	setItems(snapshot){
		if(!snapshot) {
			this.setState({items: []});
		}
		else {
			let items = snapshot.val();
			let newState = [];
			for (let item in items) {
				newState.push({
					id: item,
					title: items[item].title,
					name: items[item].user
				});
			}
			this.setState({
				items: newState
			});
		}
	}

	logout(){
		auth.signOut().then( () => {
			this.setState({user: null});
			this.setItems(null);
		});
	}

	login(){
		auth.signInWithPopup(provider).then( (result) => {
			const user = result.user;
			this.setState({ user });

			// refresh items
			const itemsRef = firebase.database().ref("items");
			itemsRef.once("value", function(data) { this.setItems(data) }.bind(this) );
		});
	}

	render() {
		return (
			<div className='app'>

				{/* App header */}
				<header>
					<div className='wrapper'>
						<h1>Fun Food Friends</h1>
						{this.state.user ?
							<div className='user-profile'>
								<img src={this.state.user.photoURL} />
								<button onClick={this.logout}>Log Out</button>
							</div>
							:
							<img src={'./images/btn_google_signin_light_normal_web.png'} onClick={this.login} className="btn"/>
						}
					</div>
				</header>

				{/* Input form */}
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

					{/* Item Wrapper */}
					<section className='display-item'>
						<div className='wrapper'>
							<ul>
								{this.state.items.map((item) => {
									return (
										<li key={item.id}>
											<h3>
												{item.title}
												<span onClick={() => this.handleDelete(item.id)}
												      className="remove-item pull-right">x</span>
											</h3>
											<p>{item.name}</p>
										</li>
									)
								})}
							</ul>
						</div>
					</section>

				</div>
			</div>
		);
	}
}

export default App;
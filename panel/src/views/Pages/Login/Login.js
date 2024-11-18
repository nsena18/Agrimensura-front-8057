import React, { Component } from 'react';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import auth from '../../../auth/';
import moment from 'moment';

import './Login.css';
// import logo from '../../../../public/img/logoParadigma.png';
import logo from '../../../../public/img/logo_large.png';
import logoParadigma from '../../../../public/img/logoParadigma.png';

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			showPassword: false,
			showError: false,
			isLoading: false
		}
	}

	componentDidMount() {

	}

	login = (e) => {
		e.preventDefault();
		this.setState(_ => ({ isLoading: true }));

		const { username, password } = this.state;
		auth.login(username, password, response => {
			if (response.success) {
				this.props.history.push('/');
			} else {
				this.setState(_ => ({ showError: true, isLoading: false }));
			}
		});
	}

	onUsernameChange = e => {
		e.persist();
		this.setState(prevState => ({
			showError: false,
			username: e.target.value
		}));
	}

	onPasswordChange = e => {
		e.persist();
		this.setState(prevState => ({
			showError: false,
			password: e.target.value
		}));
	}

	onShowPassword = e => {
		e.persist();
		this.setState(() => ({
			showPassword: e.type === 'mousedown'
		}));
	}

	render() {
		return (
			<div className="login-page w-100 h-100 position-absolute">
				<Container className="d-flex flex-column justify-content-center h-100" >
					<Row className="justify-content-center px-3 px-md-0">
						<Col xs="12" lg="6" xl="6">{/* Imagen */}</Col>
						<Col xs="12" lg="6" xl="5" className="login-form px-4 py-5 px-md-5">
							<div className="logo-paradigma">
								<img src={logo} height={100} style={{maxWidth:'100%'}} alt="Logo de la empresa" />
							</div>
							<hr />
							<h4 className="my-3">Acceso administrador</h4>
							<Form
								onSubmit={this.login}
							>
								<FormGroup>
									<Label for="username">Nombre de usuario ó email</Label>
									<Input
										id="username"
										type="text"
										value={this.state.username}
										onChange={this.onUsernameChange}
									/>
								</FormGroup>
								<FormGroup>
									<Label for="password">Contraseña</Label>
									<div className="password">
										<Input
											id="password"
											type={this.state.showPassword ? 'text' : 'password'}
											value={this.state.password}
											onChange={this.onPasswordChange}
										/>
										<Button
											onClick={e => e.preventDefault()}
											onMouseDown={this.onShowPassword}
											onMouseUp={this.onShowPassword}
											className="password__show-pw"
										>
											<i className={'fa ' + (!this.state.showPassword ? 'fa-eye' : 'fa-eye-slash')}></i>
										</Button>
									</div>

								</FormGroup>

								{this.state.showError &&
									<Alert color="danger">
										El usuario y/o contraseña son incorrectos.
                                    </Alert>
								}
								<div className="text-right">
									{this.state.isLoading &&
										<img className="mr-2" src="img/loader.gif" alt="Espere..." />
									}
									<Button className="btn-submit d-inline ml-auto ">
										{this.state.isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
									</Button>
								</div>
							</Form>
						</Col>
					</Row>
				</Container>

				<footer className="login-footer">
					<div className="float-right">© {moment().format('YYYY')}</div>
					<img src={logoParadigma} width={120} className="mx-2" alt="Logo Paradigma" />
				</footer>
			</div>
		);
	}
}

export default Login;
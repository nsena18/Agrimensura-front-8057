import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody, CardFooter, CardTitle, Form, Button, Alert, Label } from 'reactstrap';
import auth from '../../../auth/auth';
import { Redirect } from 'react-router-dom'
import logoParadigma from '../Login/paradigma-logo.svg';
import logoParadigmaHorizontal from '../Login/paradigma-horizontal.jpg';
import CustomInput from '../../../components/CustomInput/CustomInput';
import Checkbox from '../../../components/Checkbox/Checkbox';
import jsonToFormData from 'json-form-data';

import api from '../../../api/api';
import { post, get, patch } from '../../../api/functions';

import moment from 'moment';

class Register extends Component {
	constructor(props) {
		super(props);

		// const documento = localStorage.getItem('dni_cuit');

		this.state = {
			last_name: '',
			first_name: '',
			email: '',
			dni: '',
			username: '',
			password: '',
			password2: '',
			error: false,
			loading: false,
			success: false,
			redirect: false,
		}
	}

	currentYear = moment().format('YYYY');

	registrarse = e => {
		const { last_name, first_name, email, username, password, password2, dni } = this.state;
		if(last_name=='' || first_name=='' || email=='' || username=='' || password=='' || password2=='' || dni==''){
			this.setState({error: true, errormsj: 'Complete todos los campos'})
		}else if(password == password2){
			e.preventDefault();
			this.setState(
				() => ({ loading: true }), //cambiar a true
				() => {
					// const { documento: condocumento } = this.props;

					const formData = jsonToFormData({ last_name, first_name, email, username, password, dni });

					post(api.comitentes.createusercomitente, null, formData, ({ data }) => {
						this.setState({loading: false, success:true, 
										last_name: '',
										first_name: '',
										email: '',
										dni: '',
										username: '',
										password: '',
										password2: '',
										error: false,
										redirect: false,});
					}, ({ errors }) => {
						if (errors.length>0 && errors[0]==='UNIQUE constraint failed: auth_user.username'){
							this.setState({loading: false, error: true, errormsj: 'El nombre de usuario ya existe.'});
						}else{
							if(errors['email']){
								this.setState({loading: false, error: true, errormsj: 'El mail ya fue registrado'});
							}else{
								this.setState({loading: false, error: true, errormsj: 'Error al registrar el usuario'});
							}
						}
					}, ({ errors }) => {
						// this.handleError(errors);
						this.setState({loading: false});
					});

				}
			);
		}else{
			this.setState({error: true, errormsj: 'Las contraseñas no son iguales.'});
		}
	}

	setRedirect = () => {
		this.setState({
		  redirect: true
		})
	}

	renderRedirect = () => {
		if (this.state.redirect) {
			return <Redirect to='/login' />
		}
	}

	render() {
		const { last_name, first_name, email, username, password, password2, dni, error, loading, success } = this.state;
		return (
			<Container fluid>
				{this.renderRedirect()}
				<Row className="login" style={{ height: '100vh' }}>
					<Col xs={12} lg={6} xl={5} className="d-flex justify-content-center w-100">
						<Row className="d-flex justify-content-center align-items-center w-100">
							<Col className="login__col-card" xs={12} md={6} lg={9} xl={8}>
								<Card className={`login__card ${error ? 'login__card--failed' : ''}`}>
									<CardBody className="px-4 py-5 p-sm-5">
										<CardTitle className="text-center h3 mt-3 mb-5">
											{/* <img src={logoParadigma} width={200} alt="Logo de ECOL"/> */}
											<h3>Registro</h3>
										</CardTitle>
										<Form onSubmit={this.registrarse} autoComplete="off">

											<CustomInput
												autoFocus
												label="Apellido"
												disabled={loading}
												value={last_name}
												maxLength={50}
												onChange={(e)=>{this.setState({last_name: e})}}
												autoComplete="off"
												type="search"
											/>

											<CustomInput
												label="Nombre"
												disabled={loading}
												value={first_name}
												maxLength={50}
												onChange={(e)=>{this.setState({first_name: e})}}
												autoComplete="off"
												type="search"
											/>

											<CustomInput
												label="DNI"
												disabled={loading}
												value={dni}
												maxLength={10}
												onChange={(e)=>{this.setState({dni: e})}}
												autoComplete="off"
												type="integer"
											/>

											<CustomInput
												label="Email"
												disabled={loading}
												value={email}
												maxLength={80}
												onChange={(e)=>{this.setState({email: e})}}
												autoComplete="off"
												type="email"
											/>

											<CustomInput
												label="Usuario"
												disabled={loading}
												value={username}
												maxLength={30}
												onChange={(e)=>{this.setState({username: e})}}
												autoComplete="off"
												type="search"
											/>

											<CustomInput
												label="Contraseña"
												disabled={loading}
												type="password"
												maxLength={30}
												value={password}
												onChange={(e)=>{this.setState({password: e})}}
												autoComplete="off"
											/>

											<CustomInput
												label="Confirmar Contraseña"
												disabled={loading}
												type="password"
												maxLength={30}
												value={password2}
												onChange={(e)=>{this.setState({password2: e})}}
												autoComplete="off"
											/>

											{
												error &&
												<Alert
													color="danger"
													className="my-3 text-center"
												>
													<i className="fa fa-exclamation-circle mr-2"></i>
													{this.state.errormsj}
												</Alert>
											}

											{
												success &&
												<Alert
													color="success"
													className="my-3 text-center"
												>
													<i className="fa fa-exclamation-circle mr-2"></i>
													El usuario fue creado correctamente. Se le notificará por 
													mail cuando su cuenta haya sido autorizada y 
													esté disponible para empezar a utilizarla.
												</Alert>
											}

											<Button
												className="login__button btn-block shadow"
												disabled={loading}
												type="submit"
											>
												{
													loading ?
													<i class="fa fa-circle-o-notch fa-spin fa-fw"></i> :
													'Registrarse'
												}
											</Button>
											<Col xs={12} sm={12} className={'mt-2'}>
												<Label className={'btn-registrarse'} onClick={()=>this.setRedirect()}>Login</Label> 
											</Col>
										</Form>
									</CardBody>
									<CardFooter className="login__footer py-2 bg-white text-center">
										<img
											src={logoParadigmaHorizontal}
											alt="Logo Paradigma del Sur S.A."
											className="mr-2"
										/>
										®
										<small className="d-inline">
											{
												this.currentYear
											}
										</small>
									</CardFooter>
								</Card>
							</Col>
						</Row>
					</Col>
					<Col xs={12} lg={6} xl={7} className="text-white d-none d-lg-block px-0">
						<div className="login__bg">
							{/* <h1 className="display-1">
								Mentes <br/> trabajando.
							</h1> */}
						</div>
					</Col>
				</Row>
			</Container>
		);
	}
}

export default Register;
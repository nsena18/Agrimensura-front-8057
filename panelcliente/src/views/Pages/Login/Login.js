import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody, CardFooter, CardTitle, Form, Button, Alert, Label } from 'reactstrap';
import auth from '../../../auth/auth';
import { Redirect } from 'react-router-dom'

import logoParadigmaHorizontal from './paradigma-horizontal.jpg';
// import agrimensura from './agrimensura.png';
import agrimensura from '../../../../public/img/logo_large.png';
import CustomInput from '../../../components/CustomInput/CustomInput';
import Checkbox from '../../../components/Checkbox/Checkbox';

import Modal from "./Modal.js"

import moment from 'moment';

class Login extends Component {
	constructor(props) {
		super(props);

		const documento = localStorage.getItem('dni_cuit');

		this.state = {
			documento: documento || '',
			usuario: '',
			password: '',
			error: false,
			loading: false,
			recordar: !!documento,

			redirectRegister:false,
		}
	}

	currentYear = moment().format('YYYY');

	login = e => {
		e.preventDefault();
		this.setState(
			() => ({ loading: true }),
			() => {
				const { usuario, password, documento } = this.state;
				const { documento: conDocumento } = this.props;

				// Debe setearse en el proyecto el submódulo auth adecuado.
				if (conDocumento) {
					auth.login(usuario, password, this.handleLogin);
				} else {
					auth.login(usuario, password, this.handleLogin);
				}
			}
		);
	}

	handleLogin = ({ success }) => {
		if (success) {
			const { recordar, documento } = this.state;
			if (recordar) {
				localStorage.setItem('dni_cuit', documento);
			} else {
				localStorage.removeItem('dni_cuit');
			}
			this.props.history.push('/');
		} else {
			this.setState({
				error: true,
				loading: false
			});
		}
	}

	handleDocumentoChange = documento => {
		this.setState({ documento, error: false });
	}

	handleUsuarioChange = usuario => {
		this.setState({ usuario, error: false });
	}

	handlePasswordChange = password => {
		this.setState({ password, error: false });
	}

	setRedirect = () => {
		this.setState({
			redirectRegister: true
		})
	}

	renderRedirect = () => {
		if (this.state.redirectRegister) {
			return <Redirect to='/register' />
		}
	}

	render() {
		const { documento, usuario, password, error, loading, recordar } = this.state;
		const { documento: conDocumento } = this.props;
		return (
			<div className="login__bg">
			<Container className="d-flex flex-column justify-content-center h-100" >
				{this.renderRedirect()}
				<Row className="justify-content-center px-3 px-md-0">
				
					<Col xs="12" lg="6" xl="5" className="px-4 py-5 px-md-5">
						<Row className="d-flex justify-content-center align-items-center w-100">
							<Col className="login__col-card" xs={12} md={6} lg={9} xl={8}>
								{/* <h1 className="title-login">
									Portal Profesional
								</h1> */}
								<Card className={`login__card ${error ? 'login__card--failed' : ''}`}>
									<CardBody className="px-4 py-5 p-sm-5">
										<CardTitle className="text-center h3 mt-3 mb-5">
											<img src={agrimensura} width={280} alt="Logo de ECOL"/>
										</CardTitle>
										<Form onSubmit={this.login} autoComplete="off">
											{
												conDocumento &&
												<Row>
													<Col xs={12} sm={9}>
														<CustomInput
															label="Documento"
															disabled={loading}
															type="dni"
															autoFocus
															value={documento}
															onChange={this.handleDocumentoChange}
															className="my-0"
														/>
													</Col>
													<Col xs={12} sm={3} className="d-flex justify-content-end align-items-center pl-sm-0">
														<Checkbox
															label="Recordar"
															checked={recordar}
															onChange={recordar => this.setState({ recordar })}
															className="d-block text-right"
														/>
													</Col>
												</Row>
											}

											<CustomInput
												autoFocus
												label="Usuario"
												disabled={loading}
												value={usuario}
												onChange={this.handleUsuarioChange}
												autoComplete="off"
												type="search"
												/>
											<CustomInput
												label="Contraseña"
												disabled={loading}
												type="password"
												value={password}
												onChange={this.handlePasswordChange}
												autoComplete="off"
											/>

											{
												error &&
												<Alert
													color="danger"
													className="my-3 text-center"
												>
													<i className="fa fa-exclamation-circle mr-2"></i>
													El usuario y/o contraseña son incorrectos.
												</Alert>
											}

											<Button
												className="login__button btn-block shadow"
												disabled={loading}
												type="submit"
											>
												{
													loading ?
													<i className="fa fa-circle-o-notch fa-spin fa-fw"></i> :
													'Acceder'
												}
											</Button>
											<Col xs={12} sm={12} className={'mt-2'}>
												<Modal action="CREATE" />
											</Col>
											<Col xs={12} sm={12} /*className={'mt-2'}*/>
												{/* <Label className={'btn-registrarse'} onClick={()=>this.setRedirect()}>Registrarse</Label>  */}
												<Button onClick={()=>this.setRedirect()} className={'forgottenPass icon btn btn-sm h-100'}>Registrarse</Button>
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
					<Col xs="12" lg="6" xl="6"/>
				
					{/* <Col xs={12} lg={6} xl={7} className="text-white d-none d-lg-block px-0">
						<div className="login__bg">
						{<h1 className="display-1">
								Gestión <br/> de pedidos.
							</h1>}
						</div>
					</Col> */}
				</Row>
			</Container>
			</div>
		);
	}
}

export default Login;
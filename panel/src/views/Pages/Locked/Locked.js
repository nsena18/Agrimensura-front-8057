import React, { Component } from 'react';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import auth from '../../../auth/';
import { BeatLoader } from 'react-spinners';

import './Locked.css';

class Locked extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            showPassword: false,
            showError: false,
            isLoading: false,
            token: null,
            loading: true,
        }
        auth.clearToken(x => this.setState({ token: x.token, username: x.displayname, loading: false }));
    }

    login = (e) => {
        e.preventDefault();
        this.setState(_ => ({ isLoading: true }));
        const { token, username, password } = this.state;
        auth.sessionTimeoutLogin(token, password, response => {
            if (response.success) {
                this.props.history.push('/');
            } else {
                this.setState(_ => ({ showError: true, isLoading: false }));
            }
        });
    }

    onPasswordChange = e => {
        e.persist();
        this.setState(prevState => ({
            showError: false,
            password: e.target.value
        }));
    }

    onShowPassword = e => {
        e.preventDefault();

        this.setState(() => ({
            showPassword: true
        }));
    }

    onHidePassword = e => {
        e.preventDefault();

        this.setState(() => ({
            showPassword: false
        }));
    }

    render() {
        return (
            <div className="login-page w-100 h-100 position-absolute">
                <Container className="d-flex flex-column justify-content-center h-100" >
                    <Row className="justify-content-center px-3 px-md-0">
                        <Col xs="12" lg="6" xl="6"></Col>
                        <Col xs="12" lg="6" xl="5" className="login-form px-4 py-5 px-md-5">
                            <BeatLoader color={'#123abc'} loading={this.state.loading} />
                            {!this.state.loading &&
                                <Form onSubmit={this.login} >
                                    <FormGroup>
                                        <Label for="username">Nombre de usuario ó email</Label>
                                        <Input
                                            id="username"
                                            type="text"
                                            value={this.state.username}
                                            onChange={this.onUsernameChange}
                                            readOnly
                                            disabled
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
                                                onMouseUp={this.onHidePassword}
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
                                        <Button className="btn-submit d-inline ml-auto "
                                            disabled={this.state.password != '' ? false : true}
                                        >
                                            {this.state.isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                                        </Button>
                                    </div>
                                </Form>
                            }
                        </Col>
                    </Row>
                </Container>

                <footer className="login-footer">
                    <div className="float-right">© 2018</div>
                    <div className="logoParadigma"></div>
                </footer>
            </div>
        );
    }
}

export default Locked;
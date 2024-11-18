import React, { Component, Fragment } from 'react';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import auth from '../../../auth/';
import { BeatLoader } from 'react-spinners';
import moment from 'moment';

import axios from "axios";
import api from "../../../api/api";
import apifunctions from "../../../api/functions.js";

import './ChangePassword.css';
import logo from '../../../../public/img/logoParadigma.png';
import logoParadigma from '../../../../public/img/logoParadigma.png';

import ParadigmaLabeledInput from "../../../components/ParadigmaLabeledInput/ParadigmaLabeledInput.js"


class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user_id:'',
            user_email:'',
            passwords: [
                /*{
                    label: "Contraseña actual",
                    value: '',
                    field: "actual_password",
                    show: false,
                    error: false,
                },*/
                {
                    label: "Nueva contraseña",
                    value: '',
                    field: "new_password",
                    show: false,
                    error: false,
                },
                {
                    label: "Repetir nueva contraseña",
                    value: '',
                    field: "repeat_new_password",
                    show: false,
                    error: false,
                }
            ],
            email: '',
            isLoading: false,
            token: null,
            loading: false,
            postVariables: ['passwords', 'mail'],
            errors:[],
        }
    }

    onTogglePassword(field, visible) {
        this.setState(prevState => {
            prevState.passwords.find(x => x.field == field).show = visible;
            return prevState;
        })
    }

    onChangePassword(field, e) {
        let new_value = e.target.value;
        this.setState(prevState => {
            prevState.passwords.find(x => x.field == field).value = new_value;
            return prevState;
        })
    }

    onChangeField(field, value) {
        this.setState(prevState => {
            let errors = prevState.errors;
            if (errors) errors[field] = null;
            prevState.errors = errors;
                prevState[field] = value;
            return prevState;
        });
    }

    errorsApiFunction = (e) => {

        this.setState({ isLoading: false});

    }

    errorSubmit = (field, value) => {
        let error = this.state.errors;
        error[field] = [{'code': 'invalid', 'detail' : value}];
        this.setState({
            errors: error,
            isLoading: false,
        })
    }

    submit = (e) => {
        e.preventDefault();
        this.setState(_ => ({ isLoading: true }), () => {
            const { passwords, user_email, user_id, email, token } = this.state;
            if ((user_email == email) && (passwords[0].value == passwords[1].value)){
                let data= {};
                data.new_password=passwords[0].value;
                data.repeat_new_password=passwords[1].value;
                data.user_email= this.state.email;
                data.user_id= user_id;

                axios.patch(api.usuarios.forgottenpassdetail.replace("$token", token), data).then(response => {
                    let data = response.data;
                    if ((data.data) && (data.data == true)){
                        this.props.history.push('/login');
                    }
                });

            }else{
                if (user_email != email){
                    this.errorSubmit('email', 'El email ingresado no coincide')
                }
                if (passwords[0].value != passwords[1].value){
                    this.errorSubmit('repeat_new_password', 'Las contraseñas no coinciden')
                }
                
            }

        });
    }

    componentDidMount = () => {
        let params = new URLSearchParams(location.hash);
        var token = params.get('token');
        axios.get(api.usuarios.forgottenpassdetail.replace("$token", token)).then(response => {
            let data = response.data.data;
            
            if (data!=false){
                this.setState({
                    user_email: data.email,
                    user_id: data.id,
                    token: token,
                });
            }else{
                this.props.history.push('/');
            }

        });
        document.body.classList.add('bgBody');
    }
    
    componentWillUnmount = () =>{
        document.body.classList.remove('bgBody');
    }

    render() {
        const { passwords, user_email, user_id, errors } = this.state;
        return (
            <div className="login-page w-100 h-100 position-absolute">
                <Container className="d-flex flex-column justify-content-center h-100" >
                    <Row className="justify-content-center px-3 px-md-0">
                        <Col xs="12" lg="6" xl="6"></Col>
                        <Col xs="12" lg="6" xl="5" className="login-form px-4 py-5 px-md-5">
                            <BeatLoader color={'#123abc'} loading={this.state.loading} />
                            {!this.state.loading &&
                                <Form onSubmit={this.submit} >
                                    <h3 className={'mb-4 tit_changepass'}>Reestablecer Contraseña</h3>
                                    <FormGroup key={0}>
                                        <ParadigmaLabeledInput
                                                label={'Email'}
                                                id={'email'}
                                                value={this.state.email}
                                                type={'email'}
                                                onChange={(e) => this.onChangeField('email',e.target.value)}
                                                error={(this.state.errors ? this.state.errors.email : null)}
                                                
                                            />
                                    </FormGroup>
                                    <hr className={'hr_formlog'}/>
                                    {passwords.map((x, i) =>
                                        <FormGroup key={i+1}>

                                        <ParadigmaLabeledInput
                                                label={x.label}
                                                error={(this.state.errors ? this.state.errors.repeat_new_password : null)}
                                                inputComponent={
                                                    <Fragment>
                                                        <Input
                                                        id={x.field}
                                                        type={x.show ? 'text' : 'password'}
                                                        value={x.value}
                                                        onChange={(e) => this.onChangePassword(x.field, e)}
                                                        />
                                                        <a
                                                            onClick={e => e.preventDefault()}
                                                            onMouseDown={() => this.onTogglePassword(x.field, true)}
                                                            onMouseUp={() => this.onTogglePassword(x.field, false)}
                                                            className="btn password__show-pw"
                                                        >
                                                            <i className={'fa ' + (!x.show ? 'fa-eye' : 'fa-eye-slash')}></i>
                                                        </a>
                                                    </Fragment>
                                                }
                                            />

                                        </FormGroup>
                                    )}
                                    <div className="text-right">
                                        {this.state.isLoading &&
                                            <img className="mr-2" src="img/loader.gif" alt="Espere..." />
                                        }
                                        <Button disabled={passwords.filter(x => x.value === "").length > 0}
                                            className="btn-submit d-inline ml-auto ">
                                            {this.state.isLoading ? 'Guardando cambios...' : 'Cambiar contraseña'}
                                        </Button>
                                    </div>
                                </Form>
                            }
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

export default ChangePassword;
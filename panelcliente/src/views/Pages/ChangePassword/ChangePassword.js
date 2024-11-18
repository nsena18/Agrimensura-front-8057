import React, { Component, Fragment } from 'react';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button, Alert, UncontrolledTooltip } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import auth from '../../../auth/';
import { BeatLoader } from 'react-spinners';
import moment from 'moment';

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
            passwords: [
                {
                    label: "Contraseña actual",
                    value: '',
                    field: "actual_password",
                    show: false,
                    error: false,
                },
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
            errors:{},
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

    functionSuccess= (response) => 
    {
        if(response.errors){
            this.setState({errors: response.errors[0],
                            isLoading: false})
        }
        else
            if(response.data.changed)
                this.props.history.push('/')
    }

    submit = (e) => {
        e.preventDefault();
        this.setState(_ => ({ isLoading: true }), () => {
            const { passwords } = this.state;

            let data= {};
            data.actual_password=passwords[0].value;
            data.new_password=passwords[1].value;
            data.repeat_new_password=passwords[2].value;
            data.email= this.state.email;
            apifunctions.post(api.firstLogin, null, data, this.functionSuccess, this.functionSuccess);
            
        });
    }

    componentDidMount = () =>{
        document.body.classList.add('bgBody');
    }
    
    componentWillUnmount = () =>{
        document.body.classList.remove('bgBody');
    }

    render() {
        const { passwords, errors } = this.state;
        return (
            <div className="login-page w-100 h-100 position-absolute">
                <Container className="d-flex flex-column justify-content-center h-100" >
                    <Row className="justify-content-center px-3 px-md-0">
                        <Col xs="12" lg="6" xl="6"></Col>
                        <Col xs="12" lg="6" xl="5" className="login-form px-4 py-5 px-md-5">
                            <BeatLoader color={'#123abc'} loading={this.state.loading} />
                            {!this.state.loading &&
                                <Form onSubmit={this.submit} >
                                    <h3 className={'mb-4 tit_changepass'}>Cambio de Contraseñas</h3>
                                    <FormGroup key={0}>
                                        <ParadigmaLabeledInput
                                            //md={[2, 10]}
                                            label={<div><label>{'Email'}</label><i id="tooltipEmail" class="fa fa-question-circle fa-lg ml-2"></i></div>}
                                            //disabled={true}
                                            type={"Email"}
                                            value={this.state.email}
                                            onChange={(e) => this.onChangeField('email',e.target.value)}
                                            error={(errors ? errors.email : null)}
                                        />
                                        <UncontrolledTooltip placement="bottom" target="tooltipEmail">
                                            Mail al cual le llegarán las notificaciones de los pedidos.
                                        </UncontrolledTooltip>
                                    </FormGroup>
                                    {passwords.map((x, i) =>
                                        <FormGroup key={i+1}>
                                        <ParadigmaLabeledInput
                                            label={x.label}
                                            error={(errors ? errors[x.field] : null)}
                                            
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
                                            </Fragment>}
                                         />
                                         {i===0 && <hr className={'hr_formlog'}/>}
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
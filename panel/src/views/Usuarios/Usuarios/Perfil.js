import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ParadigmaModal from "../../../components/ParadigmaModal/ParadigmaModal.js"
import api from "../../../api";


import PermisosListSelect from "../Permisos/PermisosListSelect.js"

import ParadigmaAsyncSeeker from "../../../components/ParadigmaAsyncSeeker/ParadigmaAsyncSeeker.js"
import ParadigmaLabeledInput from "../../../components/ParadigmaLabeledInput/ParadigmaLabeledInput.js"


import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col, Label, Input, InputGroup, FormFeedback } from 'reactstrap';

class Perfil extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 1,
            permisos_checked: [],
            permisos_disabled: [],

            last_name: "",
            first_name: "",
            username: "",
            email: "",
            password: "",
            password2: "",
            grupos: [],
            errors: {},
            postVariables: ['last_name', 'first_name', 'password'],
        };
    }

    static propTypes = {
        onOpen: PropTypes.func,
        onClose: PropTypes.func,
    }

    resetForm() {
        this.setState({
            activeTab: 1,
            permisos_checked: [],
            permisos_disabled: [],
            errors: {},

            last_name: "",
            first_name: "",
            username: "",
            email: "",
            password: "",
            password2: "",
            grupos: [],
        });
    }

    validate() {
        const { password, password2 } = this.state;
        if (password != password2) {
            this.setState(prevState => {
                prevState.errors['password2'] = [{
                    code: "invalid",
                    detail: "Las contraseñas deben ser iguales"
                }];
                return prevState;
            })
            return false;
        }
        return true;
    }

    getData() {
        const { action } = this.props;
        const { grupos, postVariables, permisos_checked, permisos_disabled } = this.state;
        let data = {};
        postVariables.forEach(x => {
            if (x != 'password' || this.state[x].length > 0)
                data[x] = this.state[x];
        });
        //data['grupos'] = grupos;
        //let permisos = permisos_checked.map(x => parseInt(x)).filter(x => permisos_disabled.filter(y => y === x).length == 0);
        //data['permisos'] = permisos;
        return data;
    }

    setData(data) {
        this.setState({
            permisos_checked: (data.permisos ? data.permisos.map(x => x.id) : []),
            permisos_disabled: (data.grupos ? this.parseGrupos(data.grupos) : []),

            last_name: data.last_name,
            first_name: data.first_name,
            username: data.username,
            email: data.email,
            grupos: (data.grupos ? data.grupos.map(x => x.id) : []),
        });
    }


    parseGrupos(grupos) {
        let permisos = grupos.map(x => x.permisos);
        if (permisos.length > 0)
            permisos = permisos.reduce(
                (result, next) => result.concat(
                    next.filter(nextEl =>
                        result.filter(resultEl => resultEl == nextEl).length == 0)
                )
            );
        return permisos.map(x => x.id);
    }

    setErrors(errors) {
        this.setState({
            errors: errors,
        });
    }

    render() {
        return (
            <ParadigmaModal
                navButton={true}
                nav={({
                    name: 'Perfil',
                    icon: 'fa fa-user',
                    tag: 'button',
                    className: 'dropdown-item'
                })}

                getUrl={api.usuarios.perfil}
                submitUrl={api.usuarios.perfil}
                submitType={"PATCH"}

                onOpen={() => (this.props.onOpen ? this.props.onOpen() : null)}
                onGotData={(data) => this.setData(data)}
                onClose={() => { (this.props.onClose ? this.props.onClose() : null); this.resetForm(); }}
                onValidation={() => this.validate()}
                onGotErrors={(errors) => this.setErrors(errors)}
                onCleanForm={() => this.resetForm()}
                onPreSubmit={() => this.getData()}

                title={"Editar Perfil"}

                successMessage={"El Usuario ha sido editado con éxito."}
                missingIdMessage={"Debe seleccionar una fila."}

                saveButton={true}
                closeButton={true}
                className="modal-tabs"

                escClose={true}
            >
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={(this.state.activeTab == 1 ? "active" : "")}
                            onClick={() => { this.setState({ activeTab: 1 }) }}
                        >Usuario</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={(this.state.activeTab == 2 ? "active" : "")}
                            onClick={() => { this.setState({ activeTab: 2 }) }}
                        >Permisos</NavLink>
                    </NavItem>
                </Nav>
                <TabContent
                    activeTab={this.state.activeTab}
                    className={"py-2"}>
                    <TabPane tabId={1} className="py-0">
                        <ParadigmaLabeledInput
                            md={[2, 10]}
                            label={"Apellido"}
                            value={this.state.last_name}
                            onChange={(e) => {
                                let errors = this.state.errors;
                                if (errors) errors.last_name = null;
                                this.setState({ last_name: e.target.value, errors: errors });
                            }}
                            error={(this.state.errors ? this.state.errors.last_name : null)}
                        />
                        <ParadigmaLabeledInput
                            md={[2, 10]}
                            label={"Nombre"}

                            value={this.state.first_name}
                            onChange={(e) => {
                                let errors = this.state.errors;
                                if (errors) errors.first_name = null;
                                this.setState({ first_name: e.target.value, errors: errors });
                            }}
                            error={(this.state.errors ? this.state.errors.first_name : null)}
                        />
                        <ParadigmaLabeledInput
                            md={[2, 10]}
                            label={"Usuario"}
                            disabled={true}

                            value={this.state.username}
                            onChange={(e) => {
                                let errors = this.state.errors;
                                if (errors) errors.username = null;
                                this.setState({ username: e.target.value, errors: errors });
                            }}
                            error={(this.state.errors ? this.state.errors.username : null)}
                        />
                        <ParadigmaLabeledInput
                            md={[2, 10]}
                            label={"Email"}
                            disabled={true}

                            value={this.state.email}
                            onChange={(e) => {
                                let errors = this.state.errors;
                                if (errors) errors.email = null;
                                this.setState({ email: e.target.value, errors: errors });
                            }}
                            error={(this.state.errors ? this.state.errors.email : null)}
                        />
                        <Row className="mt-1">
                            <Col className="col-12 col-sm-6">
                                <ParadigmaLabeledInput
                                    label={"Contraseña"}
                                    type={"password"}

                                    value={this.state.password}
                                    onChange={(e) => {
                                        let errors = this.state.errors;
                                        if (errors) errors.password = null;
                                        this.setState({ password: e.target.value, errors: errors });
                                    }}
                                    error={(this.state.errors ? this.state.errors.password : null)}
                                />
                            </Col>
                            <Col className="col-12 col-sm-6">
                                <ParadigmaLabeledInput
                                    label={"Repetir Contraseña"}
                                    type={"password"}

                                    value={this.state.password2}
                                    onChange={(e) => {
                                        let errors = this.state.errors;
                                        if (errors) errors.password2 = null;
                                        this.setState({ password2: e.target.value, errors: errors });
                                    }}
                                    error={(this.state.errors ? this.state.errors.password2 : null)}
                                />
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId={2} className="py-0">
                        <ParadigmaLabeledInput
                            md={[2, 10]}
                            label={"Grupos"}
                            inputComponent={
                                <ParadigmaAsyncSeeker
                                    disabled={true}
                                    multiselect={true}
                                    onChange={(value) => this.onGroupChange(value)}
                                    url={api.usuarios.grupos + "?fields=id,nombre,permisos"}
                                    value={this.state.grupos}
                                />
                            }
                            error={(this.state.errors ? this.state.errors.grupos : null)}
                        />
                        <Row className="mt-2">
                            <Col className="col-12">
                                <Label>Permisos</Label>
                                <PermisosListSelect
                                    disabled={true}
                                    disabledNodes={this.state.permisos_disabled}
                                    onChange={(value) => this.setState({ permisos_checked: value })}
                                    checked={this.state.permisos_checked}
                                    fieldName={"permisos"}
                                />
                            </Col>
                        </Row>
                    </TabPane>
                </TabContent>
            </ParadigmaModal>
        );
    }
}

export default Perfil;


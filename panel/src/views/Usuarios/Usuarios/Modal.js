import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ParadigmaModal from "../../../components/ParadigmaModal/ParadigmaModal.js"
import api from "../../../api";

import PermisosListSelect from "../Permisos/PermisosListSelect.js"


import ParadigmaAsyncSeeker from "../../../components/ParadigmaAsyncSeeker/ParadigmaAsyncSeeker.js"
import ParadigmaLabeledInput from "../../../components/ParadigmaLabeledInput/ParadigmaLabeledInput.js"


import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col, Label, Input, InputGroup, FormFeedback } from 'reactstrap';

class Edit extends Component {
    constructor(props) {
        super(props);

        const { additionalFields, action } = this.props;
        let addFieldsDefaultState = {};
        if (additionalFields && action === 'CREATE') {
            for (var i = 0; i < additionalFields.length; i++) {
                const { name, default: defaultValue } = additionalFields[i];
                if (defaultValue) {
                    addFieldsDefaultState[name] = defaultValue;
                }
            }
        }

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

            postVariables: ['last_name', 'first_name', 'username', 'email', 'password'],
            ...addFieldsDefaultState,
        };
    }

    static propTypes = {
        onSubmit: PropTypes.func,
        id: PropTypes.func,
        action: PropTypes.oneOf(['CREATE', 'EDIT', 'DETAIL', 'DELETE', 'LOCK', 'UNLOCK']).isRequired,
        additionalFields: PropTypes.arrayOf(PropTypes.shape({
            getField: PropTypes.string,
            postField: PropTypes.string,
            Input: PropTypes.func,
            disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func])
        })),
    }

    resetForm() {
        // Setea la data por defecto para los campos adicionales
        const { additionalFields } = this.props;
        let addFieldsDefaultState = {};
        if (additionalFields) {
            for (var i = 0; i < additionalFields.length; i++) {
                const { name, default: defaultValue } = additionalFields[i];
                addFieldsDefaultState[name] = defaultValue;
            }
        }

        this.setState({
            activeTab: 1,
            permisos_checked: [],
            permisos_disabled: [],
            errors: [],

            last_name: "",
            first_name: "",
            username: "",
            email: "",
            password: "",
            password2: "",
            grupos: [],

            errors: {},
            ...addFieldsDefaultState,
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
        if (action == "LOCK") {
            return {
                'is_active': false,
            };
        } if (action == "UNLOCK") {
            return {
                'is_active': true,
            };
        } else {
            let data = {};
            postVariables.forEach(x => {
                if (x != 'password' || this.state[x].length > 0)
                    data[x] = this.state[x];
            });
            data['grupos_id'] = grupos;
            let permisos = permisos_checked.map(x => parseInt(x)).filter(x => permisos_disabled.filter(y => y === x).length == 0);
            data['permisos_id'] = permisos;

            // Setea la data por defecto para los campos adicionales
            const { additionalFields } = this.props;
            let addFieldsData = {};
            if (additionalFields) {
                for (var i = 0; i < additionalFields.length; i++) {
                    const { onPost } = additionalFields[i];
                    if (onPost) {
                        addFieldsData = {
                            ...addFieldsData,
                            ...onPost(this.state),
                        }
                    }
                }
            }

            return {
                ...data,
                ...addFieldsData,
            };
        }
    }

    setData(data) {
        // Setea la data por defecto para los campos adicionales
        const { additionalFields } = this.props;
        let addFieldsData = {};
        if (additionalFields) {
            for (var i = 0; i < additionalFields.length; i++) {
                const { onGet } = additionalFields[i];
                if (onGet) {
                    addFieldsData = {
                        ...addFieldsData,
                        ...onGet(data),
                    }
                }
            }
        }

        this.setState({
            permisos_checked: (data.permisos ? data.permisos.map(x => x.id) : []),
            permisos_disabled: (data.grupos ? this.parseGrupos(data.grupos) : []),

            last_name: data.last_name,
            first_name: data.first_name,
            username: data.username,
            email: data.email,
            grupos: (data.grupos ? data.grupos.map(x => x.id) : []),
            ...addFieldsData,
        });
    }

    setErrors(errors) {
        this.setState({
            errors: errors,
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

    onGroupChange(value) {
        let errors = this.state.errors;
        if (errors) errors.grupos = null;
        if (value) {
            this.setState({
                grupos: value.map(x => x.id),
                permisos_disabled: this.parseGrupos(value),
                permisos_checked: [],
                errors: errors
            });
        } else {
            this.setState({
                grupos: [],
                permisos_disabled: [],
                permisos_checked: [],
                errors: errors
            });
        }
    }


    modalVars() {
        const { action } = this.props;
        if (action == "CREATE") {
            return {
                get: false,
                submitType: "POST",
                title: "Nuevo Usuario",
                buttonTitle: "Nuevo",
                danger: false,
                buttonIcon: "fa fa-plus fa-lg",
                successMessage: "El Usuario ha sido creado con éxito.",
                saveButton: true,
                buttonClass: "",
                saveButtonLabel: "Guardar",
                disabled: false,
            };
        } else if (action == "EDIT") {
            return {
                get: true,
                submitType: "PATCH",
                title: "Editar Usuario",
                buttonTitle: "Editar",
                danger: false,
                buttonIcon: "fa fa-pencil fa-lg",
                successMessage: "El Usuario ha sido editado con éxito.",
                saveButton: true,
                buttonClass: "",
                saveButtonLabel: "Guardar",
                disabled: false,
                id: this.props.id,
            };
        } else if (action == "DETAIL") {
            return {
                get: true,
                submitType: null,
                title: "Usuario",
                buttonTitle: "Ver",
                danger: false,
                buttonIcon: "fa fa-search fa-lg",
                successMessage: "",
                saveButton: false,
                saveButtonLabel: "",
                buttonClass: "",
                disabled: true,
                id: this.props.id,
            };
        } else if (action == "DELETE") {
            return {
                get: true,
                submitType: "DELETE",
                title: "Eliminar Usuario",
                buttonTitle: "Eliminar",
                danger: true,
                buttonIcon: "fa fa-trash fa-lg",
                successMessage: "El Usuario ha sido eliminado con éxito.",
                saveButton: true,
                saveButtonLabel: "Eliminar",
                buttonClass: "btn-danger",
                disabled: true,
                id: this.props.id,
            };
        } else if (action == "LOCK") {
            return {
                get: true,
                submitType: "PATCH",
                title: "Deshabilitar Usuario",
                buttonTitle: "Deshabilitar",
                danger: false,
                warning: true,
                buttonIcon: "fa fa-lock fa-lg",
                successMessage: "El Usuario ha sido deshabilitado con éxito.",
                saveButton: true,
                saveButtonLabel: "Deshabilitar",
                buttonClass: "btn-warning",
                disabled: true,
                id: this.props.id,
            };
        } else if (action == "UNLOCK") {
            return {
                get: true,
                submitType: "PATCH",
                title: "Habilitar Usuario",
                buttonTitle: "Habilitar",
                danger: false,
                warning: true,
                buttonIcon: "fa fa-unlock fa-lg",
                successMessage: "El Usuario ha sido habilitado con éxito.",
                saveButton: true,
                saveButtonLabel: "Habilitar",
                buttonClass: "btn-warning",
                disabled: true,
                id: this.props.id,
            };
        }
    }

    render() {
        let vars = this.modalVars();
        const { additionalFields } = this.props;
        return (
            <ParadigmaModal
                getUrl={(vars.get ? api.usuarios.usuarios : null)}
                submitUrl={(vars.submitType ? api.usuarios.usuarios : null)}
                submitType={vars.submitType}
                id={vars.id}

                onGotData={(data) => this.setData(data)}
                onGotErrors={(errors) => this.setErrors(errors)}
                onSubmit={(e) => this.props.onSubmit(e)}
                onClose={() => this.resetForm()}
                onPreSubmit={() => this.getData()}
                onValidation={() => this.validate()}

                title={vars.title}
                danger={vars.danger}
                warning={vars.warning}

                successMessage={vars.successMessage}
                missingIdMessage={"Debe seleccionar una fila."}

                buttonTitle={vars.buttonTitle}
                buttonClass={vars.buttonClass}
                buttonIcon={vars.buttonIcon}
                saveButton={vars.saveButton}
                saveButtonLabel={vars.saveButtonLabel}
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
                            disabled={vars.disabled}
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
                            disabled={vars.disabled}
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
                            disabled={vars.disabled}
                            md={[2, 10]}
                            label={"Usuario"}

                            value={this.state.username}
                            onChange={(e) => {
                                let errors = this.state.errors;
                                if (errors) errors.username = null;
                                this.setState({ username: e.target.value, errors: errors });
                            }}
                            error={(this.state.errors ? this.state.errors.username : null)}
                        />
                        <ParadigmaLabeledInput
                            disabled={vars.disabled}
                            md={[2, 10]}
                            label={"Email"}

                            value={this.state.email}
                            onChange={(e) => {
                                let errors = this.state.errors;
                                if (errors) errors.email = null;
                                this.setState({ email: e.target.value, errors: errors });
                            }}
                            error={(this.state.errors ? this.state.errors.email : null)}
                        />

                        {
                            additionalFields &&
                            additionalFields.map((addField, i) => {
                                return (
                                    <Fragment key={i}>
                                        {
                                            addField.Input(
                                                this.state, // state
                                                newValue => this.setState(prevState => {
                                                    let newState = {};
                                                    newState[addField.name] = newValue;

                                                    // resetea el error
                                                    if (prevState.errors && prevState.errors[addField.name]) {
                                                        delete prevState.errors[addField.name];
                                                    }
                                                    return {
                                                        ...prevState,
                                                        ...newState,
                                                    };
                                                }),
                                                vars.disabled, // disabled
                                                (this.state.errors ? this.state.errors[addField.name] : null), // error
                                                (newState, callback = null) => this.setState(newState, callback)
                                            ) // setter de este campo
                                        }
                                    </Fragment>
                                );
                            })
                        }

                        {!vars.disabled &&
                            <Row className="mt-1">
                                <Col className="col-12 col-sm-6">
                                    <ParadigmaLabeledInput
                                        disabled={vars.disabled}
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
                                        disabled={vars.disabled}
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
                        }
                    </TabPane>
                    <TabPane tabId={2} className="py-0">
                        <ParadigmaLabeledInput
                            md={[2, 10]}
                            label={"Grupos"}
                            inputComponent={
                                <ParadigmaAsyncSeeker
                                    disabled={vars.disabled}
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
                                    disabled={vars.disabled}
                                    disabledNodes={this.state.permisos_disabled}
                                    onChange={(value) => this.setState({ permisos_checked: value })}
                                    checked={this.state.permisos_checked}
                                />
                            </Col>
                        </Row>
                    </TabPane>
                </TabContent>
            </ParadigmaModal>
        );
    }
}

export default Edit;


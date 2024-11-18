import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ParadigmaModal from "../../../components/ParadigmaModal/ParadigmaModal.js"
import api from "../../../api";

import { Row, Col, Label, Input, InputGroup, FormFeedback } from 'reactstrap';

import ParadigmaLabeledInput from "../../../components/ParadigmaLabeledInput/ParadigmaLabeledInput.js"
import ParadigmaAsyncSeeker from "../../../components/ParadigmaAsyncSeeker/ParadigmaAsyncSeeker.js"

class Modal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            nombre: "",
            host: "",
            username: "",
            password: "",
            port: "",
            postVariables: ['nombre', 'host', 'username', 'password', 'port'],
            errors: [],
        };
    }

    static propTypes = {
        onSubmit: PropTypes.func,
        id: PropTypes.func,
        action: PropTypes.oneOf(['CREATE', 'EDIT', 'DETAIL', 'DELETE']).isRequired,
    }


    resetForm() {
        this.setState({
            id: null,
            nombre: "",
            host: "",
            username: "",
            password: "",
            port: "",
            errors: [],
        });
    }

    getData() {
        const { postVariables } = this.state;
        let data = {};
        postVariables.forEach(x => {
            data[x] = this.state[x];
        });

        return data;
    }

    setData(data) {
        if (data.success) {
            this.setState({
                id: data.id,
                nombre: data.nombre,
                host: data.host,
                username: data.username,
                password: data.password,
                port: data.port,
            })
        }
    }

    setErrors(errors) {
        this.setState({
            errors: errors,
        });
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

    getError(field) {
        let errors = this.state.errors;
        if (errors) return errors[field];
        else return null;
    }

    modalVars() {
        const { action } = this.props;
        if (action == "CREATE") {
            return {
                get: false,
                submitType: "POST",
                title: "Nueva Casilla",
                buttonTitle: "Nuevo",
                danger: false,
                buttonIcon: "fa fa-plus fa-lg",
                successMessage: "La Casilla ha sido creada con éxito.",
                saveButton: true,
                saveButtonLabel: "Guardar",
                buttonClass: "",
                disabled: false,
            };
        } else if (action == "EDIT") {
            return {
                get: true,
                submitType: "PUT",
                title: "Editar Casilla",
                buttonTitle: "Editar",
                danger: false,
                buttonIcon: "fa fa-pencil fa-lg",
                successMessage: "La Casilla ha sido editada con éxito.",
                saveButton: true,
                saveButtonLabel: "Guardar",
                buttonClass: "",
                disabled: false,
                id: this.props.id,
            };
        } else if (action == "DETAIL") {
            return {
                get: true,
                submitType: null,
                title: "Casilla",
                buttonTitle: "Ver",
                cancelButtonLabel:"Cerrar",
                danger: false,
                buttonIcon: "fa fa-search fa-lg",
                successMessage: "",
                saveButton: false,
                buttonClass: "",
                disabled: true,
                id: this.props.id,
            };
        } else if (action == "DELETE") {
            return {
                get: true,
                submitType: "DELETE",
                title: "Eliminar Casilla",
                buttonTitle: "Eliminar",
                danger: true,
                buttonIcon: "fa fa-trash fa-lg",
                successMessage: "La Casilla ha sido eliminada con éxito.",
                saveButton: true,
                saveButtonLabel: "Eliminar",
                buttonClass: "",
                disabled: true,
                id: this.props.id,
            };
        }
    }

    render() {
        let vars = this.modalVars();
        return (
            <ParadigmaModal
                getUrl={(vars.get ? api.mails.casillas : null)}
                submitUrl={(vars.submitType ? api.mails.casillas : null)}
                submitType={vars.submitType}
                id={vars.id}
                onGotData={(data) => this.setData(data)}
                onGotErrors={(errors) => this.setErrors(errors)}
                onSubmit={(e) => this.props.onSubmit(e)}
                onClose={() => this.resetForm()}
                onPreSubmit={() => this.getData()}

                cancelButtonLabel={vars.cancelButtonLabel}

                title={vars.title}

                danger={vars.danger}
                buttonClass={vars.buttonClass}

                successMessage={vars.successMessage}
                missingIdMessage={"Debe seleccionar una fila."}
                saveButtonLabel={vars.saveButtonLabel}
                buttonTitle={vars.buttonTitle}
                buttonIcon={vars.buttonIcon}
                saveButton={vars.saveButton}
                closeButton={true}

                escClose={true}
            >
                <ParadigmaLabeledInput
                    disabled={vars.disabled}
                    md={[3, 9]}
                    maxLength={50}
                    label={"Nombre"}
                    value={this.state.nombre}
                    onChange={(e) => this.onChangeField('nombre', e.target.value)}
                    error={() => this.getError('nombre')}
                />
                <ParadigmaLabeledInput
                    disabled={vars.disabled}
                    md={[3, 9]}
                    maxLength={100}
                    label={"Host"}
                    value={this.state.host}
                    onChange={(e) => this.onChangeField('host', e.target.value)}
                    error={() => this.getError('host')}
                />
                <ParadigmaLabeledInput
                    disabled={vars.disabled}
                    md={[3, 9]}
                    type={"number"}
                    label={"Port"}
                    value={this.state.port}
                    onChange={(e) => this.onChangeField('port', e.target.value)}
                    error={() => this.getError('port')}
                />
                <ParadigmaLabeledInput
                    disabled={vars.disabled}
                    md={[3, 9]}
                    maxLength={100}
                    label={"Username"}
                    value={this.state.username}
                    onChange={(e) => this.onChangeField('username', e.target.value)}
                    error={() => this.getError('username')}
                />
                <ParadigmaLabeledInput
                    disabled={vars.disabled}
                    md={[3, 9]}
                    maxLength={100}
                    label={"Password"}
                    value={this.state.password}
                    onChange={(e) => this.onChangeField('password', e.target.value)}
                    error={() => this.getError('password')}
                />
            </ParadigmaModal>
        );
    }
}

export default Modal;

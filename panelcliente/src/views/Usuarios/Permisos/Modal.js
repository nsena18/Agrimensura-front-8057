import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ParadigmaModal from "../../../components/ParadigmaModal/ParadigmaModal.js"
import api from "../../../api";

import { Row, Col, Label, Input, InputGroup, FormFeedback } from 'reactstrap';

import ParadigmaAsyncSeeker from "../../../components/ParadigmaAsyncSeeker/ParadigmaAsyncSeeker.js"
import ParadigmaLabeledInput from "../../../components/ParadigmaLabeledInput/ParadigmaLabeledInput.js"

class Modal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            padre_id: null,
            nombre: "",
            descripcion: "",
            postVariables: ['padre_id', 'nombre', 'descripcion'],
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
            padre_id: null,
            nombre: "",
            descripcion: "",
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
                padre_id: (data.padre ? data.padre.id : null),
                nombre: data.nombre,
                descripcion: data.descripcion,
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
                title: "Nuevo Permiso",
                buttonTitle: "Nuevo",
                danger: false,
                buttonIcon: "fa fa-plus fa-lg",
                successMessage: "El Permiso ha sido creado con éxito.",
                saveButton: true,
                buttonClass: "",
                disabled: false,
            };
        } else if (action == "EDIT") {
            return {
                get: true,
                submitType: "PUT",
                title: "Editar Permiso",
                buttonTitle: "Editar",
                danger: false,
                buttonIcon: "fa fa-pencil fa-lg",
                successMessage: "El Permiso ha sido editado con éxito.",
                saveButton: true,
                buttonClass: "",
                disabled: false,
                id: this.props.id,
            };
        } else if (action == "DETAIL") {
            return {
                get: true,
                submitType: null,
                title: "Permiso",
                buttonTitle: "Ver",
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
                title: "Eliminar Permiso",
                buttonTitle: "Eliminar",
                danger: true,
                buttonIcon: "fa fa-trash fa-lg",
                successMessage: "El Permiso ha sido eliminado con éxito.",
                saveButton: true,
                buttonClass: "btn-danger",
                disabled: true,
                id: this.props.id,
            };
        }
    }

    render() {
        let vars = this.modalVars();
        return (
            <ParadigmaModal
                getUrl={(vars.get ? api.usuarios.permisos : null)}
                submitUrl={(vars.submitType ? api.usuarios.permisos : null)}
                submitType={vars.submitType}
                id={vars.id}

                onGotData={(data) => this.setData(data)}
                onGotErrors={(errors) => this.setErrors(errors)}
                onSubmit={(e) => this.props.onSubmit(e)}
                onClose={() => this.resetForm()}
                onPreSubmit={() => this.getData()}

                title={vars.title}

                danger={vars.danger}
                buttonClass={vars.buttonClass}

                successMessage={vars.successMessage}
                missingIdMessage={"Debe seleccionar una fila."}

                buttonTitle={vars.buttonTitle}
                buttonIcon={vars.buttonIcon}
                saveButton={vars.saveButton}
                closeButton={true}
            >
                <ParadigmaLabeledInput
                    disabled={vars.disabled}
                    md={[2, 10]}
                    label={"Nombre"}
                    value={this.state.nombre}
                    onChange={(e) => this.onChangeField('nombre', e.target.value)}
                    error={() => this.getError('nombre')}
                />
                <ParadigmaLabeledInput
                    md={[2, 10]}
                    label={"Padre"}
                    inputComponent={
                        <ParadigmaAsyncSeeker
                            disabled={vars.disabled}
                            url={api.usuarios.permisos + "?fields=id,nombre&paginationEnabled=false"}
                            value={this.state.padre_id}
                            onChange={(data) => this.onChangeField('padre_id', (data ? data.id : null))}
                        />
                    }
                    error={() => this.getError('padre_id')}
                />
                <ParadigmaLabeledInput
                    disabled={vars.disabled}
                    label={"Descripcion"}
                    type={"textarea"}
                    rows={2}
                    value={this.state.descripcion}
                    onChange={(e) => this.onChangeField('descripcion', e.target.value)}
                    error={() => this.getError('descripcion')}
                />
            </ParadigmaModal>
        );
    }
}

export default Modal;

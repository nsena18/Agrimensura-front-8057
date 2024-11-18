import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import api from "../../../api";

import { Row, Col, Label, Input, InputGroup, FormFeedback } from 'reactstrap';

import ParadigmaModal from "../../../components/ParadigmaModal/ParadigmaModal.js"
import ParadigmaLabeledInput from "../../../components/ParadigmaLabeledInput/ParadigmaLabeledInput.js"
import ParadigmaAsyncSeeker from "../../../components/ParadigmaAsyncSeeker/ParadigmaAsyncSeeker.js"

class Modal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            nombre: '',
            abreviatura: '',
            tipoEncomienda_id: null,
            postVariables: ['nombre', 'abreviatura', 'tipoEncomienda_id'],
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
            nombre: '',
            abreviatura: '',
            tipoEncomienda_id: null,
            errors: [],
        });
    }

    getData() {
        const { precioUnitario, postVariables } = this.state;
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
                abreviatura: data.abreviatura,
                tipoEncomienda_id: (data.tipoEncomienda) ? (data.tipoEncomienda.id) : (null),
            });
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
                title: "Nuevo Objeto",
                buttonTitle: "Nuevo",
                danger: false,
                buttonIcon: "fa fa-plus fa-lg",
                successMessage: "El Objeto ha sido creado con éxito.",
                saveButton: true,
                saveButtonLabel: "Guardar",
                buttonClass: "",
                disabled: false,
            };
        } else if (action == "EDIT") {
            return {
                get: true,
                submitType: "PUT",
                title: "Editar Objeto",
                buttonTitle: "Editar",
                danger: false,
                buttonIcon: "fa fa-pencil fa-lg",
                successMessage: "El Objeto ha sido editado con éxito.",
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
                title: "Objeto de Trabajo",
                buttonTitle: "Ver",
                danger: false,
                buttonIcon: "fa fa-search fa-lg",
                successMessage: "",
                cancelButtonLabel:"Cerrar",
                saveButton: false,
                buttonClass: "",
                disabled: true,
                id: this.props.id,
            };
        } else if (action == "DELETE") {
            return {
                get: true,
                submitType: "DELETE",
                title: "Eliminar Objeto",
                buttonTitle: "Eliminar",
                danger: true,
                buttonIcon: "fa fa-trash fa-lg",
                successMessage: "El Objeto ha sido eliminado con éxito.",
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
        const { action } = this.props;
        const { nombre, abreviatura, tipoEncomienda_id } = this.state;

        return (
            <ParadigmaModal
                getUrl={(vars.get ? api.expedientes.objetosdetrabajo : null)}
                submitUrl={(vars.submitType ? api.expedientes.objetosdetrabajo : null)}
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
                    label={"Nombre"}
                    value={nombre}
                    onChange={(e) => this.onChangeField('nombre', e.target.value)}
                    error={() => this.getError('nombre')}
                />

                <ParadigmaLabeledInput
                    disabled={vars.disabled}
                    md={[3, 9]}
                    label={"Abreviatura"}
                    value={abreviatura}
                    onChange={(e) => this.onChangeField('abreviatura', e.target.value)}
                    error={() => this.getError('abreviatura')}
                />

                <ParadigmaLabeledInput
                    md={[3, 9]}
                    label={"Tipo Encom."}
                    inputComponent={
                        <ParadigmaAsyncSeeker
                            clearable={true}
                            disabled={vars.disabled}
                            url={api.expedientes.tiposdeencomienda}
                            value={tipoEncomienda_id}
                            parameters={{
                                paginationEnabled:false,
                                sort:['nombre'],
                            }}
                            onChange={(data) => {this.onChangeField('tipoEncomienda_id', (data ? data.id : null));}}
                        />
                    }
                    error={() => this.getError('tipoEncomienda_id')}
                />

            </ParadigmaModal>
        );
    }
}

export default Modal;

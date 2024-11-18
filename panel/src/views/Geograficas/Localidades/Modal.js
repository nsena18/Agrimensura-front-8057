import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ParadigmaModal from "../../../components/ParadigmaModal/ParadigmaModal.js"
import api from "../../../api";

import { Row, Col, Label, Input, InputGroup, FormFeedback } from 'reactstrap';

import ParadigmaLabeledInput from "../../../components/ParadigmaLabeledInput/ParadigmaLabeledInput.js"
import ParadigmaAsyncSeeker from "../../../components/ParadigmaAsyncSeeker/ParadigmaAsyncSeeker"


class Modal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            provincia_id: null,
            nombre: "",
            codigoPostal: "",
            postVariables: ['provincia_id','nombre','codigoPostal'],
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
            provincia_id: null,
            nombre: "",
            codigoPostal: "",
            errors: [],
        });
    }

    getData() {
        const { postVariables} = this.state;
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
                provincia_id: data.provincia.id,
                codigoPostal: data.codigoPostal,
                nombre: data.nombre,
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
                title: "Nueva Localidad",
                buttonTitle: "Nuevo",
                danger: false,
                buttonIcon: "fa fa-plus fa-lg",
                successMessage: "La Localidad ha sido creada con éxito.",
                saveButton: true,
                saveButtonLabel: "Guardar",
                buttonClass: "",
                disabled: false,
            };
        } else if (action == "EDIT") {
            return {
                get: true,
                submitType: "PUT",
                title: "Editar Localidad",
                buttonTitle: "Editar",
                danger: false,
                buttonIcon: "fa fa-pencil fa-lg",
                successMessage: "La Localidad ha sido editada con éxito.",
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
                title: "Localidad",
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
                title: "Eliminar Localidad",
                buttonTitle: "Eliminar",
                danger: true,
                buttonIcon: "fa fa-trash fa-lg",
                successMessage: "La Localidad ha sido eliminada con éxito.",
                saveButton: true,
                saveButtonLabel: "Eliminar",
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
                getUrl={(vars.get ? api.geograficas.localidades : null)}
                submitUrl={(vars.submitType ? api.geograficas.localidades : null)}
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
                saveButtonLabel={vars.saveButtonLabel}
                buttonTitle={vars.buttonTitle}
                buttonIcon={vars.buttonIcon}
                saveButton={vars.saveButton}
                closeButton={true}

                escClose={true}
            >

                <ParadigmaLabeledInput
                    md={[3, 9]}
                    label={"Provincias"}
                    inputComponent={
                        <ParadigmaAsyncSeeker
                            clearable={false}
                            disabled={vars.disabled}
                            url={api.geograficas.provinciasSelect}
                            // url={api.config_geograficas.provincias}
                            value={this.state.provincia_id}
                            parameters={{
                                paginationEnabled:false,
                                sort:['nombre'],
                                // filters:(this.state.pais_id) ? ['pais_id='+this.state.pais_id] : []
                            }}
                            // onChange={data => this.setState({provincia_id: data.id, localidad: ''})}
                            onChange={(data) => this.onChangeField('provincia_id', (data ? data.id : null))}
                        />
                    }
                    error={() => this.getError('provincias_id')}
                />

                <ParadigmaLabeledInput
                    disabled={vars.disabled}
                    md={[3, 9]}
                    maxLength={100}
                    label={"Nombre"}
                    value={this.state.nombre}
                    onChange={(e) => this.onChangeField('nombre', e.target.value)}
                    error={() => this.getError('nombre')}
                />

                <ParadigmaLabeledInput
                    disabled={vars.disabled}
                    md={[3, 9]}
                    maxLength={100}
                    label={"Código Postal"}
                    value={this.state.codigoPostal}
                    onChange={(e) => this.onChangeField('codigoPostal', e.target.value)}
                    error={() => this.getError('codigoPostal')}
                />

            </ParadigmaModal>
        );
    }
}

export default Modal;

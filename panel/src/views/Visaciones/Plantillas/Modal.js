import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ParadigmaModal from "../../../components/ParadigmaModal/ParadigmaModal.js"
import api from "../../../api";

import { Row, Col, Label, Input, InputGroup, FormFeedback } from 'reactstrap';

import ParadigmaLabeledInput from "../../../components/ParadigmaLabeledInput/ParadigmaLabeledInput.js"
import ParadigmaEditor from "../../../components/ParadigmaEditor/ParadigmaEditor.js"

class Modal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            titulo: "",
            nombreorganismo: "",
            correoorganismo1: "",
            correoorganismo2: "",
            postVariables: ['titulo', 'nombreorganismo', 'correoorganismo1', 'correoorganismo2'],
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
            titulo: "",
            nombreorganismo: "",
            correoorganismo1: "",
            correoorganismo2: "",
            errors: [],
        });
    }

    validarEmail(email) {
        const regex =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
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
                titulo: data.titulo,
                nombreorganismo: data.nombreorganismo,
                correoorganismo1: data.correoorganismo1,
                correoorganismo2: data.correoorganismo2,
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

    onValidation = () => {
        const { correoorganismo1, correoorganismo2 } = this.state;
        let error = {};
        let validate = true;

        if (!this.validarEmail(correoorganismo1)){
            error.correoorganismo1 = [{code: "required", detail: "El email ingresado, no posee un formato correcto."}];
            validate = false;
        }

        if (!this.validarEmail(correoorganismo2)){
            error.correoorganismo2 = [{code: "required", detail: "El email ingresado, no posee un formato correcto."}];
            validate = false;
        }

        this.setState({
            errors: error,
        })
        return validate;
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
                title: "Nueva Plantilla",
                buttonTitle: "Nuevo",
                danger: false,
                buttonIcon: "fa fa-plus fa-lg",
                successMessage: "La Plantilla ha sido creado con éxito.",
                saveButton: true,
                saveButtonLabel: "Guardar",
                buttonClass: "",
                disabled: false,
            };
        } else if (action == "EDIT") {
            return {
                get: true,
                submitType: "PUT",
                title: "Editar Plantilla",
                buttonTitle: "Editar",
                danger: false,
                buttonIcon: "fa fa-pencil fa-lg",
                successMessage: "La Plantilla ha sido editado con éxito.",
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
                title: "Plantilla",
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
                title: "Eliminar Plantilla",
                buttonTitle: "Eliminar",
                danger: true,
                buttonIcon: "fa fa-trash fa-lg",
                successMessage: "La Plantilla ha sido eliminado con éxito.",
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
        let varablesCuerpo = this.state.variablesCuerpo;
        return (
            <ParadigmaModal
                getUrl={(vars.get ? api.visaciones.plantillas : null)}
                submitUrl={(vars.submitType ? api.visaciones.plantillas : null)}
                submitType={vars.submitType}
                id={vars.id}
                onGotData={(data) => this.setData(data)}
                onGotErrors={(errors) => this.setErrors(errors)}
                onSubmit={(e) => this.props.onSubmit(e)}
                onClose={() => this.resetForm()}
                onPreSubmit={() => this.getData()}
                onValidation={() => this.onValidation()}

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
                className="modal-lg"

                escClose={true}
            >
                <ParadigmaLabeledInput
                    disabled={vars.disabled}
                    md={[3, 6]}
                    maxLength={200}
                    label={"Titulo de la plantilla"}
                    value={this.state.titulo}
                    onChange={(e) => this.onChangeField('titulo', e.target.value)}
                    error={() => this.getError('titulo')}
                />
                <ParadigmaLabeledInput
                    disabled={vars.disabled}
                    md={[3, 6]}
                    maxLength={200}
                    label={"Organismo asociado"}
                    value={this.state.nombreorganismo}
                    onChange={(e) => this.onChangeField('nombreorganismo', e.target.value)}
                    error={() => this.getError('nombreorganismo')}
                />
                 <ParadigmaLabeledInput
                    disabled={vars.disabled}
                    md={[3, 6]}
                    maxLength={100}
                    label={"Email predeterminado 1"}
                    value={this.state.correoorganismo1}
                    onChange={(e) => this.onChangeField('correoorganismo1', e.target.value)}
                    error={() => this.getError('correoorganismo1')}
                />
                 <ParadigmaLabeledInput
                    disabled={vars.disabled}
                    md={[3, 6]}
                    maxLength={100}
                    label={"Email predeterminado 2"}
                    value={this.state.correoorganismo2}
                    onChange={(e) => this.onChangeField('correoorganismo2', e.target.value)}
                    error={() => this.getError('correoorganismo2')}
                />
                
            </ParadigmaModal>
        );
    }
}

export default Modal;

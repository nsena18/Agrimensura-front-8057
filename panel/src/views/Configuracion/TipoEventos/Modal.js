import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ParadigmaModal from "../../../components/ParadigmaModal/ParadigmaModal.js"
import api from "../../../api";

import { Row, Col, ButtonGroup, Button, Input, UncontrolledTooltip } from 'reactstrap';

import ParadigmaLabeledInput from "../../../components/ParadigmaLabeledInput/ParadigmaLabeledInput.js"
import ParadigmaColorPicker from "../../../components/ParadigmaColorPicker/ParadigmaColorPicker.js"


class Modal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            nombre: "",
            backgroundColor: "fff", 
            color: "fff",

            postVariables: ['nombre', 'backgroundColor', 'color'],
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
            backgroundColor: "fff", 
            color: "fff",

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
                backgroundColor: data.backgroundColor, 
                color: data.color,
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
            if (field === "imagen") {
                value = value === "Imagen" ? true : false;
                prevState[field] = value;
            }
            else
                prevState[field] = value;
            return prevState;
        });
    }

    getError(field) {
        let errors = this.state.errors;
        if (errors) return errors[field];
        else return null;
    }

    onChangeField(field, value) {
        
        this.setState(prevState => {
            let errors = prevState.errors;
            if (errors) errors[field] = null;
            prevState.errors = errors;
            // Esto es para eliminar el cararcer "#"
            if(field==='color' || field==='backgroundColor'){
                let st=value;
                let array= st.split("#");
                prevState[field] = array[1];
            }
            else
                prevState[field] = value;
            return prevState;
        });
        
    }

    modalVars() {
        const { action } = this.props;
        if (action == "CREATE") {
            return {
                get: false,
                submitType: "POST",
                title: "Nuevo Tipo de Evento",
                buttonTitle: "Nuevo",
                danger: false,
                buttonIcon: "fa fa-plus fa-lg",
                successMessage: "El Tipo de Evento ha sido creado con éxito.",
                saveButton: true,
                saveButtonLabel: "Guardar",
                buttonClass: "",
                disabled: false,
            };
        } else if (action == "EDIT") {
            return {
                get: true,
                submitType: "PUT",
                title: "Editar Tipo de Evento",
                buttonTitle: "Editar",
                danger: false,
                buttonIcon: "fa fa-pencil fa-lg",
                successMessage: "El Tipo de Evento ha sido editada con éxito.",
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
                title: "Ver Tipo de Evento",
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
                title: "Eliminar Tipo de Evento",
                buttonTitle: "Eliminar",
                danger: true,
                buttonIcon: "fa fa-trash fa-lg",
                successMessage: "El Tipo de Evento ha sido eliminada con éxito.",
                saveButton: true,
                saveButtonLabel: "Eliminar",
                buttonClass: "btn-danger",
                disabled: true,
                id: this.props.id,
            };
        }
    }

    render() {
        const {nombre, backgroundColor, color} = this.state;
        let vars = this.modalVars();
        return (
            <ParadigmaModal
                getUrl={(vars.get ? api.calendar.tipoEventos : null)}
                submitUrl={(vars.submitType ? api.calendar.tipoEventos : null)}
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
                    disabled={vars.disabled}
                    md={[4, 8]}
                    maxLength={50}
                    label="Nombre"
                    value={nombre}
                    onChange={(e) => this.onChangeField('nombre', e.target.value)}
                    error={() => this.getError('nombre')}
                />

                <ParadigmaLabeledInput
                    md={[4, 8]}
                    label={"Background color"}
                    onChange={(e) => this.onChangeField('backgroundColor', e.target.value)}
                    error={() => this.getError('backgroundColor')}
                    inputComponent= {
                        <ParadigmaColorPicker
                            disabled= {vars.disabled}
                            onChange={(color) => this.onChangeField('backgroundColor',color)}
                            value={backgroundColor}
                        />
                    }
                />

                <ParadigmaLabeledInput
                    md={[4, 8]}
                    label={"Text color"}
                    onChange={(e) => this.onChangeField('color', e.target.value)}
                    error={() => this.getError('color')}
                    inputComponent= {
                        <ParadigmaColorPicker
                            disabled= {vars.disabled}
                            onChange={(color) => this.onChangeField('color',color)}
                            value={color}
                        />
                    }
                />

            </ParadigmaModal>
        );
    }
}

export default Modal;

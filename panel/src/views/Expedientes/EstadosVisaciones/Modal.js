import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ParadigmaModal from "../../../components/ParadigmaModal/ParadigmaModal.js"
import api from "../../../api";

import { Row, Col, ButtonGroup, Button, Input, UncontrolledTooltip } from 'reactstrap';

import ParadigmaLabeledInput from "../../../components/ParadigmaLabeledInput/ParadigmaLabeledInput.js"
import ParadigmaColorPicker from "../../../components/ParadigmaColorPicker/ParadigmaColorPicker.js"
import ParadigmaAsyncSeeker from "../../../components/ParadigmaAsyncSeeker/ParadigmaAsyncSeeker.js"

class Modal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            numero: 0,
            nombre: "",
            color_fondo: "",
            color_texto:"",
            es_ultimo: false,
            postVariables: ['numero', 'nombre', 'color_fondo', 'color_texto', 'es_ultimo'],
            errors: [],
            comitentesentidades_id: 0,
            organismo : null
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
            numero: 0,
            nombre: "",
            color_fondo: "",
            color_texto:"",
            es_ultimo: false,
            errors: [],            
        });
    }

    getData() {
        const { postVariables, maxSize } = this.state;
        let data = {};
        // data.habilitado = true;
        postVariables.forEach(x => {
            data[x] = this.state[x];
        });
        return data;
    }

    setData(data) {
        if (data.success) {
            this.setState({
                id: data.id,
                numero: data.numero,
                nombre: data.nombre,
                color_fondo: data.color_fondo,
                color_texto: data.color_texto,
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
           
            if(field==='color_texto' || field==='color_fondo'){
                let st=value;
                let array= st.split("#");
                prevState[field] = array[1];
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

    modalVars() {
        const { action } = this.props;
        if (action == "CREATE") {
            return {
                get: false,
                submitType: "POST",
                title: "Nuevo Estado",
                buttonTitle: "Nuevo",
                danger: false,
                buttonIcon: "fa fa-plus fa-lg",
                successMessage: "El Estado ha sido creado con éxito.",
                saveButton: true,
                saveButtonLabel: "Guardar",
                buttonClass: "",
                disabled: false,
            };
        } else if (action == "EDIT") {
            return {
                get: true,
                submitType: "PUT",
                title: "Editar Estado",
                buttonTitle: "Editar",
                danger: false,
                buttonIcon: "fa fa-pencil fa-lg",
                successMessage: "El estado se eduti con éxito.",
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
                title: "Estado",
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
                title: "Eliminar Estado",
                buttonTitle: "Eliminar",
                danger: true,
                buttonIcon: "fa fa-trash fa-lg",
                successMessage: "El Estado ha sido eliminado con éxito.",
                saveButton: true,
                saveButtonLabel: "Eliminar",
                buttonClass: "btn-danger",
                disabled: true,
                id: this.props.id,
            };
        }
    }

    render() {
        const { listEntidades } = this.props;
        const { 
            numero,
            nombre,
            color_fondo,
            color_texto,
         } = this.state;
        let vars = this.modalVars();

        return (
            <ParadigmaModal
                getUrl={(vars.get ? api.visaciones.controlestados : null)}
                submitUrl={(vars.submitType ? api.visaciones.controlestados : null)}
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
                // className={'modal-lg'}
            >
           
                <Row>
                    <Col className={'col-12'}>
                        <ParadigmaLabeledInput
                            disabled={vars.disabled}
                            md={[3, 9]}
                            maxLength={50}
                            label="Nombre"
                            value={nombre}
                            onChange={(e) => this.onChangeField('nombre', e.target.value)}
                            error={() => this.getError('nombre')}
                        />
                    </Col>
                    
                    <Col className={'col-6 mt-2'}>
                        <ParadigmaLabeledInput
                             disabled={vars.disabled}
                            md={[6, 6]}
                            type={"integer"}
                            maxLength={50}
                            label="Numero"
                            value={numero}
                            onChange={(e) => this.onChangeField('numero', e.target.value)}
                            error={() => this.getError('numero')}
                        />
                    </Col>
                    <Col className={'col-6 mt-2'}>
                        <ParadigmaLabeledInput
                             md={[6, 6]}
                            label={"Fondo"}
                            onChange={(e) => this.onChangeField('color_fondo', e.target.value)}
                            error={() => this.getError('color_fondo')}
                            inputComponent= {
                                <ParadigmaColorPicker
                                    disabled= {vars.disabled}
                                    onChange={(color) => this.onChangeField('color_fondo',color)}
                                    value={color_fondo}
                                />
                            }
                        />
                    </Col>
                    <Col className={'col-6 mt-2'}>
                        <ParadigmaLabeledInput
                            md={[6, 6]}
                            label={"Color texto"}
                            onChange={(e) => this.onChangeField('color_texto', e.target.value)}
                            error={() => this.getError('color_texto')}
                            inputComponent= {
                                <ParadigmaColorPicker
                                    disabled= {vars.disabled}
                                    onChange={(color) => this.onChangeField('color_texto',color)}
                                    value={color_texto}
                                />
                            }
                        /> 
                    </Col>
                </Row>
            </ParadigmaModal>
        );
    }
}

export default Modal;

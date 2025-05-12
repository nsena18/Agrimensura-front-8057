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
            nombre_grupo: '',
            visaciones_ids : [],
            postVariables: ['nombre_grupo', 'visaciones_ids' ],
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
            nombre_grupo: '',
            visaciones_ids : [],
            errors: [],            
        });
    }

    getData() {
        const { postVariables, maxSize } = this.state;
        let data = {};
        postVariables.forEach(x => {
            data[x] = this.state[x];
        });
        return data;
    }

    setData(data) {
        const { listVisaciones } = this.props;
        if (data.success) {
            console.log(data)
            this.setState({
                id: data.id,
                nombre_grupo : data.nombre_grupo,
                
            })
            let visaciones = data.visaciones == null ? [] : data.visaciones.map(objeto => objeto.id)
            this.setState({
                    visaciones_ids: visaciones
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
            else if(field==='texto' || field==='background'){
                let st=value;
                let array= st.split("#");
                prevState[field] = array[1];
            }
            else
                prevState[field] = value;
            return prevState;
        });
    }

    onChangeSelect(data) {
        this.setState({ comitentesentidades_id: (data ? data.id : null), organismo: data })
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
                title: "Nuevo Grupo",
                buttonTitle: "Nuevo",
                danger: false,
                buttonIcon: "fa fa-plus fa-lg",
                successMessage: "El Grupo ha sido creado con éxito.",
                saveButton: true,
                saveButtonLabel: "Guardar",
                buttonClass: "",
                disabled: false,
            };
        } else if (action == "EDIT") {
            return {
                get: true,
                submitType: "PUT",
                title: "Editar Grupo",
                buttonTitle: "Editar",
                danger: false,
                buttonIcon: "fa fa-pencil fa-lg",
                successMessage: "El grupo se edito con éxito.",
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
                title: "Grupo",
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
                title: "Eliminar Grupo",
                buttonTitle: "Eliminar",
                danger: true,
                buttonIcon: "fa fa-trash fa-lg",
                successMessage: "El Grupo ha sido eliminado con éxito.",
                saveButton: true,
                saveButtonLabel: "Eliminar",
                buttonClass: "btn-danger",
                disabled: true,
                id: this.props.id,
            };
        }
    }

    render() {
        const { listVisaciones } = this.props;
        const { 
            nombre_grupo,
            visaciones_ids            
         } = this.state;
        let vars = this.modalVars();

        return (
            <ParadigmaModal
                getUrl={(vars.get ? api.visaciones.agrupacionvisaciones : null)}
                submitUrl={(vars.submitType ? api.visaciones.agrupacionvisaciones : null)}
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

                <Row>
                    <Col className={'col-12'}>
                        <ParadigmaLabeledInput
                            disabled={vars.disabled}
                            md={[3, 9]}
                            maxLength={50}
                            label="Nombre Grupo"
                            value={nombre_grupo}
                            onChange={(e) => this.onChangeField('nombre_grupo', e.target.value)}
                            error={() => this.getError('nombre_grupo')}
                        />
                    </Col>
                </Row>

                <ParadigmaLabeledInput
                    label="Conjunto de Visaciones"
                    md={[4, 8]}
                    classNames={['pr-0','']}
                    error={() => this.getError('lista_correlativos')}
                    inputComponent={
                        <ParadigmaAsyncSeeker
                            disabled={vars.disabled}
                            multiselect={true}
                            clearable={false}
                            url={undefined}
                            value={visaciones_ids}
                            optionDefault={listVisaciones.map(e => {return { id: e.id, nombre: e.nombre }})}
                            parameters={{
                                paginationEnabled:false,
                            }}
                            valueRenderer={data => `${data.nombre}`}
                            optionRenderer={data => `${data.nombre}`}                                
                            onChange={data => this.onChangeField('visaciones_ids', data ? data.map(e => e.id) : [])}
                        />
                    }
                />

            </ParadigmaModal>
        );
    }
}

export default Modal;

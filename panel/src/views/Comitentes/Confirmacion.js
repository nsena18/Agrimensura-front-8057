import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import api from "../../api";
import { formatCurrency } from '../../functions/functions';

import { Row, Col, Label, Input, InputGroup, FormFeedback } from 'reactstrap';
import moment from 'moment';

import ParadigmaModal from "../../components/ParadigmaModal/ParadigmaModal.js"
import ParadigmaAsyncSeeker from "../../components/ParadigmaAsyncSeeker/ParadigmaAsyncSeeker.js"
import ParadigmaLabeledInput from "../../components/ParadigmaLabeledInput/ParadigmaLabeledInput.js"
import ParadigmaDatePicker from "../../components/ParadigmaDatePicker/ParadigmaDatePicker.js"


class Modal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            nombre: '',
            apellido: '',
            documento: '',
            telefono: '',
            telefono2: '',
            telefono3: '',
            direccion: '',

            provincia_id: null,
            localidad_id: null,
            categoria_id: null,
            profesion_id: null,

            email: '',

            observaciones: '',
            responsableIva: 0,

            postVariables: ['nombre', 'apellido', 'documento', 'telefono',  'telefono2', 'telefono3', 'direccion', 'provincia_id', 'localidad_id', 'categoria_id', 'profesion_id', 
                            'email', 'observaciones', 'responsableIva'],
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
            apellido: '',
            documento: '',
            telefono: '',
            telefono2: '',
            telefono3: '',
            direccion: '',

            provincia_id: null,
            localidad_id: null,
            categoria_id: null,
            profesion_id: null,

            email: '',

            observaciones: '',
            responsableIva: 0,

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

            if(data.confirmacion==true){
                return {
                    allowed: false,
                    message: 'El comitente ya fue confirmado',
                }
            }

            this.setState({
                id: data.id,
                nombre: data.nombre,
                apellido: data.apellido,
                documento: data.documento,
                telefono: data.telefono,
                telefono2: data.telefono2,
                telefono3: data.telefono3,
                direccion: data.direccion,

                provincia_id: (data.provincia) ? (data.provincia.id) : (null),
                localidad_id: (data.localidad) ? (data.localidad.id) : (null),
                categoria_id: (data.categoria) ? (data.categoria.id) : (null),
                profesion_id: (data.profesion) ? (data.profesion.id) : (null),

                email: data.email,

                observaciones: data.observaciones,
                responsableIva: data.responsableIva,
                
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
        
        if (action == "EDIT") {
            return {
                get: true,
                submitType: "PUT",
                title: "Confirmar Comitente",
                buttonTitle: "Confirmar Comitente",
                danger: false,
                buttonIcon: "fa fa-check-square-o fa-lg",
                successMessage: "El Comitente ha sido confirma con éxito.",
                saveButton: true,
                saveButtonLabel: "Confirmar",
                buttonClass: "",
                disabled: true,
                id: this.props.id,
            };
        }
    }


    render() {
        let vars = this.modalVars();
        const { action } = this.props;
        const { nombre, apellido, documento, telefono, telefono2, telefono3, direccion, provincia_id, localidad_id, categoria_id, profesion_id, email, observaciones, responsableIva  } = this.state;

        return (
            <ParadigmaModal
                getUrl={(vars.get ? api.comitentes.comitentes : null)}
                submitUrl={(vars.submitType ? api.comitentes.confirmacion : null)}
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
                    md={[2, 10]}
                    label={"Nombre"}
                    value={nombre}
                    maxLength={100}
                    onChange={(e) => this.onChangeField('nombre', e.target.value)}
                    error={() => this.getError('nombre')}
                />

                <ParadigmaLabeledInput
                    disabled={vars.disabled}
                    md={[2, 10]}
                    label={"Apellido"}
                    value={apellido}
                    maxLength={100}
                    onChange={(e) => this.onChangeField('apellido', e.target.value)}
                    error={() => this.getError('apellido')}
                />

                <Row>
                    <Col className={'col-6'}>
                        <ParadigmaLabeledInput
                            disabled={vars.disabled}
                            md={[4, 8]}
                            type={'integer'}
                            label={"CUIT"}
                            value={documento}
                            maxLength={20}
                            onChange={(e) => this.onChangeField('documento', e.target.value)}
                            error={() => this.getError('documento')}
                        />
                    </Col>
                    <Col className={'col-6'}>
                        <ParadigmaLabeledInput
                            md={[4, 8]}
                            label={"Tipo Iva"}
                            inputComponent={
                                <ParadigmaAsyncSeeker
                                    clearable={false}
                                    disabled={vars.disabled}
                                    url={undefined}
                                    optionDefault={[{nombre: 'Sin Iva', id: 0}, {nombre: 'Resp Inscripto', id: 1}, {nombre: 'Monotributo', id: 2}, {nombre: 'Exento', id: 3}, {nombre: 'Consumidor Final', id: 4}]}
                                    value={responsableIva}
                                    onChange={(data) => this.onChangeField('responsableIva', (data ? data.id : null))}
                                />
                            }
                            error={() => this.getError('responsableIva')}
                        />
                    </Col>
                </Row>
                

                <ParadigmaLabeledInput
                    md={[2, 10]}
                    label={"Provincias"}
                    inputComponent={
                        <ParadigmaAsyncSeeker
                            clearable={false}
                            disabled={vars.disabled}
                            url={api.geograficas.provinciasSelect}
                            value={this.state.provincia_id}
                            parameters={{
                                paginationEnabled:false,
                                sort:['nombre'],
                            }}
                            onChange={(data) => {this.onChangeField('provincia_id', (data ? data.id : null)); this.onChangeField('localidad_id', null)}}
                        />
                    }
                    error={() => this.getError('provincias_id')}
                />

                <ParadigmaLabeledInput
                    label="Localidad"
                    md={[2, 10]}
                    inputComponent={
                        <ParadigmaAsyncSeeker
                            clearable={false}
                            disabled={provincia_id==null || vars.disabled}
                            url={provincia_id ? api.geograficas.localidadesSelect : ''}
                            value={localidad_id}
                            onChange={data => this.onChangeField('localidad_id', data ? data.id : null)}
                            parameters={{
                                paginationEnabled:false,
                                sort:['nombre'],
                                filters: (provincia_id) ? ['provincia_id='+provincia_id] : []
                            }}
                            autoselect={true}
                        />
                    }
                    error={() => this.getError('localidad_id')}
                />

                <ParadigmaLabeledInput
                    disabled={vars.disabled}
                    md={[2, 10]}
                    label={"Dirección"}
                    value={direccion}
                    maxLength={100}
                    onChange={(e) => this.onChangeField('direccion', e.target.value)}
                    error={() => this.getError('direccion')}
                />

                <ParadigmaLabeledInput
                    disabled={vars.disabled}
                    md={[2, 10]}
                    label={"Teléfonos"}
                    value={telefono}
                    maxLength={50}
                    onChange={(e) => this.onChangeField('telefono', e.target.value)}
                    error={() => this.getError('telefono')}
                />

                <ParadigmaLabeledInput
                    disabled={vars.disabled}
                    md={[2, 10]}
                    label={" "}
                    value={telefono2}
                    maxLength={50}
                    onChange={(e) => this.onChangeField('telefono2', e.target.value)}
                    error={() => this.getError('telefono2')}
                />

                <ParadigmaLabeledInput
                    disabled={vars.disabled}
                    md={[2, 10]}
                    label={" "}
                    value={telefono3}
                    maxLength={50}
                    onChange={(e) => this.onChangeField('telefono3', e.target.value)}
                    error={() => this.getError('telefono3')}
                />

                <ParadigmaLabeledInput
                    disabled={vars.disabled}
                    md={[2, 10]}
                    label={"E-mail"}
                    value={email}
                    maxLength={100}
                    onChange={(e) => this.onChangeField('email', e.target.value)}
                    error={() => this.getError('email')}
                />

                <ParadigmaLabeledInput
                    md={[2, 10]}
                    label={"Profesion"}
                    inputComponent={
                        <ParadigmaAsyncSeeker
                            clearable={true}
                            disabled={vars.disabled}
                            url={api.comitentes.profesiones}
                            value={profesion_id}
                            parameters={{
                                paginationEnabled:false,
                                sort:['nombre'],
                            }}
                            onChange={(data) => this.onChangeField('profesion_id', (data ? data.id : null))}
                        />
                    }
                    error={() => this.getError('profesion_id')}
                />

                {/* <ParadigmaLabeledInput
                    md={[2, 10]}
                    label={"Categoria"}
                    inputComponent={
                        <ParadigmaAsyncSeeker
                            clearable={true}
                            disabled={vars.disabled}
                            url={api.comitentes.categorias}
                            value={categoria_id}
                            parameters={{
                                paginationEnabled:false,
                                sort:['nombre'],
                            }}
                            onChange={(data) => this.onChangeField('categoria_id', (data ? data.id : null))}
                        />
                    }
                    error={() => this.getError('categoria_id')}
                /> */}

                <ParadigmaLabeledInput
                    disabled={vars.disabled}
                    md={[2, 10]}
                    type={'textarea'}
                    label={"Observación"}
                    value={observaciones}
                    maxLength={400}
                    onChange={(e) => this.onChangeField('observaciones', e.target.value)}
                    error={() => this.getError('observaciones')}
                />

            </ParadigmaModal>
        );
    }
}

export default Modal;

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import api from "../../../api";

import { Row, Col, Label, Input, InputGroup, FormFeedback } from 'reactstrap';
import moment from 'moment';
import { formatCurrency } from '../../../functions/functions';

import ParadigmaModal from "../../../components/ParadigmaModal/ParadigmaModal.js"
import ParadigmaAsyncSeeker from "../../../components/ParadigmaAsyncSeeker/ParadigmaAsyncSeeker.js"
import ParadigmaLabeledInput from "../../../components/ParadigmaLabeledInput/ParadigmaLabeledInput.js"
import ParadigmaDatePicker from "../../../components/ParadigmaDatePicker/ParadigmaDatePicker.js"
import ParadigmaCurrencyInput from "../../../components/ParadigmaCurrencyInput/ParadigmaCurrencyInput.js"

import ModalEncomienda from '../../Expedientes/EncomiendaProfesional/Modal'
import ModalComitentes from '../../Comitentes/Modal'

class ModalDeuda extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            fecha: moment(),
            comitente_id: null,
            encomiendaProfesional_id: null,
            detalle: '',
            importe: '0,00',
            tipo: 1,
            postVariables: ['comitente_id', 'encomiendaProfesional_id', 'detalle', 'tipo'],
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
            fecha: moment(),
            comitente_id: null,
            encomiendaProfesional_id: null,
            detalle: '',
            importe: '0,00',
            tipo: 1,
            errors: [],
        });
    }

    getData() {
        const { action } = this.props;
        const { postVariables, fecha, importe } = this.state;
        let data = {};
        postVariables.forEach(x => {
            data[x] = this.state[x];
        });
        data.fecha = fecha.format('YYYY-MM-DDThh:mm');
        data.importe = parseFloat(importe.replace(',', '.'));
        return data;
    }

    setData(data) {
        let row = this.props.row();
        // Si la encomienda tiene un movimiento de deuda cargado se recuperan los datos sino asigna los datos por defecto de la encomienda seleccionada
        if (data.success && data.data!=false) {
            this.setState({
                id: data.id,
                fecha: moment(data.fecha),
                comitente_id: data.comitente ? data.comitente.id : null,
                encomiendaProfesional_id: data.encomiendaProfesional ? data.encomiendaProfesional.id : null,
                detalle: data.detalle,
                importe: formatCurrency(data.importe.toString().replace('.',',')),
                tipo: data.tipo,
            });
        } else {
            this.setState({
                encomiendaProfesional_id: row.id,
                comitente_id: row.comitente ? row.comitente.id : null,
                detalle: 'Encomienda: '+row.nroOrden,
                tipo: 1,
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
                title: "Estado De Dueda",
                buttonTitle: "Estado De Dueda",
                danger: false,
                buttonIcon: "fa fa-money fa-lg",
                successMessage: "ha sido editado con éxito.",
                saveButton: true,
                saveButtonLabel: "Guardar",
                buttonClass: "",
                disabled: false,
                id: this.props.id,
            };
        }
    }

    onOpen = () => {
        // const { action } = this.props;
        // let iduser = parseInt(localStorage.iduser);
        // if(action==='CREATE' && iduser!=undefined && iduser!=null){
        //     this.setState({
        //         autor_id: iduser,
        //     })
        // }
    }

    onValidation = () => {
        const { importe } = this.state;
        
        let errors = {};
        let valid = true;

        if(parseFloat(importe.replace(',', '.'))<=0){
            errors['importe'] = [{code: "blank", detail: "Ingrese un importe mayor a 0"}]
            valid = false;
        }

        this.setState({errors: errors})

        return valid
    }

    render() {
        let vars = this.modalVars();
        const { action, asUsuarios } = this.props;
        const { fecha, comitente_id, encomiendaProfesional_id, detalle, importe, tipo } = this.state;
        
        return (
            <ParadigmaModal
                getUrl={(vars.get ? api.cuentasCorrientes.estadoDeuda : null)}
                submitUrl={(vars.submitType ? api.cuentasCorrientes.estadoDeuda : null)}
                submitType={vars.submitType}
                id={vars.id}

                onGotData={(data) => this.setData(data)}
                onGotErrors={(errors) => this.setErrors(errors)}
                onSubmit={(e) => this.props.onSubmit(e)}
                onClose={() => this.resetForm()}
                onPreSubmit={() => this.getData()}
                onOpen={() => this.onOpen()}
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

                escClose={true}
            >

                <ParadigmaLabeledInput 
                    disabled={vars.disabled}
                    md={[4, 8]}
                    maxLength={50}
                    label={"Fecha"} 
                    inputComponent={
                        <ParadigmaDatePicker
                            disabled={vars.disabled}
                            // disabled={true}
                            value={fecha}
                            onChange={(e) => this.setState({ 'fecha': e })}
                            datetime={false}
                            className={"inp_fecha"}
                        />} 
                    error={() => this.getError('fecha')}
                />

                <ParadigmaLabeledInput
                    label="Encomienda"
                    md={[4, 8]}
                    inputComponent={
                        <ParadigmaAsyncSeeker
                            // disabled={vars.disabled}
                            disabled={true}
                            url={api.expedientes.encomiendaprofesionalSelect}
                            displayField={"nroOrden"}
                            value={encomiendaProfesional_id}
                            parameters={{
                                paginationEnabled:false,
                                sort:['fechaIngreso']
                            }}
                            onChange={e => this.onChangeField('encomiendaProfesional_id', (e) ? (e.id) : (null))}
                            CreateComponent={props => <ModalEncomienda id={() => {return (encomiendaProfesional_id) ? (encomiendaProfesional_id) : (false)}} 
                                                                        action={"DETAIL"} 
                                                                        ar_estados={this.props.ar_estados}/>}
                        />
                    }
                    error={() => this.getError('encomiendaProfesional_id')}
                />

                <ParadigmaLabeledInput
                    label="Comitente"
                    md={[4, 8]}
                    inputComponent={
                        <ParadigmaAsyncSeeker
                            // disabled={vars.disabled}
                            disabled={true}
                            url={api.comitentes.comitentes}
                            value={comitente_id}
                            displayField={'apellido_nombre'}
                            parameters={{
                                paginationEnabled:false,
                                sort:['apellido_nombre']
                            }}
                            onChange={e => this.onChangeField('comitente_id', (e) ? (e.id) : (null))}
                            CreateComponent={props => <ModalComitentes id={() => {return (comitente_id) ? (comitente_id) : (false)}} 
                                                                        action={"DETAIL"}/>}
                        />
                    }
                    error={() => this.getError('comitente_id')}
                />

                {/*<ParadigmaLabeledInput
                    md={[4, 8]}
                    label={"Tipo Movimiento"}
                    inputComponent={
                        <ParadigmaAsyncSeeker
                            clearable={false}
                            // disabled={vars.disabled}
                            disabled={true}
                            url={undefined}
                            optionDefault={[{nombre: 'Ingreso', id: 0}, {nombre: 'Egreso', id: 1}]}
                            value={tipo}
                            onChange={(data) => this.onChangeField('tipo', (data ? data.id : null))}
                        />
                    }
                    error={() => this.getError('tipo')}
                />*/}

                <ParadigmaLabeledInput
                    md={[4, 8]}
                    label={"Importe"}
                    error={() => this.getError('importe')}
                    inputComponent={
                        <ParadigmaCurrencyInput 
                            type="text"
                            disabled={vars.disabled}
                            value={importe}
                            onChange={(data) => this.onChangeField('importe', data)}
                            className={'monto'}
                            dobleSimboloDecimal={true}
                            selectOnFocus={true}
                            onBlurComplete={true}
                        />}
                />

                <ParadigmaLabeledInput
                    disabled={vars.disabled}
                    md={[4, 8]}
                    type={'textarea'}
                    classNames={['', 'ta_m_movil']}
                    label={"Detalle"}
                    value={detalle}
                    onChange={(e) => this.onChangeField('detalle', e.target.value)}
                    error={() => this.getError('detalle')}
                />

            </ParadigmaModal>
        );
    }
}

export default ModalDeuda;

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import api from "../../../api";
import { formatCurrency } from '../../../functions/functions';

import { Row, Col, Label, Input, InputGroup, FormFeedback } from 'reactstrap';
import moment from 'moment';

import ParadigmaModal from "../../../components/ParadigmaModal/ParadigmaModal.js"
import ParadigmaAsyncSeeker from "../../../components/ParadigmaAsyncSeeker/ParadigmaAsyncSeeker.js"
import ParadigmaLabeledInput from "../../../components/ParadigmaLabeledInput/ParadigmaLabeledInput.js"
import ParadigmaDatePicker from "../../../components/ParadigmaDatePicker/ParadigmaDatePicker.js"
import ParadigmaCurrencyInput from "../../../components/ParadigmaCurrencyInput/ParadigmaCurrencyInput.js"

import ModalEncomienda from '../../Expedientes/EncomiendaProfesional/Modal'
import ModalComitentes from '../../Comitentes/Modal'

class Modal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            fecha: moment(),
            comitente_id: null,
            encomiendaProfesional_id: null,
            detalle: '',
            importe: '0,00',
            medioDePago_id: null,
            tipo: 0,
            postVariables: ['comitente_id', 'encomiendaProfesional_id', 'detalle', 'tipo', 'medioDePago_id'],
            errors: [],
        };
        this.importeRef = React.createRef();
        this.detalleRef = React.createRef();
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
            medioDePago_id: null,
            tipo: 0,
            errors: [],
        });
        this.importeRef.current = '';
        this.detalleRef.current = '';
    }

    getData() {
        const { action } = this.props;
        const { postVariables, fecha, importe } = this.state;
        let data = {};
        postVariables.forEach(x => {
            if( x == 'importe'){
                data[x] = this.importeRef.current.value;
            }
            if( x == 'detalle'){
                data[x] = this.detalleRef.current.value;
            }
             else {
                data[x] = this.state[x];
            }
        });
        data.fecha = fecha.format('YYYY-MM-DDThh:mm');
        data.importe = parseFloat(this.importeRef.current.value.replace(',', '.'));
        return data;
    }

    setData(data) {
        if (data.success) {
            this.setState({
                id: data.id,
                fecha: moment(data.fecha),
                comitente_id: data.comitente ? data.comitente.id : null,
                encomiendaProfesional_id: data.encomiendaProfesional ? data.encomiendaProfesional.id : null,
                detalle: data.detalle,
                importe: formatCurrency(data.importe.toString().replace('.',',')),
                medioDePago_id: data.medioDePago ? data.medioDePago.id : null,
                tipo: data.tipo,
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
                title: "Nuevo Movimiento",
                buttonTitle: "Nuevo",
                danger: false,
                buttonIcon: "fa fa-plus fa-lg",
                successMessage: "La Nota ha sido creada con éxito.",
                saveButton: true,
                saveButtonLabel: "Guardar",
                buttonClass: "",
                disabled: false,
            };
        } else if (action == "EDIT") {
            return {
                get: true,
                submitType: "PUT",
                title: "Editar Movimiento",
                buttonTitle: "Editar",
                danger: false,
                buttonIcon: "fa fa-pencil fa-lg",
                successMessage: "La Nota ha sido editada con éxito.",
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
                title: "Movimiento",
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
                title: "Eliminar Movimiento",
                buttonTitle: "Eliminar",
                danger: true,
                buttonIcon: "fa fa-trash fa-lg",
                successMessage: "La Nota ha sido eliminada con éxito.",
                saveButton: true,
                saveButtonLabel: "Eliminar",
                buttonClass: "",
                disabled: true,
                id: this.props.id,
            };
        }
    }

    onOpen = () => {
        const { action, comitente_id } = this.props;
        if(action=='CREATE' && comitente_id!=null && comitente_id!=undefined){
            this.setState({
                comitente_id: comitente_id
            })
        }
    }

    onValidation(){
        const { importe } = this.state;
        let error = {};
        let validate = true;

        if (parseFloat(this.importeRef.current.value.replace(',', '.'))<=0){
            error.importe= [{code: "required", detail: "Ingrese un importe valido"}];
            validate = false;
        }
        
        this.setState({
            errors: error,
        })
        return validate;
    }

    render() {
        let vars = this.modalVars();
        const { action, asUsuarios } = this.props;
        const { fecha, comitente_id, encomiendaProfesional_id, detalle, importe, medioDePago_id, tipo } = this.state;
        
        return (
            <ParadigmaModal
                getUrl={(vars.get ? api.cuentasCorrientes.movimientos : null)}
                submitUrl={(vars.submitType ? api.cuentasCorrientes.movimientos : null)}
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
                            value={fecha}
                            onChange={(e) => this.setState({ 'fecha': e })}
                            datetime={false}
                            className={"inp_fecha"}
                        />} 
                    error={() => this.getError('fecha')}
                />

                <ParadigmaLabeledInput
                    label="Comitente"
                    md={[4, 8]}
                    inputComponent={
                        <ParadigmaAsyncSeeker
                            disabled={vars.disabled}
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

                <ParadigmaLabeledInput
                    md={[4, 8]}
                    label={"Tipo Movimiento"}
                    inputComponent={
                        <ParadigmaAsyncSeeker
                            clearable={false}
                            disabled={vars.disabled}
                            url={undefined}
                            optionDefault={[{nombre: 'Ingreso', id: 0}, {nombre: 'Egreso', id: 1}]}
                            value={tipo}
                            onChange={(data) => this.onChangeField('tipo', (data ? data.id : null))}
                        />
                    }
                    error={() => this.getError('tipo')}
                />

                
                <Row className="mt-sm-1">
                    <Col  xs={12} sm={12} md={4} lg={4} xl={4}>
                        <Label>Importe</Label>
                    </Col>
                    <Col  xs={12} sm={12} md={8} lg={8} xl={8}>
                         <Input
                            id="importe"
                            type="number"
                            placeholder="0.00"
                            className="monto"
                            defaultValue={importe}                            
                            innerRef={(element) => {
                                this.importeRef.current = element;
                            }}                            
                        />
                       {this.getError('importe') && (
                            <FormFeedback className= "d-block">Importe no debe ser vacia</FormFeedback>
                        )}
                    </Col>
                </Row>

                <ParadigmaLabeledInput
                    md={[4, 8]}
                    label={"Medio de Pago"}
                    error={() => this.getError('medioDePago_id')}
                    inputComponent={
                        <ParadigmaAsyncSeeker
                            disabled={vars.disabled}
                            url={api.cuentasCorrientes.mediosDePago}
                            value={medioDePago_id}
                            parameters={{
                                paginationEnabled:false,
                                sort:['nombre']
                            }}
                            onChange={e => this.setState({medioDePago_id: (e) ? (e.id) : null})}
                        />}
                />

                <Row className="mt-sm-1">
                    <Col  xs={12} sm={12} md={4} lg={4} xl={4}>
                        <Label>Detalle</Label>
                    </Col>
                    <Col  xs={12} sm={12} md={8} lg={8} xl={8}>
                         <Input
                            id="detalle"
                            name="text"
                             type="textarea"
                            defaultValue={detalle}
                            innerRef={(element) => {
                                this.detalleRef.current = element;
                            }}
                        />
                       {this.getError('detalle') && (
                            <FormFeedback className= "d-block">Detalle no debe ser vacia</FormFeedback>
                        )}
                    </Col>
                </Row>

            </ParadigmaModal>
        );
    }
}

export default Modal;

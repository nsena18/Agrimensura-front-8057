import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import api from "../../../api";
import apiFunctions from "../../../api/functions.js"

import { Row, Col, Label, Input, InputGroup, FormFeedback, Alert } from 'reactstrap';
import moment from 'moment';
import { formatCurrency } from '../../../functions/functions';

import ParadigmaModal from "../../../components/ParadigmaModal/ParadigmaModal.js"
import ParadigmaAsyncSeeker from "../../../components/ParadigmaAsyncSeeker/ParadigmaAsyncSeeker.js"
import ParadigmaLabeledInput from "../../../components/ParadigmaLabeledInput/ParadigmaLabeledInput.js"
import ParadigmaDatePicker from "../../../components/ParadigmaDatePicker/ParadigmaDatePicker.js"
import ParadigmaCurrencyInput from "../../../components/ParadigmaCurrencyInput/ParadigmaCurrencyInput.js"

import ModalEncomienda from '../../Expedientes/EncomiendaProfesional/Modal'
import ModalComitentes from '../../Comitentes/Modal'

class ModalCobros extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            fecha: moment(),
            comitente_id: null,
            encomiendaProfesional_id: null,
            detalle: '',
            importe: '0,00',
            tipo: 0,
            medioDePago_id: null,
            aplicacionesEncomienda: [],
            postVariables: ['comitente_id', 'encomiendaProfesional_id', 'detalle', 'tipo', 'medioDePago_id'],
            saldoCtaCte: '0,00',
            errors: [],
            alertError: false,
            alertMsj: '',
            loading: false,
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
            tipo: 0,
            medioDePago_id: null,
            aplicacionesEncomienda: [],
            saldoCtaCte: '0,00',
            errors: [],
            alertError: false,
            alertMsj: '',
            loading: false,
        });
    }

    getData() {
        const { action } = this.props;
        const { postVariables, fecha, importe, aplicacionesEncomienda } = this.state;
        let data = {};
        postVariables.forEach(x => {
            data[x] = this.state[x];
        });
        data.fecha = fecha.format('YYYY-MM-DDThh:mm');
        data.importe = parseFloat(importe.replace(',', '.'));

        // Si hay aplicaciones seleccionadas se agregan al data
        if(aplicacionesEncomienda.filter(e => e.isChecked==true).length>0){
            data['aplicacionesEncomienda'] = aplicacionesEncomienda.filter(e => e.isChecked==true).map(d => {return {
                                                                                                                    encomiendaProfesional_id: d.encomiendaProfesional.id,
                                                                                                                    importe: parseFloat(d.importe.replace(',', '.'))
                                                                                                                    }})
        }

        return data;
    }

    setData(data) {
        // let row = this.props.row();
        // // Si la encomienda tiene un movimiento de deuda cargado se recuperan los datos sino asigna los datos por defecto de la encomienda seleccionada
        // if (data.success && data.data!=false) {
        //     this.setState({
        //         id: data.id,
        //         fecha: moment(data.fecha),
        //         comitente_id: data.comitente ? data.comitente.id : null,
        //         encomiendaProfesional_id: data.encomiendaProfesional ? data.encomiendaProfesional.id : null,
        //         detalle: data.detalle,
        //         importe: formatCurrency(data.importe.toString().replace('.',',')),
        //         tipo: data.tipo,
        //     });
        // } else {
        //     this.setState({
        //         comitente_id: row.id,
        //         tipo: 0,
        //     });
        // }
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
                get: false,
                submitType: "PUT",
                title: "Cobros",
                buttonTitle: "Cobros",
                danger: false,
                buttonIcon: "fa fa-plus fa-lg",
                successMessage: "ha sido editado con éxito.",
                saveButton: true,
                saveButtonLabel: "Guardar",
                buttonClass: "",
                disabled: false,
                // id: this.props.id,
            };
        }
    }

    onOpen = () => {
        // Si se selecciona un comitente en la tabla, capturo el id y traigo las encomiendas
        if(this.props.id()!=false){
            let row = this.props.row();
            this.actualizarEncomiendas(row.id)
        }
    }

    // Captura las encomiendas que posean una deuda del comitente seleccionado
    actualizarEncomiendas = (comitente_id) => {
        if(comitente_id!=null){
            this.setState({loading: true}, () => {
                apiFunctions.get(api.cuentasCorrientes.cobroAplicacion,comitente_id, null, null, (response) => {
                    this.setState({
                        aplicacionesEncomienda: response.data.encomiendas.map(e => {return {...e, isChecked: false, importe: '0,00', deuda: (e.estadoDeuda.importe - e.totalAplicado)}}).filter(f => f.deuda>0),
                        saldoCtaCte: Math.round(response.data.saldoCtaCte*100)/100,
                        comitente_id: comitente_id,
                        tipo: 0,
                        loading: false,
                    });
                }, (response) => {
                    this.setState({
                        comitente_id: comitente_id,
                        tipo: 0,
                        loading: false,
                    });
                });
            });
        }
    }

    onValidation = () => {
        const { importe, saldoCtaCte, aplicacionesEncomienda, comitente_id } = this.state;
        const redImpAplicado = (accumulator, currentValue) => accumulator + parseFloat(currentValue.importe.replace(',', '.'));

        let errors = {};
        let valid = true;

        let alertError = false;
        let alertMsj = '';

        if(comitente_id==null){
            errors['comitente_id'] = [{code: "blank", detail: "Selecciones un comitente"}]
            valid = false;
        }

        // Si el importe es 0 y no hay aplicaciones seleccionadas se exige un monto mayor
        if((parseFloat(importe.replace(',', '.'))<=0) && (aplicacionesEncomienda.filter(e => e.isChecked==true).length==0)){
            errors['importe'] = [{code: "blank", detail: "Ingrese un importe mayor a 0"}]
            valid = false;
        }

        // Valida que los importes no superen a la deuda de cada encomienda
        aplicacionesEncomienda.forEach(ae => {
            if(parseFloat(ae.importe.replace(',', '.'))>ae.deuda){
                valid = false;
                alertError = true;
                alertMsj += (alertMsj=='' ? ('Importe superior a la deuda. Encomienda: '+ae.encomiendaProfesional.nroOrden) : (', '+ae.encomiendaProfesional.nroOrden));
            }
        });

        // Valida que la suma de todos los importes aplicados no superen el monto del cobro ni el dinero a favor en cuenta corriente
        if(aplicacionesEncomienda.filter(e => e.isChecked==true).length>0 && alertError==false){
            if (aplicacionesEncomienda.filter(e => e.isChecked==true).reduce(redImpAplicado, 0)>(saldoCtaCte + parseFloat(importe.replace(',', '.')))){
                valid = false;
                alertError = true;
                alertMsj = 'El importe a aplicar supera '+((parseFloat(importe.replace(',', '.'))>0) ? ('al importe del cobro ') : (''))+((parseFloat(importe.replace(',', '.'))>0 && saldoCtaCte>0) ? ('y ') : (''))+((saldoCtaCte>0) ? ('al saldo en Cuenta Corriente') : (''));
            }
        }

        this.setState({errors: errors,
                        alertMsj: alertMsj,
                        alertError: alertError,})

        return valid
    }

    // Invierte el check de la fila seleccionada (Encomiendas). Si se cambia a false, se asigna importe 0, 
    // si se cambia a true se asigna el mayor importe posible ((importe cobro + importe Cta Cte) - suma de aplicados)
    aplicarCheck = (i) => {
        const { saldoCtaCte, importe } = this.state;
        let aplicacionesEncomienda = this.state.aplicacionesEncomienda;
        const redImpAplicado = (accumulator, currentValue) => accumulator + parseFloat(currentValue.importe.replace(',', '.'));
        
        if(i!=null){
            aplicacionesEncomienda[i].isChecked = !aplicacionesEncomienda[i].isChecked,
            aplicacionesEncomienda[i].importe = (aplicacionesEncomienda[i].isChecked==false) ? ('0,00') : (formatCurrency((((saldoCtaCte + parseFloat(importe.replace(',', '.')))-aplicacionesEncomienda.filter(e => e.isChecked==true).reduce(redImpAplicado, 0))<=aplicacionesEncomienda[i].deuda) ? ((saldoCtaCte + parseFloat(importe.replace(',', '.')))-aplicacionesEncomienda.filter(e => e.isChecked==true).reduce(redImpAplicado, 0)) : (aplicacionesEncomienda[i].deuda)));
        }
        this.setState({
            aplicacionesEncomienda: aplicacionesEncomienda,
        })
    }


    render() {
        let vars = this.modalVars();
        const { action, asUsuarios } = this.props;
        const { fecha, comitente_id, encomiendaProfesional_id, detalle, importe, tipo, aplicacionesEncomienda, saldoCtaCte, medioDePago_id, alertError, alertMsj, loading } = this.state;
        const redImpAplicado = (accumulator, currentValue) => accumulator + parseFloat(currentValue.importe.replace(',', '.'));
        
        return (
            <ParadigmaModal
                getUrl={(vars.get ? api.cuentasCorrientes.cobroAplicacion : null)}
                submitUrl={(vars.submitType ? api.cuentasCorrientes.cobroAplicacion : null)}
                submitType={vars.submitType}
                id={comitente_id}

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

                className={'modal-lg'}
            >
            <Row style={loading ? { filter: 'blur(2px)', pointerEvents: 'none' } : {}}>  
                <Col xs={12} className="col-separator mb-2 py-1 mr-md-1">Cobro</Col>
                <Col className="col-6">
                <Row>
                    <Col className="col-12">
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
                    </Col>

                    <Col className="col-12">
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
                                    className={'montoCobros'}
                                    dobleSimboloDecimal={true}
                                    selectOnFocus={true}
                                    onBlurComplete={true}
                                />}
                        />
                    </Col>

                    <Col className="col-12">
                        <ParadigmaLabeledInput
                            md={[4, 8]}
                            label={"Medio de Pago"}
                            error={() => this.getError('medioDePago_id')}
                            inputComponent={
                                <ParadigmaAsyncSeeker
                                    clearable={false}
                                    url={api.cuentasCorrientes.mediosDePago}
                                    value={medioDePago_id}
                                    parameters={{
                                        paginationEnabled:false,
                                        sort:['nombre']
                                    }}
                                    onChange={e => this.setState({medioDePago_id: (e) ? (e.id) : null})}
                                />}
                        />
                    </Col>
                </Row>
                </Col>
                <Col className="col-6">
                <Row>
                    <Col className="col-12">
                        <ParadigmaLabeledInput
                            label="Comitente"
                            md={[4, 8]}
                            inputComponent={
                                <ParadigmaAsyncSeeker
                                    clearable={false}
                                    url={api.comitentes.comitentes}
                                    value={comitente_id}
                                    displayField={'apellido_nombre'}
                                    parameters={{
                                        paginationEnabled:false,
                                        sort:['apellido_nombre']
                                    }}
                                    onChange={e => this.actualizarEncomiendas((e) ? (e.id) : (null))}
                                    CreateComponent={props => <ModalComitentes id={() => {return (comitente_id) ? (comitente_id) : (false)}} 
                                                                                action={"DETAIL"}/>}
                                />
                            }
                            error={() => this.getError('comitente_id')}
                        />
                    </Col>

                    <Col className="col-12">
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
                    </Col>
                </Row>
                </Col>
            </Row>
            {(aplicacionesEncomienda.length>0) &&
            <Row style={loading ? { filter: 'blur(2px)', pointerEvents: 'none' } : {}}>    
                <Col className="col-12 col-separator my-2 py-1 mr-md-1">Aplicaciónes a Encomiendas Profesionales</Col>
                
                {parseFloat(importe.replace(',', '.'))>0 &&
                <Col className="col-6 mb-2">
                    <ParadigmaLabeledInput
                        md={['auto', 5]}
                        label={"Monto Cobro"}
                        error={() => this.getError('importes')}
                        inputComponent={
                            <ParadigmaCurrencyInput 
                                type="text"
                                disabled={true}
                                value={formatCurrency(importe)}
                                onChange={(data) => this.onChangeField('importe', data)}
                                className={'montoDisabled'}
                                dobleSimboloDecimal={true}
                                maskOptions={{prefix: '$ '}}
                            />}
                    />
                </Col>}
                
                {saldoCtaCte>0 &&
                <Col className="col-6 mb-2">
                    <ParadigmaLabeledInput
                        md={['auto', 5]}
                        label={"Saldo Cta. Cte."}
                        error={() => this.getError('saldoCtaCte')}
                        inputComponent={
                            <ParadigmaCurrencyInput 
                                type="text"
                                disabled={true}
                                value={formatCurrency(saldoCtaCte)}
                                onChange={(data) => this.onChangeField('saldoCtaCte', data)}
                                className={'montoDisabled'}
                                maskOptions={{prefix: '$ '}}
                                dobleSimboloDecimal={true}
                            />}
                    />
                </Col>}
                

                <Col className="col-12">
                    <div>
                        <table className="table table-sm"  >
                            <thead>
                                <tr>
                                    <td></td>
                                    <td className="text-center" width={'100'}>Encomienda</td>
                                    <td className="text-center">Importe Total</td>
                                    <td className="text-center">Deuda</td>
                                    <td className="text-center" width={'150'}>Importe a Aplicar</td>
                                </tr>
                            </thead>
                            <tbody>
                                {aplicacionesEncomienda.map((x, i) =>
                                    <tr key={i}>
                                        <td>
                                            <input type="checkbox" onClick={() => this.aplicarCheck(i)} checked={x.isChecked} onChange={() => null}/>
                                        </td>
                                        <td className="text-center" width={'100'}>{x.encomiendaProfesional.nroOrden}</td>
                                        <td className="text-right pr-2">{'$ '+formatCurrency(x.estadoDeuda.importe)}</td>
                                        <td className="text-right pr-2">{'$ '+formatCurrency(x.deuda)}</td>
                                        <td className="text-right" width={'150'}>
                                            <ParadigmaCurrencyInput 
                                                type="text"
                                                disabled={!x.isChecked}
                                                value={x.importe}
                                                onChange={(data) => {let aplicaciones = aplicacionesEncomienda;
                                                                    aplicaciones[i].importe = data;
                                                                    this.onChangeField('aplicacionesEncomienda', aplicaciones)}}
                                                className={'monto '+(((parseFloat(x.importe.replace(',', '.'))>x.deuda) || (parseFloat(x.importe.replace(',', '.'))>(saldoCtaCte + parseFloat(importe.replace(',', '.'))))) ? ('inp_currency_alert') : (''))}
                                                dobleSimboloDecimal={true}
                                                selectOnFocus={true}
                                                onBlurComplete={true}
                                            />
                                        </td>
                                    </tr>)}
                            </tbody>
                        </table>
                        <Row className="mt-2">
                            <Col className="col-7"></Col>
                            <Col className="col-5 cobro_currencyBox pr-4">
                                <ParadigmaLabeledInput 
                                    label={"Total Aplicado"} 
                                    classNames={['lbl_total_resumen pr-0', '']}
                                    md={[5, 7]}
                                    inputComponent={
                                        <ParadigmaCurrencyInput 
                                            type="text"
                                            disabled={true}
                                            value={formatCurrency(aplicacionesEncomienda.filter(e => e.isChecked==true).reduce(redImpAplicado, 0))}
                                            onChange={(data) => null}
                                            maskOptions={{prefix: '$ '}}
                                            className={'montoDisabled'}
                                        />
                                    }
                                />
                            </Col>
                        </Row>
                    </div>

                    <Alert isOpen={alertError} className={'text-center'} toggle={() => this.setState({alertError: !alertError})} color='danger'>{alertMsj}</Alert>
                </Col>
            </Row>}
            </ParadigmaModal>
        );
    }
}

export default ModalCobros;

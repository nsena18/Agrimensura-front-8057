import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import InputMask from 'react-input-mask';

import api from "../../../api";
import apiFunctions from "../../../api/functions.js"

import { formatCurrency } from '../../../functions/functions';

import { Row, Col, Label, Input, InputGroup, FormFeedback, TabContent, TabPane, Nav, NavItem, NavLink, Button, Alert } from 'reactstrap';
import moment from 'moment';

import HistorialItem from './HistorialItem';

import ParadigmaModal from "../../../components/ParadigmaModal/ParadigmaModal.js"
import ParadigmaAsyncSeeker from "../../../components/ParadigmaAsyncSeeker/ParadigmaAsyncSeeker.js"
import ParadigmaLabeledInput from "../../../components/ParadigmaLabeledInput/ParadigmaLabeledInput.js"
import ParadigmaDatePicker from "../../../components/ParadigmaDatePicker/ParadigmaDatePicker.js"
import ParadigmaCurrencyInput from "../../../components/ParadigmaCurrencyInput/ParadigmaCurrencyInput.js"

import TableArchivos from "./TableArchivos.js"

class Modal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,

            tipoEncomienda_id: null,
            objeto_id: null,
            fechaIngreso: moment(),
            nroOrden: '00000000--',
            antecedente: '',
            comitente_id: null,
            nroPresupuesto: '',
            estado:0, 

            // Nomenclatura
            jurisdiccion: 1, //1: municipal, 2: provincial
            circunscripcion: '',
            sector: '',
            fraccion: '',
            quinta: '',
            macizo: '',
            manzana: '',
            lote: '',
            parcela: '',
            estadoLote_id: null,
            situacionLote_id: null,
            // otros
            escritura: '',
            cpia: false,
            observaciones: '',
            entregado: '',
            
            archivoAdjunto: null,
            descargaArchivo: null,

            // datos comitente
            telefono: '',
            telefono2: '',
            telefono3: '',
            contacto: '', 

            // Domicilio del inmueble
            calle: '',
            numero: '',
            codigoPostal: '',

            // Otros
            superficieInmuebles: '',
            cantidadUnidades: 0,
            
            sufijoOrden: '-',

            cambiosDeEstado: [],

            eventosCalendar: [],

            documentosEncomiendas: [],
            // nombre: '',
            postVariables: ['tipoEncomienda_id', 'objeto_id', 'nroOrden', 'antecedente', 'comitente_id', 'nroPresupuesto', 'estado', 'jurisdiccion', 
                            'circunscripcion', 'sector', 'fraccion', 'quinta', 'macizo', 'manzana', 'lote', 'parcela', 'estadoLote_id', 
                            'situacionLote_id', 'escritura', 'cpia', 'observaciones', 'entregado', 'archivoAdjunto',
                            'calle', 'numero', 'codigoPostal', 'superficieInmuebles', 'cantidadUnidades'],
            
            activeTab: 1,
            errors: [],

            importePresupuesto: '0,00',

            objetoEncomienda: null,
            nuevoEstado: null,
            nota_ep: [],
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

            tipoEncomienda_id: null,
            objeto_id: null,
            fechaIngreso: moment(),
            nroOrden: '00000000--',
            antecedente: '',
            comitente_id: null,
            nroPresupuesto: '',
            estado:0, 

            // Nomenclatura
            jurisdiccion: 1, //1: municipal, 2: provincial
            circunscripcion: '',
            sector: '',
            fraccion: '',
            quinta: '',
            macizo: '',
            manzana: '',
            lote: '',
            parcela: '',
            estadoLote_id: null,
            situacionLote_id: null,
            // otros
            escritura: '',
            cpia: false,
            observaciones: '',
            entregado: '',
            
            archivoAdjunto: null,
            descargaArchivo: null,

            // datos comitente
            telefono: '',
            telefono2: '',
            telefono3: '',
            contacto: '', 

            // Domicilio del inmueble
            calle: '',
            numero: '',
            codigoPostal: '',

            // Otros
            superficieInmuebles: '',
            cantidadUnidades: 0,

            sufijoOrden: 'A',
            
            cambiosDeEstado: [],

            eventosCalendar: [],

            documentosEncomiendas: [],

            activeTab: 1,
            errors: [],

            objetoEncomienda: null,

            nuevoEstado: null,

            nota_ep: [],

            importePresupuesto: '0,00',
        });
    }

    getData() {
        const { action, ar_estados } = this.props;
        const { precioUnitario, postVariables, fechaIngreso, circunscripcion, sector, fraccion, quinta, macizo, 
                manzana, lote, parcela, estadoLote_id, situacionLote_id, estado, documentosEncomiendas } = this.state;
        // let data = {};
        // postVariables.forEach(x => {
        //     data[x] = this.state[x];
        // });
        // data['fechaIngreso'] = fechaIngreso.format('YYYY-MM-DDThh:mm')

        // if((ar_estados && ar_estados.filter((f) => f.id==estado).length>0 && ar_estados.filter((f) => f.id==estado)[0].editarEncomienda==true)){
        //     if(circunscripcion!='' && sector!='' && fraccion!='' && quinta!='' && macizo!='' && manzana!='' && lote!='' && parcela!='' && estadoLote_id!=null && situacionLote_id!=null){
        //         data['estado'] = (primerEstado.proximosEstado.length>0) ? (primerEstado.proximosEstado[0].numero) : (primerEstado.id)
        //     }else{
        //         data['estado'] = primerEstado.id
        //     }
        // }

        // data.documentos = documentosEncomiendas.map(p => p.id ? { id: p.id } : { archivo: p.archivo });

        return data;
    }

    setData(data) {
        const { action, ar_estados } = this.props;
        
        if((action!='DETAIL') && (ar_estados.filter((f) => f.id==data.estado).length>0 && ar_estados.filter((f) => f.id==data.estado)[0].editarEncomienda==false)){
            return {
                allowed: false,
                message: 'No se puede editar la encomienda',
            }
        }
        
        if (data.success) {
            this.setState({
                id: data.id,
                estado: data.estado,

                tipoEncomienda_id: (data.tipoEncomienda) ? (data.tipoEncomienda.id) : (null),
                objeto_id: (data.objeto) ? (data.objeto.id) : (null),
                fechaIngreso: moment(data.fechaIngreso),
                nroOrden: data.nroOrden,
                antecedente: data.antecedente,
                comitente_id: (data.comitente) ? (data.comitente.id) : (null),

                telefono: (data.comitente) ? (data.comitente.telefono) : (''),
                telefono2: (data.comitente) ? (data.comitente.telefono2) : (''),
                telefono3: (data.comitente) ? (data.comitente.telefono3) : (''),

                nroPresupuesto: data.nroPresupuesto,
                jurisdiccion: data.jurisdiccion,

                circunscripcion: data.circunscripcion,
                sector: data.sector,
                fraccion: data.fraccion,
                quinta: data.quinta,
                macizo: data.macizo,
                manzana: data.manzana,
                lote: data.lote,
                parcela: data.parcela,
                estadoLote_id: (data.estadoLote) ? (data.estadoLote.id) : (null),
                situacionLote_id: (data.situacionLote) ? (data.situacionLote.id) : (null),

                escritura: data.escritura,
                cpia: data.cpia,
                observaciones: data.observaciones,
                entregado: data.entregado,

                calle: data.calle,
                numero: data.numero,
                codigoPostal: data.codigoPostal,
                superficieInmuebles: data.superficieInmuebles,
                cantidadUnidades: data.cantidadUnidades,

                descargaArchivo: (data.archivoAdjunto) ? (api.expedientes.encomiendaprofesionalarchivo+data.id+'/') : (null),

                cambiosDeEstado: (data.cambio_estado_encomienda) ? (data.cambio_estado_encomienda) : ([]),

                eventosCalendar: (data.eventos_calendar_ep) ? (data.eventos_calendar_ep.sort((a,b) => { return (moment(a.comienzo).isAfter(b.comienzo)) ? (1) : ( (moment(b.comienzo).isAfter(a.comienzo)) ? (-1) : (0) ) })) : ([]),

                documentosEncomiendas: (data.documentos_encomiendas) ? (data.documentos_encomiendas)  : ([]),

                sufijoOrden: (data.nroOrden.substr(9)),
                objetoEncomienda: (data.objeto) ? (data.objeto) : (null),

                nuevoEstado: (ar_estados && ar_estados.filter((f) => f.id==data.estado).length>0 && ar_estados.filter((f) => f.id==data.estado)[0].proximosEstado.length>0) ? (ar_estados.filter((f) => f.id==data.estado)[0].proximosEstado[ar_estados.filter((f) => f.id==data.estado)[0].proximosEstado.length-1].numero) : (null),

                nota_ep: (data.nota_ep) ? (data.nota_ep.sort((a,b) => { return (moment(a.fecha).isAfter(b.fecha)) ? (1) : ( (moment(b.fecha).isAfter(a.fecha)) ? (-1) : (0) ) })) : ([]),

                importePresupuesto: (data.importePresupuesto) ? (data.importePresupuesto.toString().replace('.',',')) : ('0,00'),
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
        const { action, alarma } = this.props;
        if (action == "CREATE") {
            return {
                get: false,
                submitType: "POST",
                title: "Nueva Encomienda Profesional",
                buttonTitle: "Nuevo",
                danger: false,
                buttonIcon: "fa fa-plus fa-lg",
                successMessage: "La Encomienda Profesional ha sido creada con éxito.",
                saveButton: true,
                saveButtonLabel: "Guardar",
                buttonClass: "",
                disabled: false,
            };
        } else if (action == "EDIT") {
            return {
                get: true,
                submitType: "PUT",
                title: "Editar Encomienda Profesional",
                buttonTitle: "Editar",
                danger: false,
                buttonIcon: "fa fa-pencil fa-lg",
                successMessage: "La Encomienda Profesional ha sido editada con éxito.",
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
                title: "Encomienda Profesional",
                // buttonTitle: "Ver",
                buttonTitle: "",
                danger: false,
                buttonIcon: "fa fa-search fa-lg",
                successMessage: "",
                cancelButtonLabel: "Volver",
                saveButton: false,
                buttonClass: alarma ? 'btn_alerta' : '',
                disabled: true,
                id: this.props.id,
            };
        } else if (action == "DELETE") {
            return {
                get: true,
                submitType: "DELETE",
                title: "Eliminar Encomienda Profesional",
                buttonTitle: "Eliminar",
                danger: true,
                buttonIcon: "fa fa-trash fa-lg",
                successMessage: "La Encomienda Profesional ha sido eliminada con éxito.",
                saveButton: true,
                saveButtonLabel: "Eliminar",
                buttonClass: "",
                disabled: true,
                id: this.props.id,
            };
        }
    }

    onValidation = () => {
        const { cantidadUnidades, superficieInmuebles } = this.state;
        let error = {};
        let validate = true;
        
        if (cantidadUnidades<1){
            error.cantidadUnidades= [{code: "required", detail: "La cantidad debe ser mayor a 0"}];
            validate = false;
        }

        if (superficieInmuebles==''){
            error.superficieInmuebles= [{code: "required", detail: "Este campo es obligatorio"}];
            validate = false;
        }

        this.setState({
            errors: error,
        })
        return validate;
    }

    capturarNroOrden = (objeto_id, sufijo) => {
        if(objeto_id!=null){
            apiFunctions.get(api.expedientes.encomiendaUltimoNro, objeto_id, this.props.depth, null, (response) => {
                let e = response.data;
                if(e.nroOrden!=null){
                    let nro = e.nroOrden.substr(0,8);    
                    this.setState({
                        nroOrden: (parseInt(nro)+1).toString().padStart(8,'0')+'-'+sufijo,
                    });
                }else{
                    this.setState({
                        nroOrden: '00000000'+'-'+sufijo,
                    });
                }
                
            });
        }
    }

    selectComitente = (data) => {
        this.setState({
            comitente_id: (data) ? (data.id) : (null),
            telefono: (data) ? (data.telefono) : (''),
            telefono2: (data) ? (data.telefono2) : (''),
            telefono3: (data) ? (data.telefono3) : (''),
        })
    }

    cambiarEstado = () => {
        const { nuevoEstado, id, estado } = this.state;
        if(nuevoEstado!=null && estado!=nuevoEstado){
            apiFunctions.put(api.expedientes.encomiendaCambioEstado, id, {estadoAnterior: estado, estado: nuevoEstado, observaciones: 'Avanzado por Comitente'}, (response) => {
                this.setState({
                    estado: nuevoEstado,
                })
                if(this.props.cargarEncomiendas){
                    this.props.cargarEncomiendas();
                } 
            });
        }else{
            this.setState({
                errors: {nuevoEstado: [{code: "required", detail: "Seleccione un estado"}]},
            })
        }
    }

    render() {
        let vars = this.modalVars();
        const { action, alarma, ar_estados } = this.props;
        const { activeTab, tipoEncomienda_id, objeto_id, fechaIngreso, nroOrden, antecedente, comitente_id, nroPresupuesto, 
                estado, jurisdiccion, circunscripcion,
                sector, fraccion, quinta, macizo, manzana, lote, parcela, estadoLote_id, situacionLote_id, escritura, cpia, observaciones,
                entregado, telefono, telefono2, telefono3, contacto, sufijoOrden,
                calle, numero, codigoPostal, superficieInmuebles, cantidadUnidades, archivoAdjunto, descargaArchivo,
                cambiosDeEstado, objetoEncomienda, documentosEncomiendas, nuevoEstado, eventosCalendar, nota_ep, importePresupuesto } = this.state;
        
        // let idArchivoFinal = null;
        let idPresupuesto = null;
        // for (let i = cambiosDeEstado.length-1; i >= 0; i--) {
        //     const element = cambiosDeEstado[i];
        //     if((element.estado==7) && (idArchivoFinal==null)){
        //         idArchivoFinal = element.id;
        //     }else if((element.estado==2) && (idPresupuesto==null)){
        //         idPresupuesto = element.id;
        //     }
        // }

        for (let i = cambiosDeEstado.length-1; i >= 0; i--) {
            const element = cambiosDeEstado[i];
            if((ar_estados && ar_estados.filter(f => f.id==element.estado).length>0 && ar_estados.filter(f => f.id==element.estado)[0].anvazaCliente)){
                idPresupuesto = element.id;
                break;
            }
        }
        
        // let arrayEstados = ['Creado', 'Datos Completados', 'Presupuesto Enviado', 'Presupuesto Aceptado', 'Pendiente de Medición', 'Medido', 'Pendiente envio de certificado CPA', 'Finalizado', 'Presupuesto Desestimado']
        return (
            <ParadigmaModal
                getUrl={(vars.get ? api.expedientes.encomiendaprofesionalCliente : null)}
                submitUrl={(vars.submitType ? api.expedientes.encomiendaprofesional : null)}
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

                className={'modal-lg'}

                fileUploader

                escClose={true}
            >
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={(this.state.activeTab == 1 ? "active" : "")}
                            onClick={() => { this.setState({ activeTab: 1 }) }}
                        >Datos Generales</NavLink>
                    </NavItem>
                    {/* <NavItem>
                        <NavLink
                            className={(this.state.activeTab == 2 ? "active" : "")}
                            onClick={() => { this.setState({ activeTab: 2 }) }}
                        >Nomenclatura</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={(this.state.activeTab == 3 ? "active" : "")}
                            onClick={() => { this.setState({ activeTab: 3 }) }}
                        >Otros</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={(this.state.activeTab == 5 ? 'active' : '')}
                            onClick={() => { this.setState({ activeTab: 5 }) }}
                        >Archivos</NavLink>
                    </NavItem>*/}
                    <NavItem>
                        <NavLink
                            className={(this.state.activeTab == 4 ? "active" : "")}
                            onClick={() => { this.setState({ activeTab: 4 }) }}
                        >Estado</NavLink>
                    </NavItem>
                    {(eventosCalendar.length>0) &&
                        <NavItem>
                            <NavLink
                                className={(this.state.activeTab == 6 ? "active" : "")}
                                onClick={() => { this.setState({ activeTab: 6 }) }}
                            >Eventos</NavLink>
                        </NavItem>}
                    {(action!='CREATE' && nota_ep.length>0) &&
                        <NavItem>
                            <NavLink
                                className={(this.state.activeTab == 8 ? "active" : "")}
                                onClick={() => { this.setState({ activeTab: 8 }) }}
                            >Notas</NavLink>
                        </NavItem>}
                </Nav>

                <TabContent
                    activeTab={this.state.activeTab}
                    className={"pb-2"}>

                    <TabPane tabId={1} className="py-1">
                        <Row>
                        
                            <Col className={'col-6'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    label={"Tipo Encom."}
                                    inputComponent={
                                        <ParadigmaAsyncSeeker
                                            clearable={true}
                                            disabled={vars.disabled || action!="CREATE"}
                                            url={api.expedientes.tiposdeencomiendaSelect}
                                            value={tipoEncomienda_id}
                                            parameters={{
                                                paginationEnabled:false,
                                                sort:['nombre'],
                                            }}
                                            onChange={(data) => {this.onChangeField('tipoEncomienda_id', (data ? data.id : null)); this.onChangeField('sufijoOrden', (data ? data.abreviatura : ''));}}
                                        />
                                    }
                                    error={() => this.getError('tipoEncomienda_id')}
                                />
                            </Col>

                            <Col className={'col-6'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    label={"Objeto"}
                                    inputComponent={
                                        <ParadigmaAsyncSeeker
                                            clearable={true}
                                            disabled={vars.disabled || action!="CREATE" || tipoEncomienda_id==null}
                                            url={api.expedientes.objetosdetrabajoSelect}
                                            value={objeto_id}
                                            parameters={{
                                                paginationEnabled:false,
                                                sort:['nombre'],
                                                filters:(action=='CREATE') ? ['tipoEncomienda_id='+((tipoEncomienda_id!=null) ? (tipoEncomienda_id.toString()) : ('999'))] : [],
                                            }}
                                            // onChange={(data) => {this.onChangeField('objeto_id', (data ? data.id : null)); this.capturarNroOrden((data ? data.id : null), (data ? data.abreviatura : ''));}}
                                        />
                                    }
                                    error={() => this.getError('objeto_id')}
                                />
                            </Col>

                            <Col className={'col-6'}>

                                {/* <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    disabled={vars.disabled}
                                    label={"Nro. de Orden"}
                                    value={nroOrden}
                                    maxLength={20}
                                    onChange={(e) => this.onChangeField('nroOrden', e.target.value)}
                                    error={() => this.getError('nroOrden')}
                                /> */}

                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    label={"Nro. de Orden"}
                                    inputComponent={
                                        <InputMask 
                                            mask={"99999999-"+sufijoOrden} 
                                            maskChar= {'0'}
                                            disabled={vars.disabled || action!="CREATE"}
                                            value={nroOrden}
                                            onChange={e => this.onChangeField('nroOrden', e.target.value)}
                                            className={"form-control"} 
                                        />
                                    }
                                    error={() => this.getError('nroOrden')}
                                />
                                
                            </Col>
                        
                            <Col className={'col-6'}>
                                <ParadigmaLabeledInput 
                                    md={[4, 8]}
                                    maxLength={50}
                                    label={"Fecha Ingreso"} 
                                    inputComponent={
                                        <ParadigmaDatePicker
                                            disabled={vars.disabled}
                                            value={fechaIngreso}
                                            onChange={(e) => this.setState({ 'fechaIngreso': e })}
                                            datetime={false}
                                        />} 
                                    error={() => this.getError('fechaIngreso')}
                                />
                            </Col>

                            <Col className={'col-6'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    disabled={vars.disabled}
                                    label={"Antecedente"}
                                    value={antecedente}
                                    maxLength={500}
                                    onChange={(e) => this.onChangeField('antecedente', e.target.value)}
                                    error={() => this.getError('antecedente')}
                                />
                            </Col>

                            <Col className={'col-6'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    label={"Comitente"}
                                    inputComponent={
                                        <ParadigmaAsyncSeeker
                                            clearable={true}
                                            disabled={vars.disabled}
                                            url={api.comitentes.comitentesSelect}
                                            value={comitente_id}
                                            displayField={'apellido_nombre'}
                                            parameters={{
                                                paginationEnabled:false,
                                                sort:['apellido_nombre'],
                                            }}
                                            // onChange={(data) => this.onChangeField('comitente_id', (data ? data.id : null))}
                                            onChange={(data) => this.selectComitente(data)}
                                        />
                                    }
                                    error={() => this.getError('comitente_id')}
                                />
                            </Col>

                            <Col className={'col-6'}>
                                <ParadigmaLabeledInput
                                    disabled={true}
                                    md={[4, 8]}
                                    label={"Teléfono N° 1"}
                                    value={telefono}
                                    onChange={(e) => this.onChangeField('telefono', e.target.value)}
                                    error={() => this.getError('telefono')}
                                />
                            </Col>

                            <Col className={'col-6'}>
                                <ParadigmaLabeledInput
                                    disabled={true}
                                    md={[4, 8]}
                                    label={"Teléfono N° 2"}
                                    value={telefono2}
                                    onChange={(e) => this.onChangeField('telefono2', e.target.value)}
                                    error={() => this.getError('telefono2')}
                                />
                            </Col>

                            <Col className={'col-6'}>
                                <ParadigmaLabeledInput
                                    disabled={true}
                                    md={[4, 8]}
                                    label={"Teléfono N° 3"}
                                    value={telefono3}
                                    onChange={(e) => this.onChangeField('telefono3', e.target.value)}
                                    error={() => this.getError('telefono3')}
                                />
                            </Col>

                            <Col className={'col-6'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    disabled={vars.disabled}
                                    label={"Presupuesto"}
                                    value={nroPresupuesto}
                                    maxLength={20}
                                    type={'integer'}
                                    onChange={(e) => this.onChangeField('nroPresupuesto', e.target.value)}
                                    error={() => this.getError('nroPresupuesto')}
                                />
                            </Col>
                        </Row>
                        
                        <Row>
                            <Col className={'col-6'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    disabled={vars.disabled}
                                    label={"Calle"}
                                    value={calle}
                                    maxLength={200}
                                    // type={'integer'}
                                    onChange={(e) => this.onChangeField('calle', e.target.value)}
                                    error={() => this.getError('calle')}
                                />
                            </Col>

                            <Col className={'col-4'}>
                                <ParadigmaLabeledInput
                                    md={[6, 6]}
                                    disabled={vars.disabled}
                                    label={"Número"}
                                    value={numero}
                                    maxLength={10}
                                    type={'integer'}
                                    onChange={(e) => this.onChangeField('numero', e.target.value)}
                                    error={() => this.getError('numero')}
                                />
                            </Col>

                            <Col className={'col-2 pl-1'}>
                                <ParadigmaLabeledInput
                                    md={[3, 9]}
                                    disabled={vars.disabled}
                                    label={"CP"}
                                    value={codigoPostal}
                                    maxLength={6}
                                    type={'integer'}
                                    onChange={(e) => this.onChangeField('codigoPostal', e.target.value)}
                                    error={() => this.getError('codigoPostal')}
                                />
                            </Col>
                        </Row>

                        <Row>
                            <Col className={'col-6'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    disabled={vars.disabled}
                                    label={"Cant. Unidades"}
                                    value={cantidadUnidades}
                                    maxLength={20}
                                    type={'integer'}
                                    onChange={(e) => this.onChangeField('cantidadUnidades', e.target.value)}
                                    error={() => this.getError('cantidadUnidades')}
                                />
                            </Col>

                            <Col className={'col-6'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    disabled={vars.disabled}
                                    label={"Superficie"} // de Inmuebles Seleccionados
                                    value={superficieInmuebles}
                                    maxLength={20}
                                    // type={'integer'}
                                    onChange={(e) => this.onChangeField('superficieInmuebles', e.target.value)}
                                    error={() => this.getError('superficieInmuebles')}
                                />
                            </Col>
                        </Row>

                        {/* {(estado==2 && cambiosDeEstado.length>0) &&
                        <Row className={'mt-3'}>
                            <Col className={'col-12'}>
                                <ParadigmaLabeledInput
                                    md={[2, 10]}
                                    disabled={vars.disabled}
                                    label={"Presupuesto"}
                                    inputComponent={
                                        <Button
                                            tag="a"
                                            color="primary"
                                            target="_blank"
                                            href={api.expedientes.encomiendaCambioEstadoArchivo+cambiosDeEstado[cambiosDeEstado.length-1].id+'/'}
                                        >
                                            <i className="fa fa-download mr-2"></i>
                                            Descargar archivo
                                        </Button>
                                    }
                                />
                            </Col>
                        </Row>} */}

                        
                            
                        {(idPresupuesto!=null) &&
                        <Row className={'mt-3'}>
                            <Col className={'col-6'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    disabled={vars.disabled}
                                    label={"Presupuesto"}
                                    inputComponent={
                                        <Button
                                            tag="a"
                                            color="primary"
                                            target="_blank"
                                            className={'btn_descargar_ep'}
                                            href={api.expedientes.encomiendaCambioEstadoArchivo+idPresupuesto+'/'}
                                        >
                                            <i className="fa fa-download mr-2"></i>
                                            Descargar archivo
                                        </Button>
                                    }
                                />
                            </Col>

                            <Col className={'col-6'}>
                                {/* {(estado==2) &&  */}
                                {(ar_estados && ar_estados.filter(f => f.id==estado).length>0 && ar_estados.filter(f => f.id==estado)[0].anvazaCliente) &&
                                <Fragment>
                                    <Row>
                                        <Col className={'col-12'}>
                                            <ParadigmaLabeledInput
                                                label={'Importe'}
                                                md={[4, 8]}
                                                inputComponent={
                                                    <ParadigmaCurrencyInput 
                                                        type="text"
                                                        disabled={true}
                                                        value={importePresupuesto}
                                                        onChange={(data) => this.onChangeField('importePresupuesto', data)}
                                                        className={'monto'}
                                                        dobleSimboloDecimal={true}
                                                        selectOnFocus={true}
                                                        onBlurComplete={true}
                                                    />
                                                }
                                                error={() => this.getError('nuevoEstado')}
                                            />
                                        </Col>

                                        <Col className={'col-12'}>
                                            <ParadigmaLabeledInput
                                                label={'Avanzar'}
                                                md={[4, 8]}
                                                inputComponent={
                                                    <ParadigmaAsyncSeeker
                                                        clearable={false}
                                                        url={undefined}
                                                        // optionDefault={[{nombre: 'Aceptar', id: 3}, {nombre: 'Desestimar', id: 8}]}
                                                        optionDefault={ar_estados.filter((f) => f.id==estado)[0].proximosEstado.filter(ff => ff.numero!=estado).map(e => {return {nombre: e.nombre, id: e.numero,}})}
                                                        value={nuevoEstado}
                                                        onChange={data => (data) ? (this.setState({nuevoEstado: data.id})): (this.setState({nuevoEstado: nuevoEstado}))}
                                                        CreateComponent={props => <Button
                                                                                        color="primary"
                                                                                        className={'btn_presupuesto_ep'}
                                                                                        onClick={() => {this.cambiarEstado()}}
                                                                                    >
                                                                                        <i className="fa fa-floppy-o"/>
                                                                                    </Button>}
                                                    />
                                                }
                                                error={() => this.getError('nuevoEstado')}
                                            />
                                        </Col>
                                        {alarma==true &&
                                        <Col className={'col-12'}>
                                            <Alert color={'danger'} className={'text-center mt-1'}>Expiro el tiempo establecido</Alert>
                                        </Col>}
                                    </Row>
                                </Fragment>}
                            </Col>
                        </Row>}
                        
                    </TabPane>

                    <TabPane tabId={2} className="py-1">
                        {/* Nomenclatura */}
                        <Row>
                            {/* <Col xs={12} className="col-separator my-2 py-1 mr-md-1">Nomenclatura</Col> */}
                            {/*<Col className={'col-12'}>
                                <ParadigmaLabeledInput
                                    label="Archivo"
                                    md={[2, 10]}
                                    inputComponent={
                                        <Row>
                                            <Col className={'col-6'}>
                                                <Input 
                                                    id={'inp_arch'} 
                                                    onChange={e => this.setState({ archivoAdjunto: e.target.files[0] })} 
                                                    type="file" 
                                                    disabled={vars.disabled} 
                                                />
                                            </Col>
                                            {descargaArchivo!=null &&
                                            <Col className={'col-6'}>
                                                <a href={descargaArchivo}>DESCARGAR</a>
                                            </Col>}
                                        </Row>
                                    }
                                    error={() => this.getError('archivoAdjunto')}
                                />
                            </Col>*/}

                            <Col className={'col-6'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    label={"Jurisdiccion"}
                                    inputComponent={
                                        <ParadigmaAsyncSeeker
                                            clearable={false}
                                            disabled={vars.disabled}
                                            url={undefined}
                                            optionDefault={[{nombre: 'Municipal', id: 1}, {nombre: 'Provincial', id: 2}]}
                                            value={jurisdiccion}
                                            parameters={{
                                                paginationEnabled:false,
                                                sort:['nombre'],
                                            }}
                                            onChange={(data) => this.onChangeField('jurisdiccion', (data ? data.id : null))}
                                        />
                                    }
                                    error={() => this.getError('jurisdiccion')}
                                />
                            </Col>

                            <Col className={'col-6'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    disabled={vars.disabled}
                                    label={"Circunscripcion"}
                                    value={circunscripcion}
                                    maxLength={200}
                                    onChange={(e) => this.onChangeField('circunscripcion', e.target.value)}
                                    error={() => this.getError('circunscripcion')}
                                />
                            </Col>

                            <Col className={'col-6'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    disabled={vars.disabled}
                                    label={"Sector"}
                                    value={sector}
                                    maxLength={200}
                                    onChange={(e) => this.onChangeField('sector', e.target.value)}
                                    error={() => this.getError('sector')}
                                />
                            </Col>

                            <Col className={'col-6'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    disabled={vars.disabled}
                                    label={"Fraccion"}
                                    value={fraccion}
                                    maxLength={200}
                                    onChange={(e) => this.onChangeField('fraccion', e.target.value)}
                                    error={() => this.getError('fraccion')}
                                />
                            </Col>

                            <Col className={'col-6'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    disabled={vars.disabled}
                                    label={"Quinta"}
                                    value={quinta}
                                    maxLength={200}
                                    onChange={(e) => this.onChangeField('quinta', e.target.value)}
                                    error={() => this.getError('quinta')}
                                />
                            </Col>

                            <Col className={'col-6'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    disabled={vars.disabled}
                                    label={"Macizo"}
                                    value={macizo}
                                    maxLength={200}
                                    onChange={(e) => this.onChangeField('macizo', e.target.value)}
                                    error={() => this.getError('macizo')}
                                />
                            </Col>

                            <Col className={'col-6'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    disabled={vars.disabled}
                                    label={"Lote"}
                                    value={lote}
                                    maxLength={200}
                                    onChange={(e) => this.onChangeField('lote', e.target.value)}
                                    error={() => this.getError('lote')}
                                />
                            </Col>

                            <Col className={'col-6'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    disabled={vars.disabled}
                                    label={"Manzana"}
                                    value={manzana}
                                    maxLength={200}
                                    onChange={(e) => this.onChangeField('manzana', e.target.value)}
                                    error={() => this.getError('manzana')}
                                />
                            </Col>

                            <Col className={'col-6'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    disabled={vars.disabled}
                                    label={"Parcela"}
                                    value={parcela}
                                    maxLength={200}
                                    onChange={(e) => this.onChangeField('parcela', e.target.value)}
                                    error={() => this.getError('parcela')}
                                />
                            </Col>

                            <Col className={'col-6'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    label={"Estado Lote"}
                                    inputComponent={
                                        <ParadigmaAsyncSeeker
                                            clearable={true}
                                            disabled={vars.disabled}
                                            url={api.expedientes.estadolotesSelect}
                                            value={estadoLote_id}
                                            parameters={{
                                                paginationEnabled:false,
                                                sort:['nombre'],
                                            }}
                                            onChange={(data) => this.onChangeField('estadoLote_id', (data ? data.id : null))}
                                        />
                                    }
                                    error={() => this.getError('estadoLote_id')}
                                />
                            </Col>

                            <Col className={'col-6'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    label={"Situación Lote"}
                                    inputComponent={
                                        <ParadigmaAsyncSeeker
                                            clearable={true}
                                            disabled={vars.disabled}
                                            url={api.expedientes.situacionlotesSelect}
                                            value={situacionLote_id}
                                            parameters={{
                                                paginationEnabled:false,
                                                sort:['nombre'],
                                            }}
                                            onChange={(data) => this.onChangeField('situacionLote_id', (data ? data.id : null))}
                                        />
                                    }
                                    error={() => this.getError('situacionLote_id')}
                                />
                            </Col>

                        </Row>
                    </TabPane>
                    <TabPane tabId={3} className="py-1">
                        <Row>

                            <Col className={'col-6'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    disabled={vars.disabled}
                                    label={"Escritura"}
                                    value={escritura}
                                    maxLength={300}
                                    onChange={(e) => this.onChangeField('escritura', e.target.value)}
                                    error={() => this.getError('escritura')}
                                />
                            </Col>

                            <Col className={"col-6 pl-0 py-2"}>
                                <label className={"col-12"}>
                                    <span className={'mr-3'} onClick={() => {(!vars.disabled) ? this.setState({cpia: !cpia}): null}}>C.P.I.A.</span>
                                    <input type="checkbox" disabled={vars.disabled} className="filled-in" checked={cpia} onChange={(e) => {}}/>
                                </label>
                            </Col>

                            <Col className={'col-12'}>
                                <ParadigmaLabeledInput
                                    md={[2, 10]}
                                    disabled={vars.disabled}
                                    type={'textarea'}
                                    // rows={5}
                                    label={"Observaciones"}
                                    value={observaciones}
                                    maxLength={1000}
                                    onChange={(e) => this.onChangeField('observaciones', e.target.value)}
                                    error={() => this.getError('observaciones')}
                                />
                            </Col>

                            <Col className={'col-12'}>
                                <ParadigmaLabeledInput
                                    md={[2, 10]}
                                    disabled={vars.disabled}
                                    label={"Entregado"}
                                    value={entregado}
                                    maxLength={300}
                                    onChange={(e) => this.onChangeField('entregado', e.target.value)}
                                    error={() => this.getError('entregado')}
                                />
                            </Col>

                        </Row>
                    </TabPane>

                    <TabPane tabId={5} className="py-1">
                        <Row>
                            <Col className="col-12 col-separator mb-2 py-1">Nuevos Archivos</Col>
                        </Row>
                        <Row>
                            <Col className="col-12 mb-2 py-1">
                                <TableArchivos
                                    action={action}
                                    archivos={this.state.documentosEncomiendas}
                                    onChange={documentosEncomiendas => this.onChangeField('documentosEncomiendas', documentosEncomiendas)}
                                    url={api.expedientes.encomiendadocumento.replace('$id_encomienda', this.props.id())}
                                />
                            </Col>
                        </Row>
                    </TabPane>
                    
                    { action!='CREATE' &&
                    <TabPane tabId={4} className="py-1">

                        <div /*key={`historia-${i}`}*/>
                            <div className="d-flex my-3">
                                <div style={{ minWidth: 120 }}>
                                    {fechaIngreso.format('DD/MM/YYYY')}
                                </div>
                                <div className="text-center px-2">
                                    {
                                        <div
                                            className="historial__icon bg-success rounded-circle d-flex justify-content-center align-items-center"
                                            style={{ width: 25, height: 25 }}
                                        >
                                            <i className="fa fa-arrow-right"></i>
                                        </div>
                                    }
                                </div>
                                <div className="flex-grow-1">
                                    <HistorialItem 
                                        tituloheader = 'creación'
                                        titulo = {'Creacion de Encomienda Profesional - '+((objetoEncomienda) ? (objetoEncomienda.nombre) : (''))}
                                    />
                                </div>
                            </div>
                        </div>

                        {cambiosDeEstado.map((dataestado, i) => 
                        <div key={`historia-${i}`}>
                            <div className="d-flex my-3">
                                <div style={{ minWidth: 120 }}>
                                    {/* {historia.fecha.format('D/MM/YYYY HH:mm')} */}
                                    {moment(dataestado.fecha).format('DD/MM/YYYY')}
                                </div>
                                <div className="text-center px-2">
                                    {
                                        <div
                                            className="historial__icon bg-success rounded-circle d-flex justify-content-center align-items-center"
                                            style={{ width: 25, height: 25 }}
                                        >
                                            <i className="fa fa-arrow-right"></i>
                                        </div>
                                    }
                                </div>
                                <div className="flex-grow-1">
                                    <HistorialItem 
                                        tituloheader = 'cambio de estado'
                                        // titulo = {'Encomienda avanzada de "'+arrayEstados[dataestado.estadoAnterior]+'" a "'+arrayEstados[dataestado.estado]+'"'}
                                        titulo = {'Encomienda avanzada de "'+
                                                // (ar_estados[dataestado.estadoAnterior] ? ar_estados[dataestado.estadoAnterior].nombre : '-')
                                                ((ar_estados && ar_estados.filter((f) => f.id==dataestado.estadoAnterior).length>0) ? (ar_estados.filter((f) => f.id==dataestado.estadoAnterior)[0].nombre) : ('-'))
                                                +'" a "'+
                                                // (ar_estados[dataestado.estado] ? ar_estados[dataestado.estado].nombre : '-')
                                                ((ar_estados && ar_estados.filter((f) => f.id==dataestado.estado).length>0) ? (ar_estados.filter((f) => f.id==dataestado.estado)[0].nombre) : ('-'))
                                                +'"'}
                                        observacion = {dataestado.observaciones}
                                        archivo = {(dataestado.archivoAdjunto) ? (api.expedientes.encomiendaCambioEstadoArchivo+dataestado.id+'/') : null}
                                    />
                                </div>
                            </div>
                        </div>)}
                        
                    </TabPane>}

                    {/* EVENTOS CALENDARIO */}
                    { (eventosCalendar.length>0) &&
                    <TabPane tabId={6} className="py-1">

                        {eventosCalendar.map((evento, i) => 
                            <div key={`historia-${i}`}>
                                <div className="d-flex my-3">
                                    <div style={{ minWidth: 120 }}>
                                        {/* {historia.fecha.format('D/MM/YYYY HH:mm')} */}
                                        {moment(evento.comienzo).format('DD/MM/YYYY')}
                                    </div>
                                    <div className="text-center px-2">
                                        {
                                            <div
                                                className="historial__icon bg-success rounded-circle d-flex justify-content-center align-items-center"
                                                style={{ width: 25, height: 25 }}
                                            >
                                                <i className="fa fa-arrow-right"></i>
                                            </div>
                                        }
                                    </div>
                                    <div className="flex-grow-1">
                                        <HistorialItem 
                                            tituloheader = {'Evento '+((evento.tipoEvento) ? (evento.tipoEvento.nombre) : (''))}
                                            tituloFechas={((moment(evento.comienzo).isSame(moment(evento.fin))) ? (moment(evento.comienzo).format('DD/MM/YYYY HH:mm')) : (moment(evento.comienzo).format('DD/MM/YYYY HH:mm')+' - '+moment(evento.fin).format('DD/MM/YYYY HH:mm')))}
                                            titulo = {(evento.nombre)}
                                            observacion = {evento.descripcion}
                                            // archivo = {(dataestado.archivoAdjunto) ? (api.expedientes.encomiendaCambioEstadoArchivo+dataestado.id+'/') : null}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                        
                    </TabPane>}

                    {/* NOTAS */}
                    { (action!='CREATE' && nota_ep.length>0) &&
                    <TabPane tabId={8} className="py-1">

                        {nota_ep.map((nota, i) => 
                            <div key={`historia-${i}`}>
                            <div className="d-flex my-3">
                                <div style={{ minWidth: 120 }}>
                                    {/* {historia.fecha.format('D/MM/YYYY HH:mm')} */}
                                    {moment(nota.fecha).format('DD/MM/YYYY')}
                                </div>
                                <div className="text-center px-2">
                                    {
                                        <div
                                            className="historial__icon bg-success rounded-circle d-flex justify-content-center align-items-center"
                                            style={{ width: 25, height: 25 }}
                                        >
                                            <i className="fa fa-arrow-right"></i>
                                        </div>
                                    }
                                </div>
                                <div className="flex-grow-1">
                                    <HistorialItem 
                                        tituloheader = {'Nota de '+((nota.autor) ? (nota.autor.last_name+', '+nota.autor.first_name) : (''))}
                                        // subtitulo = {(nota.destinatario && nota.destinatario.length>0) ? ('Destinatario'+((nota.destinatario.length>1) ? ('s: ') : (': '))+(nota.destinatario.map((e) => {return e.last_name+' '+e.first_name}))) : (undefined)}
                                        subtitulo = {(nota.destinatario) ? ('Destinatario: '+(nota.destinatario.last_name+', '+nota.destinatario.first_name)) : (undefined)}
                                        observacion = {nota.descripcion}
                                        // archivo = {(dataestado.archivoAdjunto) ? (api.expedientes.encomiendaCambioEstadoArchivo+dataestado.id+'/') : null}
                                    />
                                </div>
                            </div>
                        </div>
                        )}                    
                    </TabPane>}
                </TabContent>

            </ParadigmaModal>
        );
    }
}

export default Modal;

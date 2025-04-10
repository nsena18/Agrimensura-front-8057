import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import InputMask from 'react-input-mask';

import api from "../../../api";
import apiFunctions from "../../../api/functions.js"

import { formatCurrency } from '../../../functions/functions';

import { Row, Col, Label, Input, InputGroup, FormFeedback, TabContent, TabPane, Nav, NavItem, NavLink, Button } from 'reactstrap';
import moment from 'moment';

import HistorialItem from './HistorialItem';

import ParadigmaModal from "../../../components/ParadigmaModal/ParadigmaModal.js"
import ParadigmaAsyncSeeker from "../../../components/ParadigmaAsyncSeeker/ParadigmaAsyncSeeker.js"
import ParadigmaLabeledInput from "../../../components/ParadigmaLabeledInput/ParadigmaLabeledInput.js"
import ParadigmaDatePicker from "../../../components/ParadigmaDatePicker/ParadigmaDatePicker.js"

import TableArchivos from "./TableArchivos.js"
import TableVisaciones from './TableVisaciones.js';

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
            observacionComitente: '',

            // Domicilio del inmueble
            calle: '',
            numero: '',
            codigoPostal: '',

            // Otros
            superficieInmuebles: '',
            cantidadUnidades: 0,
            
            sufijoOrden: '',

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
            diasEstimadosEncomienda: [], //Dias estimados para cada estado
            nota_ep: [],
            listVisaciones: [],
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
            observacionComitente: '',

            // Domicilio del inmueble
            calle: '',
            numero: '',
            codigoPostal: '',

            // Otros
            superficieInmuebles: '',
            cantidadUnidades: 0,

            sufijoOrden: '',
            
            cambiosDeEstado: [],

            documentosEncomiendas: [],

            eventosCalendar: [],

            activeTab: 1,
            errors: [],

            importePresupuesto: '0,00',
            
            objetoEncomienda: null,
            diasEstimadosEncomienda: [],
            nota_ep: [],
            listVisaciones: [],
        });
    }

    getData() {
        const { action, ar_estados } = this.props;       
        const { precioUnitario, postVariables, fechaIngreso, circunscripcion, sector, fraccion, quinta, macizo, 
                manzana, lote, parcela, estadoLote_id, situacionLote_id, estado, documentosEncomiendas, diasEstimadosEncomienda } = this.state;
        let data = {};
        postVariables.forEach(x => {
            data[x] = this.state[x];
        });
        data['fechaIngreso'] = fechaIngreso.format('YYYY-MM-DDThh:mm')


        // Capturo el primer estado de la lista de estados (primerEstado)
        let primerEstado = (ar_estados && ar_estados.filter((f) => f.primerEstado).length>0) ? (ar_estados.filter((f) => f.primerEstado)[0]) : (null)

        // Si los datos de nomenclatura no estan completos se asigna el primer estado (creado) sino el siguiente (datos completados) 
       /*  if((ar_estados && ar_estados.filter((f) => f.id==estado).length>0 && ar_estados.filter((f) => f.id==estado)[0].editarEncomienda==true)){
            if(circunscripcion!='' && sector!='' && fraccion!='' && quinta!='' && macizo!='' && manzana!='' && lote!='' && parcela!='' && estadoLote_id!=null && situacionLote_id!=null){
                data['estado'] = (primerEstado.proximosEstado.length>0) ? (primerEstado.proximosEstado[0].numero) : (primerEstado.id)
            }else{
                data['estado'] = primerEstado.id
            }
        } */
        data.documentos = documentosEncomiendas.map(p => p.id ? { id: p.id } : { archivo: p.archivo });

        if(action==='CREATE' && diasEstimadosEncomienda.length>0){
            data.diasEstimadosEncomienda = diasEstimadosEncomienda;
        }
        return data;
    }

    setData(data) {
        const { action, ar_estados } = this.props;
        if (data.success) {
            // Si el estado no puede editar encomienda devuelve mensaje de error
            if((action!='DETAIL') && (ar_estados.filter((f) => f.id==data.estado).length>0 && ar_estados.filter((f) => f.id==data.estado)[0].editarEncomienda==false)){
                return {
                    allowed: false,
                    message: 'No se puede editar la encomienda',
                }
            }

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
                observacionComitente: (data.comitente) ? (data.comitente.observaciones) : (''),

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

                cambiosDeEstado: (data.cambio_estado_encomienda) ? (data.cambio_estado_encomienda.sort((a,b) => { return (moment(a.fecha).isAfter(b.fecha)) ? (1) : ( (moment(b.fecha).isAfter(a.fecha)) ? (-1) : (0) ) })) : ([]),

                eventosCalendar: (data.eventos_calendar_ep) ? (data.eventos_calendar_ep.sort((a,b) => { return (moment(a.comienzo).isAfter(b.comienzo)) ? (1) : ( (moment(b.comienzo).isAfter(a.comienzo)) ? (-1) : (0) ) })) : ([]),

                documentosEncomiendas: (data.documentos_encomiendas) ? (data.documentos_encomiendas)  : ([]),

                sufijoOrden: (data.nroOrden.substr(9)),
                objetoEncomienda: (data.objeto) ? (data.objeto) : (null),
                nota_ep: (data.nota_ep) ? (data.nota_ep.sort((a,b) => { return (moment(a.fecha).isAfter(b.fecha)) ? (1) : ( (moment(b.fecha).isAfter(a.fecha)) ? (-1) : (0) ) })) : ([]),

                importePresupuesto: (data.importePresupuesto) ? (data.importePresupuesto.toString().replace('.',',')) : ('0,00'),
            });

            if( action != 'CREATE' ) {
                apiFunctions.get(api.visaciones.listadovisacionesencomiendas, data.id, null, null, (response) => {
                    console.log('response visaciones')
                    console.log(response)
                    this.setState({
                        listVisaciones: response.data
                    })
                });
            }
           
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

    // Validacion de datos
    onValidation = () => {
        const { cantidadUnidades, superficieInmuebles } = this.state;
        let error = {};
        let validate = true;
        
        if (cantidadUnidades<1){
            error.cantidadUnidades= [{code: "required", detail: "La cantidad debe ser mayor a 0"}];
            validate = false;
        }

        /*if (superficieInmuebles==''){
            error.superficieInmuebles= [{code: "required", detail: "Este campo es obligatorio"}];
            validate = false;
        }*/

        this.setState({
            errors: error,
        })
        return validate;
    }

    // Capturo el ultimo numero de orden segun el tipoEncomienda
    capturarNroOrden = (tipoEncomienda_id, sufijo) => {
        if(tipoEncomienda_id!=null){
            apiFunctions.get(api.expedientes.encomiendaUltimoNro, tipoEncomienda_id, this.props.depth, null, (response) => {
                let e = response.data;
                if(e.nroOrden!=null){
                    // capturo los primero 8 dijtos (numeros) y sumo uno
                    let nro = e.nroOrden.substr(0,8);    
                    this.setState({
                        nroOrden: (parseInt(nro)+1).toString().padStart(8,'0')+'-'+sufijo,
                    });
                }else{
                    // si no devuelve un nroOrden asigno el primero
                    this.setState({
                        nroOrden: '00000001'+'-'+sufijo,
                    });
                }
                
            });
        }
    }

    // capturo los datos del comitente seleccionado
    selectComitente = (data) =>{
        this.setState({
            comitente_id: (data) ? (data.id) : (null),
            telefono: (data) ? (data.telefono) : (''),
            telefono2: (data) ? (data.telefono2) : (''),
            telefono3: (data) ? (data.telefono3) : (''),
            observacionComitente: (data) ? (data.observaciones) : (''),
        })
    }

    onOpen = () => {
        const { ar_estados, action } = this.props;
        if(action==='CREATE'){
            let diasAux = [];
            // asigno los dias estimados por defecto al crear una encomienda
            ar_estados.forEach(e => {
                                // if(e.id!=7 && e.id!=8){
                                if(e.sePuedeAvanzar==true || e.primerEstado==true){
                                    diasAux.push({
                                        encomienda_id: null,
                                        estado: e.id,
                                        estado_nombre: e.nombre,
                                        diasEstimados: e.diasEstimados,
                                        habilitado: true,
                                    })
                                }
                            })
            
            this.setState({
                diasEstimadosEncomienda: diasAux.sort((a,b) => {return (a.estado>b.estado) ? (1) : ((b.estado>a.estado) ? (-1) : (0))}),
                estado: (ar_estados && ar_estados.filter((f) => f.primerEstado).length>0) ? (parseInt(ar_estados.filter((f) => f.primerEstado)[0].id)) : (0),
            })
        }
        
    }

    render() {
        let vars = this.modalVars();
        const { action, ar_estados } = this.props;
        const { activeTab, tipoEncomienda_id, objeto_id, fechaIngreso, nroOrden, antecedente, comitente_id, nroPresupuesto, 
                estado, jurisdiccion, circunscripcion,
                sector, fraccion, quinta, macizo, manzana, lote, parcela, estadoLote_id, situacionLote_id, escritura, cpia, observaciones,
                entregado, telefono, telefono2, telefono3, contacto, sufijoOrden,
                calle, numero, codigoPostal, superficieInmuebles, cantidadUnidades, archivoAdjunto, descargaArchivo,
                cambiosDeEstado, objetoEncomienda, documentosEncomiendas, eventosCalendar, observacionComitente, diasEstimadosEncomienda, 
                nota_ep, importePresupuesto, listVisaciones } = this.state;
        
        let idPresupuesto = null;
        for (let i = cambiosDeEstado.length-1; i >= 0; i--) {
            const element = cambiosDeEstado[i];
            if((ar_estados && ar_estados.filter(f => f.id==element.estado).length>0 && ar_estados.filter(f => f.id==element.estado)[0].anvazaCliente)){
                idPresupuesto = element.id;
                break;
            }
        }
        
        return (
            <ParadigmaModal
                getUrl={(vars.get ? api.expedientes.encomiendaprofesional : null)}
                submitUrl={(vars.submitType ? api.expedientes.encomiendaprofesional : null)}
                submitType={vars.submitType}
                id={vars.id}

                onGotData={(data) => this.setData(data)}
                onGotErrors={(errors) => this.setErrors(errors)}
                onSubmit={(e) => this.props.onSubmit(e)}
                onClose={() => this.resetForm()}
                onPreSubmit={() => this.getData()}
                onValidation={() => this.onValidation()}
                onOpen={() => this.onOpen()}

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
                escClose={true}
                fileUploader
            >
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={(this.state.activeTab == 1 ? "active" : "")}
                            onClick={() => { this.setState({ activeTab: 1 }) }}
                        >Datos Generales</NavLink>
                    </NavItem>
                    <NavItem>
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
                    </NavItem>
                    {action!='CREATE' &&
                        <NavItem>
                            <NavLink
                                className={(this.state.activeTab == 4 ? "active" : "")}
                                onClick={() => { this.setState({ activeTab: 4 }) }}
                            >Historial</NavLink>
                        </NavItem>}
                    {(action!='CREATE' && eventosCalendar.length>0) &&
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
                    {(action=='CREATE' && diasEstimadosEncomienda.length>0) &&
                        <NavItem>
                            <NavLink
                                className={(this.state.activeTab == 7 ? "active" : "")}
                                onClick={() => { this.setState({ activeTab: 7 }) }}
                            >Días Estados</NavLink>
                        </NavItem>}
                    {(action!='CREATE' ) &&
                        <NavItem>
                            <NavLink
                                className={(this.state.activeTab == 9 ? "active" : "")}
                                onClick={() => { this.setState({ activeTab: 9 }) }}
                            >Visaciones</NavLink>
                        </NavItem>}

                </Nav>

                <TabContent
                    activeTab={this.state.activeTab}
                    className={"pb-2"}>

                    <TabPane tabId={1} className="py-1">
                        <Row>
                        
                            <Col className={'col-12 col-md-6'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    label={"Tipo Encom. *"}
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
                                            onChange={(data) => {this.onChangeField('tipoEncomienda_id', (data ? data.id : null)); this.onChangeField('sufijoOrden', (data ? data.abreviatura : '')); this.capturarNroOrden((data ? data.id : null), (data ? data.abreviatura : ''));}}
                                        />
                                    }
                                    error={() => this.getError('tipoEncomienda_id')}
                                />
                            </Col>

                            <Col className={'col-12 col-md-6'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    label={"Objeto *"}
                                    inputComponent={
                                        <ParadigmaAsyncSeeker
                                            clearable={true}
                                            disabled={vars.disabled || action!="CREATE" || tipoEncomienda_id==null}
                                            url={api.expedientes.objetosdetrabajo}
                                            value={objeto_id}
                                            parameters={{
                                                paginationEnabled:false,
                                                sort:['nombre'],
                                                filters:(action=='CREATE') ? ['tipoEncomienda_id='+((tipoEncomienda_id!=null) ? (tipoEncomienda_id.toString()) : ('999'))] : [],
                                            }}
                                            onChange={(data) => {this.onChangeField('objeto_id', (data ? data.id : null));}}
                                        />
                                    }
                                    error={() => this.getError('objeto_id')}
                                />
                            </Col>

                            <Col className={'col-12 col-md-6'}>

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
                        
                            <Col className={'col-12 col-md-6'}>
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

                            <Col className={'col-12 col-md-6'}>
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
                            
                            <Col className={'col-12 col-md-6'}>
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
                            <Col className={'col-12 col-md-6'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    disabled={vars.disabled}
                                    label={"Cant. Unidades *"}
                                    classNames={['pr-0','']}
                                    value={cantidadUnidades}
                                    maxLength={20}
                                    type={'integer'}
                                    onChange={(e) => this.onChangeField('cantidadUnidades', e.target.value)}
                                    error={() => this.getError('cantidadUnidades')}
                                />
                            </Col>

                            
                        </Row>
                        <Row>
                            <Col className="col-12 col-separator mt-2 mb-1 py-1">Datos del Comitente</Col>
                        </Row>
                        <Row>
                        <Col className={'col-12 col-md-6'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    label={"Comitente *"}
                                    inputComponent={
                                        <ParadigmaAsyncSeeker
                                            clearable={true}
                                            disabled={vars.disabled}
                                            url={api.comitentes.comitentes}
                                            value={comitente_id}
                                            displayField={'apellido_nombre'}
                                            parameters={{
                                                paginationEnabled:false,
                                                sort:['nombre'],
                                            }}
                                            // onChange={(data) => this.onChangeField('comitente_id', (data ? data.id : null))}
                                            onChange={(data) => this.selectComitente(data)}
                                        />
                                    }
                                    error={() => this.getError('comitente_id')}
                                />
                            </Col>

                            <Col className={'col-12 col-md-6'}>
                                <ParadigmaLabeledInput
                                    disabled={true}
                                    md={[4, 8]}
                                    label={"Teléfono N° 1"}
                                    value={telefono}
                                    onChange={(e) => this.onChangeField('telefono', e.target.value)}
                                    error={() => this.getError('telefono')}
                                />
                            </Col>

                            <Col className={'col-12 col-md-6'}>
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

                            <Col className={'col-12 col-md-6'}>
                                <ParadigmaLabeledInput
                                    disabled={true}
                                    md={[4, 8]}
                                    label={"Teléfono N° 2"}
                                    value={telefono2}
                                    onChange={(e) => this.onChangeField('telefono2', e.target.value)}
                                    error={() => this.getError('telefono2')}
                                />
                            </Col>

                            <Col className={'col-8 col-md-4'}>
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

                            <Col className={'col-4 col-md-2 pl-1'}>
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

                            <Col className={'col-12 col-md-6'}>
                                <ParadigmaLabeledInput
                                    disabled={true}
                                    md={[4, 8]}
                                    label={"Teléfono N° 3"}
                                    value={telefono3}
                                    onChange={(e) => this.onChangeField('telefono3', e.target.value)}
                                    error={() => this.getError('telefono3')}
                                />
                            </Col>

                        
                            <Col className='col-12'>
                                <ParadigmaLabeledInput
                                    md={[2, 10]}
                                    disabled={true}
                                    classNames={['','ta_s_estatico']}
                                    type={'textarea'}
                                    // rows={5}
                                    label={"Obs. Comitente"}
                                    value={observacionComitente}
                                    maxLength={1000}
                                    onChange={(e) => this.onChangeField('observacionComitente', e.target.value)}
                                    error={() => this.getError('observacionComitente')}
                                />
                            </Col>
                            
                            {/* <Col className='col-12'>
                                <a href={api.expedientes.fichaEncomienda.replace('$id_encomienda', this.state.id)} target="_blank">DESCARGAR FICHA</a>
                            </Col> */}
                        </Row>

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

                            <Col className={'col-12 col-md-6'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    label={"Jurisdicción *"}
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

                            <Col className={'col-12 col-md-6'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    disabled={vars.disabled}
                                    label={"Circunscripción *"}
                                    classNames={['pr-0','']}
                                    value={circunscripcion}
                                    maxLength={200}
                                    onChange={(e) => this.onChangeField('circunscripcion', e.target.value)}
                                    error={() => this.getError('circunscripcion')}
                                />
                            </Col>

                            <Col className={'col-12 col-md-6'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    disabled={vars.disabled}
                                    label={"Sector *"}
                                    value={sector}
                                    maxLength={200}
                                    onChange={(e) => this.onChangeField('sector', e.target.value)}
                                    error={() => this.getError('sector')}
                                />
                            </Col>

                            <Col className={'col-12 col-md-6'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    disabled={vars.disabled}
                                    label={"Fracción *"}
                                    value={fraccion}
                                    maxLength={200}
                                    onChange={(e) => this.onChangeField('fraccion', e.target.value)}
                                    error={() => this.getError('fraccion')}
                                />
                            </Col>

                            <Col className={'col-12 col-md-6'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    disabled={vars.disabled}
                                    label={"Quinta *"}
                                    value={quinta}
                                    maxLength={200}
                                    onChange={(e) => this.onChangeField('quinta', e.target.value)}
                                    error={() => this.getError('quinta')}
                                />
                            </Col>

                            <Col className={'col-12 col-md-6'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    disabled={vars.disabled}
                                    label={"Macizo *"}
                                    value={macizo}
                                    maxLength={200}
                                    onChange={(e) => this.onChangeField('macizo', e.target.value)}
                                    error={() => this.getError('macizo')}
                                />
                            </Col>

                            <Col className={'col-12 col-md-6'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    disabled={vars.disabled}
                                    label={"Lote *"}
                                    value={lote}
                                    maxLength={200}
                                    onChange={(e) => this.onChangeField('lote', e.target.value)}
                                    error={() => this.getError('lote')}
                                />
                            </Col>

                            <Col className={'col-12 col-md-6'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    disabled={vars.disabled}
                                    label={"Manzana *"}
                                    value={manzana}
                                    maxLength={200}
                                    onChange={(e) => this.onChangeField('manzana', e.target.value)}
                                    error={() => this.getError('manzana')}
                                />
                            </Col>

                            <Col className={'col-12 col-md-6'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    disabled={vars.disabled}
                                    label={"Parcela *"}
                                    value={parcela}
                                    maxLength={200}
                                    onChange={(e) => this.onChangeField('parcela', e.target.value)}
                                    error={() => this.getError('parcela')}
                                />
                            </Col>

                            <Col className={'col-12 col-md-6'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    label={"Estado Lote *"}
                                    inputComponent={
                                        <ParadigmaAsyncSeeker
                                            clearable={false}
                                            disabled={vars.disabled}
                                            url={api.expedientes.estadolotes}
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

                            <Col className={'col-12 col-md-6'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    label={"Situación Lote *"}
                                    inputComponent={
                                        <ParadigmaAsyncSeeker
                                            clearable={false}
                                            disabled={vars.disabled}
                                            url={api.expedientes.situacionlotes}
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

                            <Col className={'col-12 col-md-6'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    disabled={vars.disabled}
                                    className={['pr-0', '']}
                                    label={"Superficie inm."} // de Inmuebles Seleccionados
                                    value={superficieInmuebles}
                                    maxLength={20}
                                    // type={'integer'}
                                    onChange={(e) => this.onChangeField('superficieInmuebles', e.target.value)}
                                    error={() => this.getError('superficieInmuebles')}
                                />
                            </Col>

                        </Row>
                    </TabPane>
                    <TabPane tabId={3} className="py-1">
                        <Row>
                            {/* Otros */}
                            <Col className={'col-12 col-md-6'}>
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

                            <Col className={"col-12 col-md-6 pl-0 py-2"}>
                                <label className={"col-12"}>
                                    <span className={'mr-3'} onClick={() => {(!vars.disabled) ? this.setState({cpia: !cpia}): null}}>C.P.I.A.</span>
                                    <input type="checkbox" disabled={vars.disabled} className="filled-in" checked={cpia} onChange={(e) => {}}/>
                                </label>
                            </Col>

                            <Col className={'col-12'}>
                                <ParadigmaLabeledInput
                                    md={[2, 10]}
                                    disabled={vars.disabled}
                                    classNames={['', 'ta_m_movil']}
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
                        {/* Archivos */}
                        <Row>
                            <Col className="col-12 mb-2 py-1">
                                <TableArchivos
                                    action={action}
                                    archivos={this.state.documentosEncomiendas}
                                    onChange={documentosEncomiendas => this.onChangeField('documentosEncomiendas', documentosEncomiendas)}
                                    url={api.expedientes.encomiendadocumento.replace('$id_encomienda', this.props.id())}
                                />
                            </Col>


                            <Col className={'col-6'}>
                                    <ParadigmaLabeledInput
                                        md={[5, 7]}
                                        disabled={vars.disabled}
                                        label={"Ficha de medición"}
                                        inputComponent={
                                            <Button
                                                tag="a"
                                                color="primary"
                                                target="_blank"
                                                className={'btn_descargar_ep'}
                                                href={api.expedientes.fichaEncomienda.replace('$id_encomienda', this.state.id)}
                                            >
                                                <i className="fa fa-download mr-2"></i>
                                                Descargar archivo
                                            </Button>
                                        }
                                    />
                            </Col>

                            {(idPresupuesto!=null) &&
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
                            </Col>}
                        </Row>
                    </TabPane>
                    
                    { action!='CREATE' &&
                    <TabPane tabId={4} className="py-1">
                        {/* Historial */}
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
                                        titulo = {'Encomienda avanzada de "'+
                                                // (ar_estados[dataestado.estadoAnterior] ? ar_estados[dataestado.estadoAnterior].nombre : '-')
                                                ((ar_estados && ar_estados.filter((f) => f.id==dataestado.estadoAnterior).length>0) ? (ar_estados.filter((f) => f.id==dataestado.estadoAnterior)[0].nombre) : ('-'))
                                                +'" a "'+
                                                // (ar_estados[dataestado.estado] ? ar_estados[dataestado.estado].nombre : '-')
                                                ((ar_estados && ar_estados.filter((f) => f.id==dataestado.estado).length>0) ? (ar_estados.filter((f) => f.id==dataestado.estado)[0].nombre) : ('-'))
                                                +'"'}
                                        observacion = {(dataestado.estado==2 && parseFloat(importePresupuesto.replace(',','.'))>0) ? 'Importe del Presupuesto: $'+importePresupuesto+'. '+dataestado.observaciones : dataestado.observaciones}
                                        archivo = {(dataestado.archivoAdjunto) ? (api.expedientes.encomiendaCambioEstadoArchivo+dataestado.id+'/') : null}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                        
                    
                    </TabPane>}

                    {/* EVENTOS CALENDARIO */}
                    { (action!='CREATE' && eventosCalendar.length>0) &&
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

                    {/* DIAS ESTIMADOS DE ESTADOS */}
                    { (action=='CREATE' && diasEstimadosEncomienda.length>0) &&
                    <TabPane tabId={7} className="py-1">
                        <Row>
                            <Col className={'mx-auto mt-1 col-8'}>
                                <Row>
                                    <Col className={'col-6 text-center'}>
                                        <Label>{'Estado'}</Label>
                                    </Col>
                                    <Col className={'col-3 text-center'}>
                                        <Label>{'Días Estimados'}</Label>
                                    </Col>
                                    <Col className={'col-3 text-center'}>
                                        <Label>{'Habilitado'}</Label>
                                    </Col>
                                </Row>
                                <hr className={'my-1'}/>
                            </Col>
                        </Row>
                                
                        
                        {diasEstimadosEncomienda.map((d, i) => 
                            <Row>
                                <Col className={'mx-auto col-8'}>
                                    <ParadigmaLabeledInput
                                        disabled={vars.disabled}
                                        md={[6, 6]}
                                        label={d.estado+' - '+d.estado_nombre}
                                        error={() => this.getError('diasEstimados')}
                                        classNames={['lbl_diasestimados', '']}
                                        inputComponent= {
                                            <Row>
                                                <Col className={'col-7'}>
                                                    <Input 
                                                        type={"number"}
                                                        maxLength={4}
                                                        value={d.diasEstimados}
                                                        onChange={(e) => {let dAux = diasEstimadosEncomienda; 
                                                                            dAux[i].diasEstimados = e.target.value; 
                                                                            this.onChangeField('diasEstimadosEncomienda', dAux)}}
                                                        onFocus={(event) => event.target.select()}
                                                    />
                                                </Col>
                                                <Col className={'col-5'} onClick={() => {let dAux = diasEstimadosEncomienda; 
                                                                                        dAux[i].habilitado = !dAux[i].habilitado; 
                                                                                        this.onChangeField('diasEstimadosEncomienda', dAux)}}>
                                                    <input type="checkbox" className="filled-in" checked={d.habilitado} onChange={(e) => {}}/>
                                                </Col>
                                            </Row>
                                        }
                                    />
                                </Col>
                            </Row>
                        )}

                    </TabPane>}

                    { (action!='CREATE') &&
                    <TabPane tabId={9} className="py-1">
                         {listVisaciones.map((dataestado, i) => 
                            <div key={`visacion-${i}`}>
                            <div className="d-flex my-3">
                            <div style={{ minWidth: 120 }}>                                    
                                    {moment(dataestado.created_at).format('DD/MM/YYYY')}
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
                                    <strong>{dataestado.estadosplantillas.nombre}</strong><br/>
                                    <div 
                                        className={
                                            'badge ' + 
                                            (dataestado.estado === 'Definitiva' 
                                              ? 'badge-primary' 
                                              : dataestado.estado === 'Observada' 
                                                ? 'badge-success' 
                                                : 'badge-warning')
                                          }
                                    >{ dataestado.estado }</div><br/>
                                    <span><strong>Fecha Estimación: </strong>{dataestado.fechaestimacion}</span><br/>
                                    <span><strong>Fecha Caducidad: </strong>{dataestado.fechacaducidad}</span><br></br>                                    
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

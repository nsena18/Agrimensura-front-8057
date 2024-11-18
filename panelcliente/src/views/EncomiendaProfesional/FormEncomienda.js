import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Input, Label, Container, Row, Button, ButtonToolbar, Alert, Col, Table, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

import api from '../../api/';
import apiFunctions from "../../api/functions.js";

// import ModalConfirmacion from "./ModalConfirmacion.js"

import ParadigmaLabeledInput from "../../components/ParadigmaLabeledInput/ParadigmaLabeledInput.js"
import ParadigmaAsyncSeeker from "../../components/ParadigmaAsyncSeeker/ParadigmaAsyncSeeker.js"
import ParadigmaDatePicker from "../../components/ParadigmaDatePicker/ParadigmaDatePicker.js"

import jsonToFormData from 'json-form-data';
import InputMask from 'react-input-mask';
import TableArchivos from './TableArchivos.js';

import moment from 'moment';

class PedidosViandas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comitenteNombre: '',

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

            documentosEncomiendas: [],

            isOpenModal: false,
            msjModal: '',
            loading: false,

            comitenteConfirmado: null,
            errors: [],

            ar_estados: [],
        };
    }

    getError(field) {
        let errors = this.state.errors;
        if (errors) return errors[field];
        else return null;
    }

    onChangeField(field, value) {
        const { fecha, tipoMenu } = this.state;
        this.setState(prevState => {
            let errors = prevState.errors;
            if (errors) errors[field] = null;
            prevState.errors = errors;
            prevState[field] = value;
            return prevState;
        });
    }

    componentDidMount = () => {
        // Agrega estilos del panel cliente
        document.getElementsByClassName('main')[0].classList.add('bodyEncomienda');
        document.body.classList.add('bgBody');

        // Capturo los datos del comitente segun el usuario logueado
        apiFunctions.get(api.comitentes.usercomitente, null, null, null, 
            (response) => {
                let data = response.data;
                if(data){
                    this.setState({
                        comitente_id: data.id,
                        telefono: data.telefono,
                        telefono2: data.telefono2,
                        telefono3: data.telefono3,
                        comitenteNombre: data.apellido+', '+data.nombre,
                        comitenteConfirmado: data.confirmacion,
                    })
                }
            });
        
        // Capturo los estados de las encomiendas en ar_estados
        apiFunctions.get(api.expedientes.estadosencomiendaSelect, null, null, {sort:['numero']}, (response) => {
                this.setState({
                    ar_estados: response.data.map((d) => { return {id: d.numero.toString(), 
                                                                    nombre: d.nombre, 
                                                                    background: d.background, 
                                                                    color: d.texto, 
                                                                    diasEstimados: d.diasEstimados,
                                                                    permisosNivel1: d.permisosNivel1,
                                                                    permisosNivel2: d.permisosNivel2,
                                                                    archivoObligatorio: d.archivoObligatorio,
                                                                    labelArchivo: d.labelArchivo,
                                                                    proximosEstado: d.proximosEstado,
                                                                    sePuedeAvanzar: d.sePuedeAvanzar,
                                                                    mensajeError: d.mensajeError,
                                                                    primerEstado: d.primerEstado,
                                                                    editarEncomienda: d.editarEncomienda,
                                                                    tituloModal: d.tituloModal,
                                                                    anvazaCliente: d.anvazaCliente} })
                })
            });
    }

    // Validacion de campos en blanco del formulario
    onValidation = () => {
        const { cantidadUnidades, superficieInmuebles, tipoEncomienda_id, objeto_id, calle, numero, codigoPostal } = this.state;
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

        if (tipoEncomienda_id==null){
            error.tipoEncomienda_id= [{code: "required", detail: "Este campo es obligatorio"}];
            validate = false;
        }

        if (objeto_id==null){
            error.objeto_id= [{code: "required", detail: "Este campo es obligatorio"}];
            validate = false;
        }

        /*if (calle==''){
            error.calle= [{code: "required", detail: "Este campo es obligatorio"}];
            validate = false;
        }

        if (numero==''){
            error.numero= [{code: "required", detail: "Este campo es obligatorio"}];
            validate = false;
        }

        if (codigoPostal==''){
            error.codigoPostal= [{code: "required", detail: "Este campo es obligatorio"}];
            validate = false;
        }*/

        
        this.setState({
            errors: error,
        })
        return validate;
    }


    resetForm = () => {
        const {  } = this.state;

        this.setState({
            tipoEncomienda_id: null,
            objeto_id: null,
            fechaIngreso: moment(),
            nroOrden: '00000000--',
            antecedente: '',
            // comitente_id: null,
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

            documentosEncomiendas: [],
            isOpenModal: false,
            msjModal: '',

            comitenteConfirmado: null,
            errors: [],

            ar_estados: [],
        })
    }

    // Guardar formulario
    onSubmit = () => {
        const { estado, tipoEncomienda_id, objeto_id, fechaIngreso, nroOrden, antecedente, jurisdiccion, circunscripcion, sector, 
                fraccion, quinta, macizo, manzana, lote, parcela, estadoLote_id, situacionLote_id, escritura, observaciones, calle, 
                numero, codigoPostal, superficieInmuebles, cantidadUnidades, comitente_id, archivoAdjunto, documentosEncomiendas, ar_estados } = this.state;
        
        // Si no estan completos los datos de nomenclatura se asigna el primer estado (creado) sino el siguiente (datos completados)
        let estadoAux = null;
        let primerEstado = (ar_estados && ar_estados.filter((f) => f.primerEstado).length>0) ? (ar_estados.filter((f) => f.primerEstado)[0]) : (null)
        if((ar_estados && ar_estados.filter((f) => f.id==estado).length>0 && ar_estados.filter((f) => f.id==estado)[0].editarEncomienda==true)){
            if(circunscripcion!='' && sector!='' && fraccion!='' && quinta!='' && macizo!='' && manzana!='' && lote!='' && parcela!='' && estadoLote_id!=null && situacionLote_id!=null){
                estadoAux = (primerEstado.proximosEstado.length>0) ? (primerEstado.proximosEstado[0].numero) : (primerEstado.id)
            }else{
                estadoAux = primerEstado.id
            }
        }

        if(this.onValidation()){
            let data = {tipoEncomienda_id, 
                        objeto_id,
                        nroOrden,
                        comitente_id,
                        antecedente,
                        jurisdiccion,
                        circunscripcion,
                        sector,
                        fraccion,
                        quinta,
                        macizo,
                        manzana,
                        lote,
                        parcela,
                        estadoLote_id,
                        situacionLote_id,
                        escritura,
                        observaciones,
                        calle,
                        numero,
                        codigoPostal,
                        superficieInmuebles,
                        cantidadUnidades,
                        estado: (estadoAux==null) ? (estado) : (estadoAux), 
                        archivoAdjunto,
                        documentos: documentosEncomiendas.map(p => p.id ? { id: p.id } : { archivo: p.archivo }),
                    };

            data['fechaIngreso'] = moment().format('YYYY-MM-DDThh:mm');
            data = jsonToFormData(data)
            apiFunctions.post(api.expedientes.encomiendaprofesionalCliente, null, data, 
                (response) => {
                    this.setState({
                        isOpenModal: true,
                        msjModal: 'La solicitud ha sido enviada satisfactoriamente, a la brevedad nos pondremos en contacto con usted.',
                    });
                    this.resetForm();
                });
            
        }

    }

    // Modal success
    changeIsOpenModal = () =>{
        const { isOpenModal } = this.state;
        this.setState({isOpenModal: !isOpenModal})
    }

    // Capturo el ultimo numero de orden dependiendo el tipoEncomienda
    capturarNroOrden = (objeto_id, sufijo) => {
        if(objeto_id!=null){
            apiFunctions.get(api.expedientes.encomiendaUltimoNro, objeto_id, this.props.depth, null, (response) => {
                let e = response.data;
                if(e.nroOrden!=null){
                    // Capturo los primero 8 caracteres del nroOrden (los numeros sin el sufijo) para sumarle uno
                    let nro = e.nroOrden.substr(0,8);    
                    this.setState({
                        nroOrden: (parseInt(nro)+1).toString().padStart(8,'0')+'-'+sufijo,
                    });
                }else{
                    // si no devuelve nroOrden asigno el primero
                    this.setState({
                        nroOrden: '00000001'+'-'+sufijo,
                    });
                }
                
            });
        }
    }

    // Quita los estilos del panel cliente
    componentWillUnmount = () =>{
        document.getElementsByClassName('main')[0].classList.remove('bodyEncomienda');
        document.body.classList.remove('bgBody');
    }

    render() {
        const { tipoEncomienda_id, objeto_id, fechaIngreso, nroOrden, antecedente, comitente_id, nroPresupuesto, estado, jurisdiccion, circunscripcion, sector, 
                fraccion, quinta, macizo, manzana, lote, parcela, estadoLote_id, situacionLote_id, escritura, cpia, observaciones, entregado, 
                archivoAdjunto, descargaArchivo, telefono, telefono2, telefono3, contacto, calle, numero, codigoPostal, superficieInmuebles, 
                cantidadUnidades, sufijoOrden, comitenteNombre, documentosEncomiendas, isOpenModal, msjModal, errors, loading, comitenteConfirmado } = this.state;
        const { modernTheme } = this.props;

        if(comitenteConfirmado==false){
            return(
                <div className={'mt-2'} style={{overflow: "auto", maxHeight: "90vh"}}>
                    {
                        Boolean(loading) &&
                        <div className="full-page-loader">
                            <BounceLoader/>
                            <div className="mt-2" style={{ fontSize: '1.5rem' }}>{loading || 'Cargando...'}</div>
                        </div>
                    }
                    {/* <Container className="p-2 px-md-5 position-relative contFormEncomiendas" > */}
                    <Container>
                        <Row className={'mt-4'}>
                            <Col className={"col-12 p_cont_conf p-3"}>
                                <Label className={"p_resumen_pedido text-center"}><span className={'p_lbl_red'}>Usuario no habilitado. Comuníquese con el administrador del sistema</span></Label>
                            </Col>
                        </Row>
                    </Container>
                </div>
            );
        }else{
            return (
                <div className={'mt-2'} style={{overflow: "auto", maxHeight: "90vh"}}>
                    <Container className="contFormEncomiendas">

                        <Row className={'mt-2'}>
                            <Col className={"col-12 title-container"}>
                                <h5 className={"p_title_lbl"}>{"Nueva Encomienda Profesional"}</h5>
                            </Col>
                        </Row>

                        <Row className={'mt-5'}>
                            <Col className={'col-12 col-sm-6 col-md-4'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    label={"Tipo Encom. *"}
                                    classNames={['pr-0','']}
                                    inputComponent={
                                        <ParadigmaAsyncSeeker
                                            clearable={true}
                                            // disabled={vars.disabled || action!="CREATE"}
                                            url={api.expedientes.tiposdeencomiendaSelect}
                                            value={tipoEncomienda_id}
                                            parameters={{
                                                paginationEnabled:false,
                                                sort:['nombre'],
                                            }}
                                            onChange={(data) => {this.onChangeField('tipoEncomienda_id', (data ? data.id : null)); this.onChangeField('sufijoOrden', (data ? data.abreviatura : ''));
                                                                this.capturarNroOrden((data ? data.id : null), (data ? data.abreviatura : '')); if(data==null) this.onChangeField('objeto_id',null); }}
                                        />
                                    }
                                    error={() => this.getError('tipoEncomienda_id')}
                                />
                            </Col>

                            <Col className={'col-12 col-sm-6 col-md-4'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    label={"Objeto *"}
                                    classNames={['pr-0','']}
                                    inputComponent={
                                        <ParadigmaAsyncSeeker
                                            clearable={true}
                                            disabled={(tipoEncomienda_id==null)}
                                            url={api.expedientes.objetosdetrabajoSelect}
                                            value={objeto_id}
                                            parameters={{
                                                paginationEnabled:false,
                                                sort:['nombre'],
                                                filters:(tipoEncomienda_id!=null) ? ['tipoEncomienda_id='+(tipoEncomienda_id.toString())] : [],
                                            }}
                                            onChange={(data) => {this.onChangeField('objeto_id', (data ? data.id : null)); }}
                                        />
                                    }
                                    error={() => this.getError('objeto_id')}
                                />
                            </Col>

                            <Col className={'col-12 col-sm-6 col-md-4'}>
                                <ParadigmaLabeledInput
                                        md={[4, 8]}
                                        label={"Nro. de Orden"}
                                        classNames={['pr-0','']}
                                        inputComponent={
                                            <InputMask 
                                                mask={"99999999-"+sufijoOrden} 
                                                maskChar= {'0'}
                                                disabled={true}
                                                value={nroOrden}
                                                onChange={e => this.onChangeField('nroOrden', e.target.value)}
                                                className={"form-control"} 
                                            />
                                        }
                                        error={() => this.getError('nroOrden')}
                                />
                            </Col>

                            {/*<Col className={'col-4'}>
                                <ParadigmaLabeledInput 
                                    md={[4, 8]}
                                    maxLength={50}
                                    label={"Fecha Ingreso"} 
                                    inputComponent={
                                        <ParadigmaDatePicker
                                            disabled={true}
                                            value={fechaIngreso}
                                            onChange={(e) => this.setState({ 'fechaIngreso': e })}
                                            datetime={false}
                                        />} 
                                    error={() => this.getError('fechaIngreso')}
                                />
                            </Col>*/}
                        </Row>


                        <Row className={'mt-3'}>
                            
                            <Col xs={12} lg={12} className="d-flex align-items-center flex-wrap mt-2 mb-1">
                                <h4 className="d-inline-block display-4 mb-2 subtitle_encomienda">
                                    {'Datos Comitente'}
                                </h4>
                            </Col>

                            <Col className={'col-12 col-sm-6 col-md-4'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    disabled={true}
                                    label={"Comitente"}
                                    value={comitenteNombre}
                                    maxLength={200}
                                    // type={'integer'}
                                    onChange={(e) => this.onChangeField('comitenteNombre', e.target.value)}
                                    error={() => this.getError('comitenteNombre')}
                                />
                            </Col>

                            <Col className={'col-12 col-sm-6 col-md-4'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    disabled={true}
                                    label={"Teléfono"}
                                    value={telefono}
                                    maxLength={200}
                                    // type={'integer'}
                                    onChange={(e) => this.onChangeField('telefono', e.target.value)}
                                    error={() => this.getError('telefono')}
                                />
                            </Col>

                            <Col className={'col-12 col-sm-6 col-md-4'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    disabled={true}
                                    label={"Teléfono 2"}
                                    value={telefono2}
                                    maxLength={200}
                                    // type={'integer'}
                                    onChange={(e) => this.onChangeField('telefono2', e.target.value)}
                                    error={() => this.getError('telefono2')}
                                />
                            </Col>

                        </Row>


                        {/* Domicilio */}
                        <Row className={'mt-3'}>
                            <Col xs={12} lg={12} className="d-flex align-items-center flex-wrap mt-2 mb-1">
                                <h4 className="d-inline-block display-4 mb-2 subtitle_encomienda">
                                    {'Direccion'}
                                </h4>
                            </Col>

                            <Col className={'col-12 col-sm-6 col-md-4'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    // disabled={vars.disabled}
                                    label={"Calle"}
                                    value={calle}
                                    maxLength={200}
                                    // type={'integer'}
                                    onChange={(e) => this.onChangeField('calle', e.target.value)}
                                    error={() => this.getError('calle')}
                                />
                            </Col>

                            <Col className={'col-12 col-sm-6 col-md-4'}>
                                <Row>
                                    <Col className={'col-8'}>
                                        <ParadigmaLabeledInput
                                            md={[6, 6]}
                                            // disabled={vars.disabled}
                                            label={"Número"}
                                            value={numero}
                                            maxLength={9}
                                            type={'integer'}
                                            onChange={(e) => this.onChangeField('numero', e.target.value)}
                                            error={() => this.getError('numero')}
                                        />
                                    </Col>

                                    <Col className={'col-4 pl-0'}>
                                        <ParadigmaLabeledInput
                                            md={[3, 9]}
                                            // disabled={vars.disabled}
                                            label={"CP"}
                                            value={codigoPostal}
                                            maxLength={6}
                                            type={'integer'}
                                            onChange={(e) => this.onChangeField('codigoPostal', e.target.value)}
                                            error={() => this.getError('codigoPostal')}
                                        />
                                    </Col>
                                </Row>
                            </Col>

                            <Col className={'col-12 col-sm-6 col-md-4'}>
                                    <ParadigmaLabeledInput
                                        md={[4, 8]}
                                        // disabled={vars.disabled}
                                        label={"Antecedente"}
                                        value={antecedente}
                                        maxLength={500}
                                        onChange={(e) => this.onChangeField('antecedente', e.target.value)}
                                        error={() => this.getError('antecedente')}
                                    />
                                </Col>
                        </Row>

                        <Row className={'mt-3'}>

                            <Col className={'col-12 col-sm-6 col-md-4'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    // disabled={vars.disabled}
                                    label={"Unidades *"}
                                    value={cantidadUnidades}
                                    maxLength={20}
                                    // classNames={['pr-0','pl-0']}
                                    type={'integer'}
                                    onChange={(e) => this.onChangeField('cantidadUnidades', e.target.value)}
                                    error={() => this.getError('cantidadUnidades')}
                                />
                            </Col>

                        </Row>

                        {/* Nomenclatura */}
                        <Row className={'mt-3'}>
                            <Col xs={12} lg={12} className="d-flex align-items-center flex-wrap mt-2 mb-1">
                                <h4 className="d-inline-block display-4 mb-1 subtitle_encomienda">
                                    {'Nomenclatura'}
                                </h4>
                            </Col>

                            <Col className={'col-12 col-sm-6 col-md-4'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    label={"Jurisdicción"}
                                    inputComponent={
                                        <ParadigmaAsyncSeeker
                                            clearable={false}
                                            // disabled={vars.disabled || disabledEstado}
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

                            <Col className={'col-12 col-sm-6 col-md-4'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    // disabled={vars.disabled || disabledEstado}
                                    label={"Circunscripción"}
                                    value={circunscripcion}
                                    maxLength={200}
                                    onChange={(e) => this.onChangeField('circunscripcion', e.target.value)}
                                    error={() => this.getError('circunscripcion')}
                                />
                            </Col>

                            <Col className={'col-12 col-sm-6 col-md-4'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    // disabled={vars.disabled || disabledEstado}
                                    label={"Sector"}
                                    value={sector}
                                    maxLength={200}
                                    onChange={(e) => this.onChangeField('sector', e.target.value)}
                                    error={() => this.getError('sector')}
                                />
                            </Col>

                            <Col className={'col-12 col-sm-6 col-md-4'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    // disabled={vars.disabled || disabledEstado}
                                    label={"Fracción"}
                                    value={fraccion}
                                    maxLength={200}
                                    onChange={(e) => this.onChangeField('fraccion', e.target.value)}
                                    error={() => this.getError('fraccion')}
                                />
                            </Col>

                            <Col className={'col-12 col-sm-6 col-md-4'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    // disabled={vars.disabled || disabledEstado}
                                    label={"Quinta"}
                                    value={quinta}
                                    maxLength={200}
                                    onChange={(e) => this.onChangeField('quinta', e.target.value)}
                                    error={() => this.getError('quinta')}
                                />
                            </Col>

                            <Col className={'col-12 col-sm-6 col-md-4'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    // disabled={vars.disabled || disabledEstado}
                                    label={"Macizo"}
                                    value={macizo}
                                    maxLength={200}
                                    onChange={(e) => this.onChangeField('macizo', e.target.value)}
                                    error={() => this.getError('macizo')}
                                />
                            </Col>

                            <Col className={'col-12 col-sm-6 col-md-4'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    // disabled={vars.disabled || disabledEstado}
                                    label={"Lote"}
                                    value={lote}
                                    maxLength={200}
                                    onChange={(e) => this.onChangeField('lote', e.target.value)}
                                    error={() => this.getError('lote')}
                                />
                            </Col>

                            <Col className={'col-12 col-sm-6 col-md-4'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    // disabled={vars.disabled || disabledEstado}
                                    label={"Manzana"}
                                    value={manzana}
                                    maxLength={200}
                                    onChange={(e) => this.onChangeField('manzana', e.target.value)}
                                    error={() => this.getError('manzana')}
                                />
                            </Col>

                            <Col className={'col-12 col-sm-6 col-md-4'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    // disabled={vars.disabled || disabledEstado}
                                    label={"Parcela"}
                                    value={parcela}
                                    maxLength={200}
                                    onChange={(e) => this.onChangeField('parcela', e.target.value)}
                                    error={() => this.getError('parcela')}
                                />
                            </Col>

                            <Col className={'col-12 col-sm-6 col-md-4'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    label={"Estado Lote"}
                                    inputComponent={
                                        <ParadigmaAsyncSeeker
                                            clearable={true}
                                            // disabled={vars.disabled || disabledEstado}
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

                            <Col className={'col-12 col-sm-6 col-md-4'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    label={"Situación Lote"}
                                    inputComponent={
                                        <ParadigmaAsyncSeeker
                                            clearable={true}
                                            // disabled={vars.disabled || disabledEstado}
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

                            <Col className={'col-12 col-sm-6 col-md-4'}>
                                <ParadigmaLabeledInput
                                    md={[4, 8]}
                                    // disabled={vars.disabled}
                                    classNames={['pr-0', '']}
                                    label={"Superficie inm."} // de Inmuebles Seleccionados
                                    value={superficieInmuebles}
                                    maxLength={20}
                                    // type={'integer'}
                                    onChange={(e) => this.onChangeField('superficieInmuebles', e.target.value)}
                                    error={() => this.getError('superficieInmuebles')}
                                />
                            </Col>
                            
                        </Row>

                        
                        {/* Otros */}
                        <Row className={'mt-3'}>

                        <Col className={'col-12 col-sm-6 col-md-4'}>
                                {/*<Row>
                                    <Col xs={12} lg={12}>
                                        <ParadigmaLabeledInput
                                            md={[4, 8]}
                                            // disabled={vars.disabled}
                                            label={"Escritura"}
                                            value={escritura}
                                            maxLength={300}
                                            onChange={(e) => this.onChangeField('escritura', e.target.value)}
                                            error={() => this.getError('escritura')}
                                        />
                                    </Col>
                                </Row>*/}
                                <Row className={'mt-2'}>

                                    <Col xs={12} lg={12} className="d-flex align-items-center flex-wrap mt-3 mb-1">
                                        <h4 className="d-inline-block display-4 mb-1 subtitle_encomienda">
                                            {'Archivos'}
                                        </h4>
                                        <span className={'ml-2'}>{'(adjuntar documentación del inmueble)'}</span>
                                    </Col>
                                    <Col xs={12} lg={12}>
                                        <Table size="sm" className="mt-1 t_fe_archivos">
                                            <thead>
                                                <tr>
                                                    <th width={'85%'} className={'py-0'}>
                                                        <label class="btn_carga_archivo">                                        
                                                            <Input 
                                                                type="file" 
                                                                disabled={false}
                                                                id={'file-upload'}
                                                                onChange={e => {if (e.target.files.length>0) {let doc = documentosEncomiendas; 
                                                                                                                doc.push({archivo: e.target.files[0]}); 
                                                                                                                this.setState({documentosEncomiendas: doc}); 
                                                                                                                e.target.value=null;}}}
                                                            />
                                                            <i class="fa fa-plus"/>
                                                        </label>
                                                    </th>
                                                    <th width={'15%'}></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                { documentosEncomiendas.map(
                                                    (archivo, i) =>
                                                        <tr
                                                            key={i}
                                                        >
                                                            <td>{(archivo.archivo) ? archivo.archivo.name : archivo.nombre}</td>
                                                            <td>
                                                                <Button className={'btn_archivo_eliminar'} onClick={() => {let doc = documentosEncomiendas; doc.splice(i,1); this.setState({documentosEncomiendas: doc})}}>
                                                                    <i className="fa fa-minus"/>
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                                { documentosEncomiendas.length === 0 &&
                                                    <tr>
                                                        <td className="text-center" colSpan={3}>No hay archivos</td>
                                                    </tr>
                                                }
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                            </Col>
                            
                            <Col xs={12} lg={12} className="d-flex align-items-center flex-wrap mt-2 mb-1">
                                <h4 className="d-inline-block display-4 mb-1 subtitle_encomienda">
                                    {'Observaciones'}
                                </h4>
                            </Col>
                            
                            {/* <Col className={'col-12 col-md-8'}> */}
                            <Col className={'col-12'}>
                                <ParadigmaLabeledInput
                                    // md={[2, 10]}
                                    // disabled={vars.disabled}
                                    type={'textarea'}
                                    // rows={5}
                                    // label={"Observaciones"}
                                    value={observaciones}
                                    maxLength={1000}
                                    onChange={(e) => this.onChangeField('observaciones', e.target.value)}
                                    error={() => this.getError('observaciones')}
                                />
                            </Col>

                            <Col className={'col-12 mt-2'}>
                                <span className={'s_msjaclaracion'}>
                                    Los campos no detallados serán completados por nuestros asistentes, recuerde adjuntar alguna documentación del inmueble, 
                                    como por ejemplo: escritura, titulo de propiedad, boleto de compra y venta, adjudicación, constancia de escritura 
                                    en tramite, planos de obra, impuesto inmobiliario u otra que usted disponga.
                                </span>
                            </Col>

                        </Row>

                        <Row className={'mt-5'}>
                            <Col xs={12}>
                                <ButtonToolbar className="my-3">
                                    <Button tag={Link} to="/tickets" outline className="mr-auto">
                                        <i className="fa fa-long-arrow-left mr-2"></i>
                                        Volver
                                    </Button>

                                    {
                                        <Button
                                            className="px-4"
                                            color="success"
                                            onClick={() => this.onSubmit()}
                                        >
                                            Enviar solicitud
                                        </Button>
                                    }
                                </ButtonToolbar>
                            </Col>
                        </Row>

                        <Modal isOpen={isOpenModal} toggle={() => this.changeIsOpenModal()} className={"modal-primary"}>
                            <ModalHeader className={''}>Encomienda Profesional</ModalHeader>
                            <ModalBody>
                                
                                <h4 className={'text-center'}>{msjModal}</h4>

                            </ModalBody>
                            <ModalFooter>
                                <Button color="secondary" onClick={() => this.changeIsOpenModal()}>Volver</Button>
                            </ModalFooter>
                        </Modal>

                    </Container>
                </div>
            );
        }
    }
}

export default PedidosViandas;

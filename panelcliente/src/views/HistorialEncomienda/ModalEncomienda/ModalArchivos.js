import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import InputMask from 'react-input-mask';

import api from "../../../api";
import apiFunctions from "../../../api/functions.js"

import { formatCurrency } from '../../../functions/functions';

import { Row, Col, Label, Input, InputGroup, FormFeedback, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import moment from 'moment';

import HistorialItem from './HistorialItem';

import ParadigmaModal from "../../../components/ParadigmaModal/ParadigmaModal.js"
import ParadigmaAsyncSeeker from "../../../components/ParadigmaAsyncSeeker/ParadigmaAsyncSeeker.js"
import ParadigmaLabeledInput from "../../../components/ParadigmaLabeledInput/ParadigmaLabeledInput.js"
import ParadigmaDatePicker from "../../../components/ParadigmaDatePicker/ParadigmaDatePicker.js"

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

            disabledEstado: false, //Si el estado es mayor a 1 no dejo modificar la nomenclatura
            objetoEncomienda: null,
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

            documentosEncomiendas: [],

        });
    }

    getData() {
        const { postVariables, documentosEncomiendas } = this.state;
        let data = {};
        postVariables.forEach(x => {
            data[x] = this.state[x];
        });

        data.documentos = documentosEncomiendas.map(p => p.id ? { id: p.id } : { archivo: p.archivo });

        return data;
    }

    setData(data) {
        const { action, ar_estados } = this.props;
        
        // if((data.estado>6) && (action!='DETAIL')){
        //     return {
        //         allowed: false,
        //         message: 'La encomienda fue '+((data.estado==7) ? ('finalizada') : ('desestimada')),
        //     }
        // }
        if((action!='DETAIL') && (ar_estados.filter((f) => f.id==data.estado).length>0 && ar_estados.filter((f) => f.id==data.estado)[0].editarEncomienda==false)){
            return {
                allowed: false,
                message: 'No se puede editar la encomienda',
            }
        }
        
        if (data.success) {
            this.setState({
                id: data.id,
                
                documentosEncomiendas: (data.documentos_encomiendas) ? (data.documentos_encomiendas.map(e => {return {...e, bloqueado: true}}))  : ([]),

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
                title: "Archivos de la Encomienda",
                danger: false,
                buttonIcon: "fa fa-file-o fa-lg",
                successMessage: "Los archivos han sido guardados con éxito.",
                saveButton: true,
                saveButtonLabel: "Guardar",
                cancelButtonLabel: "Volver",
                buttonClass: "",
                disabled: false,
                id: this.props.id,
            };
        }
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

    selectComitente = (data) =>{
        this.setState({
            comitente_id: (data) ? (data.id) : (null),
            telefono: (data) ? (data.telefono) : (''),
            telefono2: (data) ? (data.telefono2) : (''),
            telefono3: (data) ? (data.telefono3) : (''),
        })
    }

    render() {
        let vars = this.modalVars();
        const { action } = this.props;
        const { documentosEncomiendas } = this.state;
        
        return (
            <ParadigmaModal
                getUrl={(vars.get ? api.expedientes.encomiendaprofesionalCliente : null)}
                submitUrl={(vars.submitType ? api.expedientes.encomiendaprofesionalCliente : null)}
                submitType={vars.submitType}
                id={vars.id}

                onGotData={(data) => this.setData(data)}
                onGotErrors={(errors) => this.setErrors(errors)}
                onSubmit={(e) => {return true}}
                onClose={() => this.resetForm()}
                onPreSubmit={() => this.getData()}

                cancelButtonLabel={vars.cancelButtonLabel}

                title={vars.title}

                danger={vars.danger}
                buttonClass={vars.buttonClass}

                successMessage={vars.successMessage}
                missingIdMessage={"Debe seleccionar una fila."}
                saveButtonLabel={vars.saveButtonLabel}
                buttonIcon={vars.buttonIcon}
                saveButton={vars.saveButton}
                closeButton={true}

                className={'modal-lg'}
                escClose={true}
                fileUploader
            >

                <Row>
                    <Col className="col-12 mb-2 py-1">
                        <TableArchivos
                            action={action}
                            archivos={documentosEncomiendas}
                            onChange={documentosEncomiendas => this.onChangeField('documentosEncomiendas', documentosEncomiendas)}
                            url={api.expedientes.encomiendadocumento.replace('$id_encomienda', this.props.id())}
                        />
                    </Col>
                </Row>

            </ParadigmaModal>
        );
    }
}

export default Modal;

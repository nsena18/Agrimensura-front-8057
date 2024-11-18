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

class Modal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,

            cambiosDeEstado: [],

            documentosEncomiendas: [],
            // nombre: '',
            postVariables: [],
            
            activeTab: 1,
            errors: [],

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
            
            cambiosDeEstado: [],

            documentosEncomiendas: [],

            activeTab: 1,
            errors: [],

            objetoEncomienda: null,
        });
    }

    getData() {
        const { precioUnitario, postVariables, fechaIngreso, circunscripcion, sector, fraccion, quinta, macizo, 
                manzana, lote, parcela, estadoLote_id, situacionLote_id, estado, documentosEncomiendas } = this.state;
        let data = {};
        postVariables.forEach(x => {
            data[x] = this.state[x];
        });
        // data['fechaIngreso'] = fechaIngreso.format('YYYY-MM-DDThh:mm')

        data.documentos = documentosEncomiendas.map(p => p.id ? { id: p.id } : { archivo: p.archivo });

        return data;
    }

    setData(data) {
        const { action } = this.props;
        
        if((data.estado>1) && (action!='DETAIL')){
            return {
                allowed: false,
                message: 'La encomienda ya fue avanzada',
            }
        }
        
        if (data.success) {
            this.setState({
                id: data.id,
                cambiosDeEstado: (data.cambio_estado_encomienda) ? (data.cambio_estado_encomienda) : ([]),
                documentosEncomiendas: (data.documentos_encomiendas) ? (data.documentos_encomiendas)  : ([]),
                objetoEncomienda: (data.objeto) ? (data.objeto) : (null),
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
        if (action == "DETAIL") {
            return {
                get: true,
                submitType: null,
                title: "Archivos de la Encomienda",
                buttonTitle: "Descargar",
                buttonTitle: "",
                danger: false,
                buttonIcon: "fa fa-download fa-lg",
                successMessage: "",
                cancelButtonLabel: "Volver",
                saveButton: false,
                buttonClass: "",
                disabled: true,
                id: this.props.id,
            };
        };
    }

    onValidation = () => {
        const { cantidadUnidades, superficieInmuebles } = this.state;
        let error = {};
        let validate = true;
        
        // if (cantidadUnidades<1){
        //     error.cantidadUnidades= [{code: "required", detail: "La cantidad debe ser mayor a 0"}];
        //     validate = false;
        // }

        // if (superficieInmuebles==''){
        //     error.superficieInmuebles= [{code: "required", detail: "Este campo es obligatorio"}];
        //     validate = false;
        // }

        this.setState({
            errors: error,
        })
        return validate;
    }

    render() {
        let vars = this.modalVars();
        const { action, ar_estados } = this.props;
        const { archivoAdjunto, descargaArchivo, cambiosDeEstado, objetoEncomienda, documentosEncomiendas} = this.state;
        
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

                // className={'modal-lg'}

                fileUploader
                escClose={true}
            >
                {/* Listo los archivos para descargar de cada cambio de estado */}
                {(cambiosDeEstado.filter(f => {return (f.archivoAdjunto!=null)}).length>0) ?

                cambiosDeEstado.filter(f => {return (f.archivoAdjunto!=null)}).map((e) => {
                    return (
                    <Row className={'mt-3'}>
                        <Col className={'col-12'}>
                            <ParadigmaLabeledInput
                                md={[4, 8]}
                                disabled={vars.disabled}
                                label={(ar_estados && ar_estados.filter((f) => f.id!=e.estado && f.proximosEstado.filter((ff) => ff.numero==e.estado).length>0).length>0 && ar_estados.filter((f) => f.id!=e.estado && f.proximosEstado.filter((ff) => ff.numero==e.estado).length>0)[0].labelArchivo!='') ? (ar_estados.filter((f) => f.id!=e.estado && f.proximosEstado.filter((ff) => ff.numero==e.estado).length>0)[0].labelArchivo) : ('Archivo')}
                                inputComponent={
                                    <Button
                                        tag="a"
                                        color="primary"
                                        target="_blank"
                                        className={'btn_descargar_ep'}
                                        href={api.expedientes.encomiendaCambioEstadoArchivo+e.id+'/'}
                                    >
                                        <i className="fa fa-download mr-2"></i>
                                        Descargar archivo
                                    </Button>
                                }
                            />
                        </Col>
                    </Row>)})
                :
                <Row>
                    <Col className={'col-12 text-center'}>
                        <h3>La encomienda no tiene archivos para descargar</h3>
                    </Col>
                </Row>}

            </ParadigmaModal>
        );
    }
}

export default Modal;

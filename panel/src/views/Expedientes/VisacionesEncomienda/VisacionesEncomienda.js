import React, { Component, Fragment } from 'react';
import axios from "axios";
import { Input, Row, Col, FormFeedback, Label, Card, CardTitle, CardBody, Button } from 'reactstrap';

import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

import api from '../../../api/';
import apiFunctions from "../../../api/functions.js"

import ParadigmaAsyncSeeker from "../../../components/ParadigmaAsyncSeeker/ParadigmaAsyncSeeker.js"
import ParadigmaLabeledInput from "../../../components/ParadigmaLabeledInput/ParadigmaLabeledInput.js"
import ParadigmaDatePicker from "../../../components/ParadigmaDatePicker/ParadigmaDatePicker.js"

import moment from 'moment';

import ModalEncomienda from '../EncomiendaProfesional/Modal.js'
import TableVisaciones from './TableVisaciones.js';

var btnModal = {
    width: "33px",
    position: "relative",
    float: "right",
}

class VisacionesEncomieda extends Component {
    constructor() {
        super();
        this.state = {
            ar_estados: [],
            encomienda_id: null,
            cambioEstado: [],
            encomienda: null,
            ar_encomiendas: [],
            filtros: {
                desde: moment().subtract(1, 'year'),
                hasta: moment(),
                comitentes: [],
                estados: [],
            },
            filtrosNomenclatura: {
                circunscripcion: '',
                sector: '',
                manzana: '',
                macizo: '',
                fraccion: '',
                lote: '',
                quinta: '',
            }
        };
    }

    setEncomienda = (value) => {
        let id = (value) ? (value.id) : null;
        if(id!=null){
            apiFunctions.get(api.expedientes.encomiendaprofesional, id, null, null, (response) => {
                let event = response.data;
                this.setState({
                    encomienda_id: id,
                    encomienda: event, 
                    cambioEstado: event.cambio_estado_encomienda.sort((a,b) => { return (moment(a.fecha).isAfter(b.fecha)) ? (1) : ( (moment(b.fecha).isAfter(a.fecha)) ? (-1) : (0) ) })
                })
            });
        }else{
            this.setState({encomienda_id: null, encomienda: null, cambioEstado: [],})
        }
        
    }

    componentDidMount = () => {
        
        apiFunctions.get(api.expedientes.encomiendaprofesional, null, null, {sort:['fechaIngreso']}, (response) => {
            this.setState({
                ar_encomiendas: response.data
            })
        });
        

        // Cargo los estados de la encomienda con sus respectivos colores
        apiFunctions.get(api.expedientes.estadosencomiendaSelect, null, null, {sort:['numero']}, (response) => {
            this.setState({
                ar_estados: response.data.map((d) => { return {id: d.numero.toString(), nombre: d.nombre, background: d.background, color: d.texto} })
            })
        });
    }

    render() {
        const {encomienda_id, cambioEstado, encomienda, ar_estados, ar_encomiendas} = this.state;
        const { desde, hasta, comitentes, estados } = this.state.filtros;
        const { circunscripcion, sector, manzana, macizo, fraccion, lote, quinta } = this.state.filtrosNomenclatura;
        var items = [];
        let side = false;
        
        // let estadosStr = ['Creado', 'Datos Completados', 'Presupuesto Enviado', 'Presupuesto Aceptado', 'Pendiente de Medición', 'Medido', 'Pendiente envio de certificado CPA', 'Finalizado', 'Presupuesto Desestimado']
        if(encomienda!=null){
            
            items.push(
                <VerticalTimelineElement
                    key={items.length.toString()}
                    className="vertical-timeline-element--work success"
                    // date={}
                    iconStyle={{ background: '#20a8d8', color: '#fff' }}
                    icon={<label>1</label>}
                    position={"left"}
                >
                    <h4 className={'mb-1'}>{"Fecha Ingreso: "+moment(encomienda.fechaIngreso).format('DD/MM/YYYY hh:mm')} <div style={btnModal}> <ModalEncomienda action="DETAIL" id={()=>{return (encomienda_id)}}/> </div></h4>
                    <h3 className="vertical-timeline-element-title">{'Creación - Encomienda '+((encomienda.objeto) ? ('"'+encomienda.objeto.nombre+'"') : (''))+' N°'+encomienda.nroOrden}</h3>
                </VerticalTimelineElement>
            );
            
            cambioEstado.forEach(data => {
                items.push(
                    <VerticalTimelineElement
                        key={items.length.toString()}
                        className="vertical-timeline-element--work success"
                        // date={}
                        iconStyle={{ background: `#${ar_estados[data.estado] ? ar_estados[data.estado].background : '12c54b'}`, 
                                     color: `#${ar_estados[data.estado] ? ar_estados[data.estado].color : 'fff'}` }}
                        // icon={<label>{data.estado}</label>}
                        icon={<label>{(items.length+1).toString()}</label>}
                        position={(side) ? "left" : "right"}
                    >
                        <h4 className={'mb-1'}>{"Fecha: "+moment(data.fecha).format('DD/MM/YYYY hh:mm')}</h4>
                        {/* <h3 className="vertical-timeline-element-title">{"Encomienda avanzada de "+estadosStr[data.estadoAnterior]+" a "+estadosStr[data.estado]}</h3> */}
                        <h3 className="vertical-timeline-element-title">{"Encomienda avanzada de "+(ar_estados[data.estadoAnterior] ? ar_estados[data.estadoAnterior].nombre : '-')+" a "+(ar_estados[data.estado] ? ar_estados[data.estado].nombre : '-')}</h3>
                        {data.observaciones!='' && <h5 className="vertical-timeline-element-title mt-1">{"Observación: "+data.observaciones}</h5>}
                        {data.archivoAdjunto!=null && <h5><a href={(data.archivoAdjunto) ? (api.expedientes.encomiendaCambioEstadoArchivo+data.id+'/') : null}>Descargar</a></h5>}
                    </VerticalTimelineElement>
                );
                side = !side;
            });
        }

        // Filtros
        let ar_encomiendasF = ar_encomiendas;
        if(desde!=null && hasta!=null){
            ar_encomiendasF = ar_encomiendasF.filter(e => {return (moment(e.fechaIngreso).isSameOrAfter(moment(desde)) && moment(e.fechaIngreso).isSameOrBefore(moment(hasta)))})
        }

        if(comitentes.length>0){
            ar_encomiendasF = ar_encomiendasF.filter(e => {return (e.comitente && comitentes.includes(e.comitente.id))})
        }

        // Filtros Nomenclatura          
        ar_encomiendasF = ar_encomiendasF.filter(e => {return ( ((circunscripcion=='') || (e.circunscripcion == circunscripcion)) && ((sector=='') || (e.sector == sector)) && ((manzana=='') || (e.manzana == manzana)) && 
                                                                ((macizo=='') || (e.macizo == macizo)) && ((fraccion=='') || (e.fraccion == fraccion)) && ((lote=='') || (e.lote == lote)) && ((quinta=='') || (e.quinta == quinta)) )}) 


        return (
            <div className={'contGeneral'}>
                {/* <div className="row mt-1 ml-2"> */}
                {/* <Row className={'mt-1'}>

                    <Col className="col-12">
                        <Card body className="border-0 p-0 mb-3">
                            <CardTitle className="text-center py-2 mb-0 rep_color">
                                Visaciones
                            </CardTitle>
                            <CardBody>
                                <Row>                                    
                                    <Col className="col-12 col-md-4 col-lg-4">
                                        <ParadigmaLabeledInput
                                            md={[2, 10]}
                                            label={"Comitentes"}
                                            classNames={['pl-md-0','']}
                                            inputComponent={
                                                <ParadigmaAsyncSeeker
                                                    url={api.comitentes.comitentes}
                                                    clearable={true}
                                                    multiselect={true}
                                                    value={comitentes}
                                                    displayField={'apellido_nombre'}
                                                    parameters={{
                                                        paginationEnabled:false,
                                                        sort:['nombre'],
                                                    }}
                                                    onChange={data => {let value = []; 
                                                        if(data!=null){
                                                        data.forEach((e)=>{
                                                            value.push(e.id);
                                                        });}
                                                        this.setState(prevState => ({
                                                            filtros: {
                                                                ...prevState.filtros,
                                                                comitentes: value
                                                            }
                                                        }), this.setEncomienda(null))}}
                                                />
                                            }
                                        />
                                    </Col>                                    
                                </Row>
                                <Row className={'mt-2'}>
                                    <Col className={'col-12 col-md-4 col-lg-4'}>
                                        <ParadigmaLabeledInput
                                            md={[2, 10]}
                                            label={"Encomienda"}
                                            inputComponent={
                                                <ParadigmaAsyncSeeker
                                                    url={api.expedientes.encomiendaprofesional}
                                                    optionDefault={ar_encomiendasF}
                                                    displayField="nroOrden"
                                                    value={encomienda_id}
                                                    onChange={(value) => this.setEncomienda(value)} 
                                                />
                                                
                                            }
                                        />
                                    </Col>
                                </Row>

                            </CardBody>
                        </Card>
                    </Col>

                </Row> */}

                <TableVisaciones />
               
            </div >
        );
    }
}

export default VisacionesEncomieda;

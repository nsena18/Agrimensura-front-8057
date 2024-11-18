import React, { Component, Fragment } from 'react';
import axios from "axios";

import api from '../../api/api';
import apiFunctions from "../../api/functions.js"

import ParadigmaLabeledInput from "../../components/ParadigmaLabeledInput/ParadigmaLabeledInput.js"
import Loader from "../../components/Loader/Loader.js"

import { Row, Col, Table, Label, Input, Container, Button, UncontrolledTooltip } from 'reactstrap';

import ReactTable from 'react-table'
import moment from 'moment';

import Modal from './ModalEncomienda/Modal';
import ModalDescargas from './ModalEncomienda/ModalDescargas';
import ModalArchivos from './ModalEncomienda/ModalArchivos';

import { formatCurrency } from '../../functions/functions';

class HistorialEncomienda extends Component {
    constructor() {
        super();
        this.state = {
            listadeEncomienda: [],
            cliente_id: 1,
            cuitCliente: '',
            nombreCliente: '',
            emailCliente: '',
            confirmacionCliente: false,
            buscar_txt: '',

            ar_estados: [],
            comitente_id: null,

            comitenteConfirmado: null,

            loading: true,
        };
    }

    successComitente = (value) =>{
        let comitente_id = value.data.id;
        // let comitente_lista_precio = value.data.lista_precio;

        this.setState({
            cuitComitente: value.data.documento,
            nombreComitente: value.data.apellido+', '+value.data.nombre,
            comitente_id: comitente_id,
            // emailComitente: value.data.email,
            comitenteConfirmado: value.data.confirmacion,
        });

        this.cargarEncomiendas()

    }

    // Capturo las encomienda del comitente
    cargarEncomiendas = () => {
        const { comitente_id } = this.state;
        if(comitente_id!=null){
            this.setState({loading: true}, () => {
                let parametrosEncomienda = {}
                parametrosEncomienda.filters = ['comitente_id='+comitente_id]
                parametrosEncomienda.sort = ['-fechaIngreso']
                var rta = apiFunctions.get(api.expedientes.encomiendaprofesionalCliente, null, this.props.depth, parametrosEncomienda);
                    rta.then(response => {
                        let listadeEncomienda= response.data;
                        this.setState({
                            cliente_id: comitente_id,
                            listadeEncomienda: listadeEncomienda,
                            loading: false,
                        });
                    });
            });
        }
    }

    componentDidMount = () =>{
        document.getElementsByClassName('main')[0].classList.add('bodyEncomienda');
        document.body.classList.add('bgBody');

        // capturo los datos del comitente logueado
        apiFunctions.get(api.comitentes.usercomitente, null, null, null, this.successComitente, this.errorComitente);

        // Cargo los estados de la encomienda con sus respectivos colores
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

    componentWillUnmount = () =>{
        document.getElementsByClassName('main')[0].classList.remove('bodyEncomienda');
        document.body.classList.remove('bgBody');
    }

    // Avanzar una encomienda (solo aceptar y desestimar una encomienda)
    cambiarEstado = (nuevoEstado, id, estado) => {
        if(nuevoEstado!=null){
            apiFunctions.put(api.expedientes.encomiendaCambioEstado, id, {estadoAnterior: estado, estado: nuevoEstado, observaciones: 'Avanzado por Comitente'}, (response) => {
                // this.setState({
                //     estado: nuevoEstado,
                // })
                this.cargarEncomiendas();
            });
        }
    }

    render() {
        const { cliente_id, listadeEncomienda, buscar_txt, confirmacionCliente, ar_estados, comitenteConfirmado, loading } = this.state;
        
        if(comitenteConfirmado==false){
            return(
                <div className={'mt-2'} style={{overflow: "auto", maxHeight: "90vh"}}>
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

                <Container>
                    <Row className={'mt-2'}>
                        <Col className={"col-12 title-container"}>
                            <h5 className={"p_title_lbl"}>{"Historial de Encomiendas"}</h5>
                        </Col>
                    </Row>

                    <Row className={"my-3"}>
                        <Col className={"col-12 px-0 mt-3"}>
                            <div className={'cont_table_prod'}>
                            {/* {loading==true && <Loader/>} */}
                            <Button outline className="btn_actualizar_gral float-right" onClick={()=>{this.cargarEncomiendas()}} ><i class="fa fa-refresh"/></Button>
                            <Table striped className=" d-md-table p_table_prod" style={loading ? { filter: 'blur(2px)', pointerEvents: 'none' } : {}}>
                                    <thead>
                                        <tr className={'py-2'} style={{width: '100%', minWidth: '1000px'}}>
                                            <th width="13%">N° Orden</th>
                                            <th width="13%">Fecha Ingr.</th>
                                            <th width="16%">Tipo Enc.</th>
                                            <th width="16%">Objeto</th>
                                            <th className="text-center" width="21%">Estado</th>
                                            <th width="9%">Presupuesto</th>
                                            <th width="4%">Arch.</th>
                                            <th width="4%">Desc.</th>
                                            <th width="4%">Ver</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                        (listadeEncomienda && listadeEncomienda.length) ?
                                        listadeEncomienda.map((encomienda, i) =>
                                                <tr
                                                    key={`articulo-${i}`}
                                                    style={{width: '100%', minWidth: '1000px' }}
                                                >
                                                    <td className="" width="11%">{encomienda.nroOrden}</td>
                                                    <td className="" width="10%">{moment(encomienda.fechaIngreso).format('DD/MM/YYYY')}</td>
                                                    <td className="" width="13%">{(encomienda.tipoEncomienda) ? (encomienda.tipoEncomienda.nombre) : ('')}</td>
                                                    <td className="" width="14%">{(encomienda.objeto) ? (encomienda.objeto.nombre) : ('')}</td>
                                                    <td className="" width="16%">
                                                        <div
                                                            className="btn py-0"
                                                            style={{
                                                                background: `#${(ar_estados && ar_estados.filter(f => f.id==encomienda.estado).length>0) ? (ar_estados.filter(f => f.id==encomienda.estado)[0].background) : ('')}`,
                                                                color: `#${(ar_estados && ar_estados.filter(f => f.id==encomienda.estado).length>0) ? (ar_estados.filter(f => f.id==encomienda.estado)[0].color) : ('')}`,
                                                                width: '90%',
                                                                height: 20,
                                                                fontSize: '0.8em',
                                                                marginTop: '0px',
                                                                borderTopWidth: '0px',
                                                            }}
                                                        >
                                                            {/* {(ar_estados[encomienda.estado] ? ((encomienda.estado==2 && encomienda.cambio_estado_encomienda.filter((e) => e.estado==2).length>1) ? 'Represupuestación Enviada' : ar_estados[encomienda.estado].nombre) : '')} */}
                                                            {(ar_estados && ar_estados.filter(f => f.id==encomienda.estado).length>0) ? (ar_estados.filter(f => f.id==encomienda.estado)[0].nombre) : ('')}
                                                        </div>
                                                    </td>
                                                    <td className="" width="9%">
                                                        {/* {(encomienda.estado==2) &&
                                                        <div>
                                                            <Button
                                                                className={'btn_t_presupuesto_check'}
                                                                onClick={() => {this.cambiarEstado(3, encomienda.id, encomienda.estado)}}
                                                            >
                                                                <i className="fa fa-check-circle fa-lg"/>
                                                            </Button>
                                                            <Button
                                                                className={'btn_t_presupuesto_decline'}
                                                                onClick={() => {this.cambiarEstado(8, encomienda.id, encomienda.estado)}}
                                                            >
                                                                <i className="fa fa-times-circle fa-lg"/>
                                                            </Button>
                                                        </div>} */}
                                                        {/* Botones para avanzar encomienda (aceptar o desestimar encomienda "estado anvazaCliente=true") */}
                                                        {(ar_estados && ar_estados.filter(f => f.id==encomienda.estado).length>0 && ar_estados.filter(f => f.id==encomienda.estado)[0].anvazaCliente && ar_estados.filter(f => f.id==encomienda.estado)[0].proximosEstado.length>0) &&
                                                        <div>
                                                            {ar_estados.filter(f => f.id==encomienda.estado)[0].proximosEstado.filter(ff => ff.numero!=encomienda.estado).sort((a,b) => {return (a.numero>b.numero ? 1 : (a.numero<b.numero ? -1 : 0))}).map((e,i) => 
                                                            <Button
                                                                key={i}
                                                                className={'btn_t_presupuesto_check'}
                                                                onClick={() => {this.cambiarEstado(e.numero, encomienda.id, encomienda.estado)}}
                                                                style={{
                                                                    background: `#${(ar_estados && ar_estados.filter(f => f.id==e.numero).length>0) ? (ar_estados.filter(f => f.id==e.numero)[0].background) : ('')}`,  
                                                                    marginLeft: (i!=0) ? '9px' : '1px'
                                                                }}
                                                            >
                                                                <i className={"fa "+(e.iconoEstado ? e.iconoEstado : 'fa-check-circle')+" fa-lg"}/>
                                                            </Button>)}
                                                        </div>} 
                                                    </td>
                                                    <td className="" width="4%">
                                                        <ModalArchivos id={() => {return encomienda.id}} ar_estados={ar_estados} action="EDIT" />
                                                    </td>
                                                    <td className="" width="4%">
                                                        <ModalDescargas id={() => {return encomienda.id}} ar_estados={ar_estados} cargarEncomiendas={this.cargarEncomiendas} action="DETAIL" />
                                                    </td>
                                                    <td className="" width="4%">
                                                        <Modal id={() => {return encomienda.id}} 
                                                                // alarma={(encomienda.estado==2 && encomienda.alarma==true)} 
                                                                alarma={((encomienda.alarma==true) && (ar_estados && ar_estados.filter(f => f.id==encomienda.estado).length>0) && (ar_estados.filter(f => f.id==encomienda.estado)[0].anvazaCliente))} 
                                                                cargarEncomiendas={this.cargarEncomiendas} action="DETAIL"
                                                                ar_estados={ar_estados} />
                                                    </td>
                                                </tr>
                                            ) :
                                            <tr>
                                                <td className="text-center" colSpan="6">No hay encomiendas.</td>
                                            </tr>
                                        }
                                    </tbody>
                            </Table>
                            </div>

                        </Col>

                    </Row>

                </Container>
            );
        }
    }
}

export default HistorialEncomienda;

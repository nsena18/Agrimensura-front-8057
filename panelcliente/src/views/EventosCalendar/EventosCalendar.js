import React, { Component, Fragment } from 'react';
import axios from "axios";

import api from '../../api/api';
import apiFunctions from "../../api/functions.js"

import ParadigmaLabeledInput from "../../components/ParadigmaLabeledInput/ParadigmaLabeledInput.js"
import Loader from '../../components/Loader/Loader.js'

import { Row, Col, Table, Label, Input, Container, Button, UncontrolledTooltip } from 'reactstrap';

import ReactTable from 'react-table'
import moment from 'moment';

import ModalEvento from './ModalEventos/Modal';
// import ModalDescargas from './ModalEncomienda/ModalDescargas';

import { formatCurrency } from '../../functions/functions';

class EventosCalendar extends Component {
    constructor() {
        super();
        this.state = {
            eventos: [],
            listadeEncomienda: [],
            cliente_id: 1,
            cuitCliente: '',
            nombreCliente: '',
            emailCliente: '',
            confirmacionCliente: false,

            comitente_id: null,

            comitenteConfirmado: null,

            loading: true,
        };
    }

    componentDidMount = () =>{
        document.getElementsByClassName('main')[0].classList.add('bodyEncomienda');
        document.body.classList.add('bgBody');

        this.traerEventos();
    }

    // Capturo los eventos del usuario
    traerEventos = () =>{
        this.setState({loading: true}, () => {
            let parameters = {};
            let filters = ['fin[date__gte]='+moment().format('YYYY-MM-DD'),'comienzo[date__lte]='+moment().add(12, 'months').format('YYYY-MM-DD')];
            parameters.filters = filters;        
            apiFunctions.get(api.calendar.eventosUsuarioEncomienda, null, this.props.depth, parameters, (response) => {
                let event = response.data;
                // genero el array de eventos para el calendario
                event.map(function(obj){ 
                    let comienzo = new Date(obj.comienzo);
                    let fin = new Date(obj.fin);
                    // obj.titulo = obj.titulo + ' - '+ moment(comienzo).format('HH:mm');
                    obj.comienzo = comienzo;
                    obj.fin = fin;
                    //obj.titulo = (moment(comienzo).format('HH:mm')+' '+obj.titulo);
                    obj.visibleNombre = (obj.visible==2) ? ('Todos') : ((obj.usuario) ? (obj.usuario.map((e)=> e.last_name+', '+e.first_name+'; ')) : '');
                    obj.tooltip = obj.titulo;
                });

                this.setState({
                    eventos: event.sort((a, b) => {return (moment(a.comienzo).isAfter(moment(b.comienzo)) ? (1) : ((moment(b.comienzo).isAfter(moment(a.comienzo))) ? (-1) : (0)))}),
                    loading: false,
                });
            }
            );
        });
    }

    componentWillUnmount = () =>{
        document.getElementsByClassName('main')[0].classList.remove('bodyEncomienda');
        document.body.classList.remove('bgBody');
    }

    render() {
        const { listadeEncomienda, comitenteConfirmado, eventos, loading } = this.state;
        
        if(comitenteConfirmado==false){
            return(
                <div className={'mt-2'} style={{overflow: "auto", maxHeight: "90vh"}}>
                    <Container /*fluid={disabled}*/ className="p-2 px-md-5 position-relative contFormEncomiendas" >
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
                            <h5 className={"p_title_lbl"}>{"Eventos en Calendario"}</h5>
                        </Col>
                    </Row>

                    <Row className={"my-3"}>
                        <Col className={"col-12 px-0"}>
                            <div className={'cont_table_prod'}>
                            {/* {loading==true && <Loader/>} */}
                            <Button outline className="btn_actualizar_gral float-right" onClick={()=>{this.traerEventos()}} ><i class="fa fa-refresh"/></Button>
                            <Table striped className="mt-3 d-md-table p_table_prod" style={loading ? { filter: 'blur(2px)', pointerEvents: 'none' } : {}}>
                                    <thead>
                                        <tr className={'py-2'}>
                                            <th width="25%">Evento</th>
                                            <th width="15%">Fecha</th>
                                            <th width="20%">Tipo</th>
                                            <th width="35%">Descripción</th>
                                            <th width="5%">Ver</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                        (eventos && eventos.length) ?
                                        eventos.map((evento, i) =>
                                                <tr
                                                    key={`articulo-${i}`}
                                                    // style={{height:'100px'}}
                                                    className={(moment(evento.comienzo).isSame(moment(), 'date')) ? ('t_eventoActual') : ('')}
                                                >
                                                    <td className="pl-3" width="25%">{evento.titulo}</td>
                                                    <td className="pl-3" width="15%">{moment(evento.comienzo).format('DD/MM/YYYY HH:mm')}</td>
                                                    <td className="pl-3" width="20%">{(evento.tipoEventoNombre) ? (evento.tipoEventoNombre) : ('')}</td>
                                                    <td className="pl-3" width="35%">{evento.descripcion}</td>
                                                    <td className="pl-3 mt-3" width="5%">
                                                        <ModalEvento id={() => {return evento.id}} action="DETAIL" />
                                                    </td>
                                                </tr>
                                            ) :
                                            <tr>
                                                <td className="text-center" colSpan="6">No hay eventos pendientes.</td>
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

export default EventosCalendar;

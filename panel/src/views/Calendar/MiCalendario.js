import React, { Component, Fragment } from 'react';
import { Button, Popover, UncontrolledPopover, PopoverHeader, PopoverBody, Label, Row, Col} from 'reactstrap';

import axios from "axios";

import api from '../../api/api';
import apiFunctions from "../../api/functions.js"
import Loader from "../../components/Loader/Loader.js"

import Modal from "./Modal"

import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

import Calendar from './Calendar';

import { DateTimeFormatter, DateFormatter } from "../../functions/functions.js"

import moment from 'moment';

class MiCalendario extends Component {
    constructor() {
        super();
        this.state = {
            events:[],
            evento_id : null,
            fecha_desde: moment().subtract(4, 'months'),
            fecha_hasta: moment().add(6, 'months'),
            usuario_id: null,
            pop_referencias: false,
            referencias: [],
            ar_estados:[],
            loading: true,
        };
    }

    traerTiposEventos = () => {
        let parameters = {};
        let fields = ['id','nombre','backgroundColor'];
        parameters.fields = fields;   
        apiFunctions.get(api.calendar.tipoEventos, null, this.props.depth, parameters, (response) => {
            let event = response.data;
            this.setState({
                referencias: event,
            });
        }
        );
    }

    traerEventos = (fecha_desde, fecha_hasta) => {
        //const {fecha_desde, fecha_hasta} = this.state;
        let parameters = {};
        let filters = ['fin[date__gte]='+fecha_desde.format('YYYY-MM-DD'),'comienzo[date__lte]='+fecha_hasta.format('YYYY-MM-DD')];
        parameters.filters = filters;        
        apiFunctions.get(api.calendar.eventosUsuario, null, this.props.depth, parameters, (response) => {
            let event = response.data;
            event.map(function(obj){ 
                let comienzo = new Date(obj.comienzo);
                let fin = new Date(obj.fin);
                obj.titulo = obj.titulo + ' - '+ moment(comienzo).format('HH:mm');
                obj.comienzo = comienzo;
                obj.fin = fin;
                //obj.titulo = (moment(comienzo).format('HH:mm')+' '+obj.titulo);
                obj.visibleNombre = (obj.visible==2) ? ('Todos') : ((obj.usuario) ? (obj.usuario.map((e)=> e.last_name+', '+e.first_name+'; ')) : '');
                obj.tooltip = obj.titulo;
             });

            this.setState({
                events: event,
                loading: false,
            });
        }
        );
    }

    onSubmit = () => {
        const {fecha_desde, fecha_hasta} = this.state;
        this.traerEventos(fecha_desde, fecha_hasta);
    }

    componentDidMount = () => {
        const {fecha_desde, fecha_hasta} = this.state;

        apiFunctions.get(api.usuarios.perfil, null, this.props.depth, null, (response) => {

            let usuario_id = (response.data.id) ? (response.data.id) : (null)

            this.setState({
                usuario_id: usuario_id,
            });

        });

        // Cargo los estados de la encomienda con sus respectivos colores
        apiFunctions.get(api.expedientes.estadosencomiendaSelect, null, null, {sort:['numero']}, (response) => {
            this.setState({
                ar_estados: response.data.map((d) => { return {id: d.numero.toString(), nombre: d.nombre, background: d.background, color: d.texto} })
            })
        });

        this.traerEventos(fecha_desde, fecha_hasta);
        this.traerTiposEventos();
    }

    onRangeChange = (e) => {
        const {fecha_desde, fecha_hasta} = this.state;
        let start = moment(e.start);
        let end = moment(e.end);

        if (fecha_desde.isAfter(start.subtract(2, 'months'))){

            this.setState({
                fecha_desde: start.subtract(4, 'month'),
                fecha_hasta: fecha_hasta.subtract(2, 'month')
            });
            this.traerEventos(start.subtract(4, 'month'), fecha_hasta);
        }

        if (fecha_hasta.isBefore(end.add(2, 'months'))){

            this.setState({
                fecha_desde: fecha_desde.add(2, 'month'),
                fecha_hasta: end.add(6, 'month')
            });
            this.traerEventos(fecha_desde, end.add(6, 'month'));
        }

    }

    render() {
        const { events, evento_id, fecha_desde, fecha_hasta, usuario_id, pop_referencias, referencias, ar_estados } = this.state;
        
        return (
            <Row className={'container-calendar-row'}>
                <Col className={"col-12 mt-2 mb-1"}>
                    {<Modal action="CREATE" onSubmit={this.onSubmit} usuario_id={usuario_id} />}
                    
                    <Button className="btn-ref-calendar icon btn btn-sm h-100 btn-calendar-modal" id="Popover1" onClick={()=>{this.setState({pop_referencias:!pop_referencias})}} >Referencias</Button>
                    <Button className="btn-ref-calendar icon btn btn-sm h-100 btn-calendar-modal mr-1" onClick={()=>{this.traerEventos(this.state.fecha_desde, this.state.fecha_hasta)}} ><i class="fa fa-refresh"/></Button>
                    
                    <Popover placement="bottom" isOpen={pop_referencias} target="Popover1" toggle={()=>{this.setState({pop_referencias:!pop_referencias})}}>
                        <PopoverBody>
                        {referencias.map((e, i)=>
                            <Row key={i} className={"row-refpop"}>
                                <Col className="col-6">
                                    <Label className="lbl-refpop">{e.nombre}</Label>
                                </Col>
                                <Col className="col-6">    
                                    <div className="btn color-refpop" style={{background: `#${e.backgroundColor}`,}}></div>
                                </Col>
                            </Row>
                        )}
                        </PopoverBody>
                    </Popover>
                </Col>
                <Col className={"col-12 container-calendar"}>
                    <Calendar
                        events={events}
                        selectable={true}
                        //onSelectEvent={(e) => {this.setState({evento_id: (e) ? (e.id) : (null)})}}
                        onRangeChange={(e) => {this.onRangeChange(e)}}
                        activeModal={true}
                        modalFields={[{label:'Título', field:'titulo'},{label:'Visible para', field:'visibleNombre'},{label:'Tipo de Evento', field:'tipoEventoNombre'}, {label:'Comienzo', field:'comienzo'}, {label:'Fin', field:'fin'}, {label:'Descripción', field:'descripcion'}]}
                        messages={{next: '>', previous:'<'}}
                        components={
                            {
                              eventWrapper: ({ event, children }) => (
                                <Fragment>
                                    <ContextMenuTrigger id={'event'}>
                                        <div
                                        onContextMenu={
                                            e => { 
                                            this.setState({evento_id: event.id});
                                            e.preventDefault();
                                            }
                                        }
                                        >
                                            {children}
                                        </div>
                                    </ContextMenuTrigger>
                                    
                                </Fragment> 
                                
                              )
                            }
                        }
                    />
                </Col>

                <ContextMenu id={'event'}>
                    <MenuItem>                        
                        <Modal action="DETAIL" onSubmit={this.onSubmit} id={() => {return evento_id}} ar_estados={ar_estados}/>
                    </MenuItem>
                    <MenuItem>
                        <Modal action="EDIT" onSubmit={this.onSubmit} id={() => {return evento_id}} ar_estados={ar_estados}/>
                    </MenuItem>
                    <MenuItem>
                        <Modal action="DELETE" onSubmit={this.onSubmit} id={() => {return evento_id}} ar_estados={ar_estados}/>
                    </MenuItem>
                </ContextMenu>
            </Row>
            
        );
    }
}

export default MiCalendario;
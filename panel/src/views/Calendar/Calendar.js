import React, { Component, useState } from 'react';
import PropTypes from "prop-types";

import { Label, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import BigCalendar from 'react-big-calendar' //BigCalendar 0.19.2
// import * as BigCalendar from 'react-big-calendar'

import moment from 'moment'

import './calendar.css';

//moment.locale('es');
const localizer = BigCalendar.momentLocalizer(moment);

class Calendar extends Component {
    constructor() {
        super();
        this.state = {
            isOpen: false,
            selectEvent: {},
        };
    }

    static propTypes = {
        events: PropTypes.array, //Array de eventos {titulo, comienzo, fin, allDay, tooltip, backgroundColor, color}
        lengthAgenda: PropTypes.number, //Cantidad de dias que se mostraran en la agenda
        toolbar: PropTypes.bool, //Si es true muestra el toolbar de navegacion (default true)
        popup: PropTypes.bool, //Si es true cuando se trunquen eventos se podran ver en un popup (default true)

        selectable: PropTypes.bool, //Permite seleccionar en la grilla
        onSelectSlot: PropTypes.func, //funcion que se ejecuta cuando se selecciona en el calendario (selectable tiene que estar en true) 

        messages: PropTypes.object, //Objeto de titulos {next, previous, today, month, week, day, agenda}

        onNavigate: PropTypes.func, //funcion cambio de dia
        onView: PropTypes.func, //funcion cambio de vista (mes, semana, dia, etc)

        onRangeChange: PropTypes.func, //funcion cambio de rango de fechas
        onSelectEvent: PropTypes.func, //funcion seleccion de evento

        classNameCont: PropTypes.string, //className div container

        //Modal eventos
        activeModal: PropTypes.bool, //Activa modal al seleccionar un evento (por defecto false)
        modalFields: PropTypes.array, //Array de los campos a mostrar en el modal de eventos (cada item debe contener el par label, field ejemplo: {label: 'Título', field:'titulo'})

        modalActionData: PropTypes.object, //Objeto de configuracion ModalEvents (title - closeButtonLabel - closeButtonColor - className - labelClass - fieldClass - rowClass)

        components: PropTypes.any, //Components de eventos

        showMultiDayTimes: PropTypes.bool, //mostrar eventos de varios días con horas de inicio y finalización específicas (default false) estando en falso se muestran en la parte superior
	};


    eventStyleGetter = (event, start, end, isSelected) => {
        var style = {
            backgroundColor: (event.backgroundColor) ? ('#'+event.backgroundColor) : (null),
            borderRadius: '0px',
            color: (event.color) ? ('#'+event.color) : (null),
            border: '0.5px solid white',
            display: 'block',
            /*paddingTop: '5px',
            paddingBottom: '5px',*/
            opacity: (isSelected) ? (0.78) : (1),
        };
        return {
            style: style
        };
    }

    //Modal eventos
    toggle = (e) => {
        this.setState({
            isOpen: !this.state.isOpen,
            selectEvent: e,
        });
    }

    render() {
        const { isOpen, selectEvent } = this.state;
        const { events, lengthAgenda, toolbar, popup, selectable, onSelectSlot, messages, onNavigate, onView, 
                onRangeChange, onSelectEvent, classNameCont, modalFields, activeModal, modalActionData, components, showMultiDayTimes} = this.props;
                
        return (
            <div className={(classNameCont) ? (classNameCont) : ("bigCalendar-container")}>
                {(activeModal) && <EventModal toggle={this.toggle} isOpen={isOpen} selectEvent={selectEvent} modalFields={modalFields} modalActionData={modalActionData}/>}
                <BigCalendar
                    localizer={localizer}
                    //configuracion accessor eventos
                    titleAccessor="titulo"
                    startAccessor="comienzo"
                    endAccessor="fin"
                    tooltipAccessor={"tooltip"}

                    //array de eventos
                    events={(events) ? (events) : ([])}

                    //configuracion calendar
                    length={(lengthAgenda) ? (lengthAgenda) : (30)}
                    toolbar={(toolbar!=undefined) ? (toolbar) : (true)}
                    popup={(popup!=undefined) ? (popup) : (true)}
                    selectable={(selectable!=undefined) ? (selectable) : (false)}

                    //mensajes de navegacion toolbar
                    messages={{
                        next: (messages && messages.next) ? (messages.next) : ("Sig."),
                        previous: (messages && messages.previous) ? (messages.previous) : ("Ant."),
                        today: (messages && messages.today) ? (messages.today) : ("Hoy"),
                        month: (messages && messages.month) ? (messages.month) : ("Mes"),
                        week: (messages && messages.week) ? (messages.week) : ("Semana"),
                        day: (messages && messages.day) ? (messages.day) : ("Día"),
                        agenda: (messages && messages.agenda) ? (messages.agenda) : ("Agenda"),
                    }}

                    //funciones navegacion
                    onSelectSlot={(e) => {if (onSelectSlot) (onSelectSlot(e))}}
                    onNavigate={(e) => {if (onNavigate) (onNavigate(e))}}
                    onView={(e) => {if (onView) (onView(e))}}
                    onRangeChange={(e) => {if (onRangeChange) (onRangeChange(e))}}
                    onSelectEvent={(e) => {this.toggle(e); if (onSelectEvent) (onSelectEvent(e))}}

                    eventPropGetter={this.eventStyleGetter}
                    components={(components!=undefined) ? (components) : ({})}

                    showMultiDayTimes={(showMultiDayTimes!=undefined) ? (showMultiDayTimes) : (false)}
                />
            </div>
        );
    }
}

class EventModal extends Component {

    constructor() {
        super();
        this.state = {

        };
    }

    render() {
        const { isOpen, selectEvent, toggle, modalActionData} = this.props;
        const actionData = {
                            title: (modalActionData && modalActionData.title) ? (modalActionData.title) : ('Detalle Evento'),
                            closeButtonLabel: (modalActionData && modalActionData.closeButtonLabel) ? (modalActionData.closeButtonLabel) : ('Volver'),
                            closeButtonColor: (modalActionData && modalActionData.closeButtonColor) ? (modalActionData.closeButtonColor) : ('secondary'),
                            className: (modalActionData && modalActionData.className) ? (modalActionData.className) : ('bg-primary'),
                            labelClass: (modalActionData && modalActionData.labelClass) ? (modalActionData.labelClass) : ('col-4 field-title'),
                            fieldClass: (modalActionData && modalActionData.fieldClass) ? (modalActionData.fieldClass) : ('col-8'),
                            rowClass: (modalActionData && modalActionData.rowClass) ? (modalActionData.rowClass) : (''),
                        };

        const modalFields = (this.props.modalFields) ? (this.props.modalFields) : ([{label: 'Título', field:'titulo'}, {label: 'Comienzo', field:'comienzo'}, {label: 'Fin', field:'fin'}]);

        return (
            <div>
                <Modal isOpen={isOpen} toggle={() => toggle(null)}>
                    <ModalHeader toggle={toggle} className={actionData['className']} >{actionData['title']}</ModalHeader>
                    <ModalBody>
                        {(selectEvent) && modalFields.map((e) => {
                            let label= e.label;
                            let field= e.field;
                            return (<Row className={actionData['rowClass']}>
                                <Col className={actionData['labelClass']}>
                                    <Label>{label}:</Label> 
                                </Col>
                                <Col className={actionData['fieldClass']}>
                                    <Label>{(selectEvent[field]) ? ((selectEvent[field] instanceof Date) ? (moment(selectEvent[field]).format('DD/MM/YYYY HH:mm')) : (selectEvent[field])) : ('')}</Label>
                                </Col>
                            </Row>)
                        })}
                        
                    </ModalBody>
                    <ModalFooter>
                        <Button color={actionData['closeButtonColor']} 
                                onClick={() => toggle(null)}> 
                            {actionData['closeButtonLabel']}
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        );

    }
}


export default Calendar;
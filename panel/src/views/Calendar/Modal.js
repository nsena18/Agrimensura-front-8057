import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ParadigmaModal from "../../components/ParadigmaModal/ParadigmaModal.js"
import api from "../../api";

import { Row, Col, Label, ButtonGroup, Button, Input, UncontrolledTooltip } from 'reactstrap';

import ParadigmaAsyncSeeker from "../../components/ParadigmaAsyncSeeker/ParadigmaAsyncSeeker.js"
import ParadigmaLabeledInput from "../../components/ParadigmaLabeledInput/ParadigmaLabeledInput.js"
import ParadigmaDatePicker from "../../components/ParadigmaDatePicker/ParadigmaDatePicker.js"

import moment from 'moment';

import ModalEncomienda from '../Expedientes/EncomiendaProfesional/Modal'

class Modal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nombre:'',
            tipoEvento_id:'',
            comienzo:moment(),
            fin:moment(),
            descripcion:'',
            visible:1, //1: Usuario, 2: Todos
            // usuario_id:null,
            usuario:[],
            comitentes:[],
            encomiendaProfesional_id: null,

            entreFechas: false,

            postVariables: ['nombre', 'tipoEvento_id', 'comienzo', 'fin', 'descripcion', 'visible', 'usuario', 'comitentes', 'encomiendaProfesional_id'],
            errors: [],
        };
    }
    
    static propTypes = {
        onSubmit: PropTypes.func,
        id: PropTypes.func,
        action: PropTypes.oneOf(['CREATE', 'EDIT', 'DETAIL', 'DELETE', 'CREATEEP']).isRequired,
    }

    resetForm() {
        this.setState({
            nombre:'',
            tipoEvento_id:'',
            comienzo:moment(),
            fin:moment(),
            descripcion:'',
            visible:1,
            // usuario_id:null,
            usuario:[],
            comitentes:[],
            encomiendaProfesional_id: null,

            entreFechas: false,

            errors: [],
        });
    }

    getData() {
        const { postVariables, entreFechas, visible } = this.state;
        let data = {};

        postVariables.forEach(x => {
            data[x] = this.state[x];
        });

        data['comienzo'] = this.state.comienzo.format('YYYY-MM-DD HH:mm');

        if(!entreFechas){
            data['fin'] = this.state.comienzo.format('YYYY-MM-DD HH:mm');
        }else{
            data['fin'] = this.state.fin.format('YYYY-MM-DD HH:mm');
        }

        if(visible=='2'){
            // data['usuario_id'] = null;
            data['usuario'] = [];
        }

        return data;
    }

    setData(data) {
        if (data.success) {
            this.setState({
                nombre: data.nombre,
                tipoEvento_id: (data.tipoEvento) ? (data.tipoEvento.id) : (null),
                comienzo: moment(data.comienzo),
                fin: moment(data.fin),
                descripcion: data.descripcion,
                visible: data.visible,
                // usuario_id: (data.usuario) ? (data.usuario.id) : (null),
                usuario: (data.usuario) ? (data.usuario) : ([]),
                comitentes: (data.comitentes) ? (data.comitentes) : ([]),
                entreFechas: (data.comienzo!=data.fin),
                encomiendaProfesional_id: (data.encomiendaProfesional) ? (data.encomiendaProfesional.id) : (null),
            });
        }
    }

    setErrors(errors) {
        this.setState({
            errors: errors,
        });
    }

   /*  componentDidUpdate(prevProps, prevState) {
        if (this.inputRef.current && prevState.nombre !== this.state.nombre) {
            this.inputRef.current.focus();
        }
    } */

    onChangeField(field, value) {
        console.log(field)
        console.log(value)
        this.setState(prevState => {
            let errors = prevState.errors;
            if (errors) errors[field] = null;
            prevState.errors = errors;
           
            if (field === "imagen") {
                value = value === "Imagen" ? true : false;
                prevState[field] = value;
            }
            else {
                prevState[field] = value;
            }
            return prevState;
        });
        console.log(this.state)
    }

    getError(field) {
        let errors = this.state.errors;
        if (errors) return errors[field];
        else return null;
    }

    onValidation(){
        const { nombre, tipoEvento_id, comienzo, fin, visible, usuario, entreFechas } = this.state;
        let error = {};
        let validate = true;
        if (nombre==''){
            error.nombre= [{code: "required", detail: "Nombre no puede estar en blanco"}];
            validate = false;
        }
        if(tipoEvento_id==null){
            error.tipoEvento_id= [{code: "required", detail: "Seleccione un tipo de evento"}]
            validate = false;
        }
        if(entreFechas){
            if(comienzo.isAfter(fin)){
                error.fin= [{code: "required", detail: "Fecha fin debe ser posterior a la de comienzo"}]
                validate = false;
            }
        }
        if(visible==1){
            // if(usuario_id==null){
            //     error.usuario_id= [{code: "required", detail: "Seleccione un usuario"}]
            //     validate = false;
            // }
            if(usuario.length==0){
                error.usuario= [{code: "required", detail: "Seleccione un usuario"}]
                validate = false;
            }
        }
        
        this.setState({
            errors: error,
        })
        return validate;
    }

    modalVars() {
        const { action } = this.props;
        if (action == "CREATE") {
            return {
                get: false,
                submitType: "POST",
                title: "Nuevo Evento",
                buttonTitle: "Nuevo",
                danger: false,
                buttonIcon: "fa fa-plus fa-lg",
                successMessage: "El Evento ha sido creado con éxito.",
                saveButton: true,
                saveButtonLabel: "Guardar y salir",
                buttonClass: "btn-calendar-modal",
                saveReloadButton: true,
                saveReloadButtonLabel: 'Guardar',
                disabled: false,
            };
        } else if (action == "CREATEEP") {
            return {
                get: false,
                submitType: "POST",
                title: "Nuevo Evento",
                buttonTitle: "Nuevo",
                danger: false,
                buttonIcon: "fa fa-calendar-plus-o fa-lg",
                successMessage: "El Evento ha sido creado con éxito.",
                saveButton: true,
                saveButtonLabel: "Guardar y salir",
                buttonClass: "btn-calendar-modal",
                saveReloadButton: true,
                saveReloadButtonLabel: 'Guardar',
                disabled: false,
            };
        } else if (action == "EDIT") {
            return {
                get: true,
                submitType: "PUT",
                title: "Editar Evento",
                buttonTitle: "Editar",
                danger: false,
                buttonIcon: "fa fa-pencil fa-lg",
                successMessage: "El Evento ha sido editado con éxito.",
                saveButton: true,
                saveButtonLabel: "Guardar",
                buttonClass: "btn-calendar-modal-contextmenu",
                disabled: false,
                id: this.props.id,
                buttonLabel: "Editar"
            };
        } else if (action == "DETAIL") {
            return {
                get: true,
                submitType: null,
                title: "Evento",
                buttonTitle: "Ver",
                danger: false,
                buttonIcon: "fa fa-search fa-lg",
                successMessage: "",
                saveButton: false,
                buttonClass: "btn-calendar-modal-contextmenu",
                disabled: true,
                id: this.props.id,
                buttonLabel: "Detalle"
            };
        } else if (action == "DELETE") {
            return {
                get: true,
                submitType: "DELETE",
                title: "Eliminar Evento",
                buttonTitle: "Eliminar",
                danger: true,
                buttonIcon: "fa fa-trash fa-lg",
                successMessage: "El Evento ha sido eliminada con éxito.",
                saveButton: true,
                saveButtonLabel: "Eliminar",
                buttonClass: "btn-calendar-modal-contextmenu",
                disabled: true,
                id: this.props.id,
                buttonLabel: "Eliminar"
            };
        }
    }

    onSubmit = (e) => {
        this.props.onSubmit();
        this.resetForm();
        return true;
    }

    onOpen = () => {
        const { usuario_id, encomienda_id } = this.props;
        this.setState({
            usuario_id: usuario_id,
            encomiendaProfesional_id: encomienda_id,
        })
    }


    render() {
        let vars = this.modalVars();
        const { nombre, tipoEvento_id, comienzo, fin, descripcion, visible, usuario, entreFechas, encomiendaProfesional_id, comitentes } = this.state;
        
        return (
            <ParadigmaModal
                getUrl={(vars.get ? api.calendar.eventosCalendar : null)}
                submitUrl={(vars.submitType ? api.calendar.eventosCalendar : null)}
                submitType={vars.submitType}
                id={vars.id}
                onGotData={(data) => this.setData(data)}
                onGotErrors={(errors) => this.setErrors(errors)}
                onSubmit={(e) => this.onSubmit(e)}
                onOpen={() => this.onOpen()}
                onClose={() => this.resetForm()}
                onPreSubmit={() => this.getData()}
                onValidation={() => this.onValidation()}
                title={vars.title}

                danger={vars.danger}
                buttonClass={vars.buttonClass}

                successMessage={vars.successMessage}
                missingIdMessage={"Debe seleccionar una fila."}
                saveButtonLabel={vars.saveButtonLabel}
                buttonTitle={vars.buttonTitle}
                buttonIcon={vars.buttonIcon}
                saveButton={vars.saveButton}
                saveReloadButton={vars.saveReloadButton}
                saveReloadButtonLabel={vars.saveReloadButtonLabel}
                closeButton={true}

                buttonLabel={(vars.buttonLabel) ? (vars.buttonLabel) : ('')}
                escClose={true}
            >

                <Col xs={12} className="col-separator py-1 mr-md-1">Detalle del evento</Col>

                <ParadigmaLabeledInput
                    label="Nombre"
                    md={[3, 9]}
                    value={this.state.nombre}
                    disabled={vars.disabled}
                    onChange={(e) => this.onChangeField('nombre', e.target.value)}
                    error={() => this.getError('nombre')}
                    maxLength={100}
                />

                <ParadigmaLabeledInput
                    label="Tipo de Evento"
                    md={[3, 9]}
                    inputComponent={
                        <ParadigmaAsyncSeeker
                            disabled={vars.disabled}
                            url={api.calendar.tipoEventosSelect}
                            value={this.state.tipoEvento_id}
                            parameters={{
                                paginationEnabled:false,
                                sort:['nombre']
                            }}
                            onChange={e => this.onChangeField('tipoEvento_id', (e) ? (e.id) : (null))}
                        />
                    }
                    error={() => this.getError('tipoEvento_id')}
                />

                
                <ParadigmaLabeledInput 
                    disabled={vars.disabled}
                    md={[3, 9]}
                    //maxLength={50}
                    label={"Comienzo"} 
                    inputComponent={
                        <Row>
                            <Col className={"col-12 col-sm-5 pl-0 ml-3"}>
                                <ParadigmaDatePicker
                                    disabled={vars.disabled}
                                    value={this.state.comienzo}
                                    onChange={(e) => this.setState({ 'comienzo': e })}
                                    datetime={true}
                                    className={"dp_datetime"}
                                />
                            </Col>
                            <Col className={"col-12 col-sm-6 pl-0"}>
                                <label className={"col-12"}>
                                    <input type="checkbox" disabled={vars.disabled} className="filled-in" checked={this.state.entreFechas} onChange={(e) => {}}/>
                                    <span onClick={() => {(!vars.disabled) ? this.setState({entreFechas: !entreFechas}): null}}>Entre Fechas</span>
                                </label>
                            </Col>
                        </Row>} 
                    error={() => this.getError('comienzo')}
                />

            
                {(entreFechas) && (<ParadigmaLabeledInput 
                    disabled={vars.disabled}
                    md={[3, 9]}
                    //maxLength={50}
                    label={"Fin"} 
                    inputComponent={
                        <ParadigmaDatePicker
                            disabled={vars.disabled}
                            value={this.state.fin}
                            onChange={(e) => this.setState({ 'fin': e })}
                            datetime={true}
                            className={"dp_datetime"}
                        />} 
                    error={() => this.getError('fin')}
                />)}

                <ParadigmaLabeledInput
                    label="Descripción"
                    md={[3, 9]}
                    inputComponent={
                        <textarea
                            className="form-control"
                            disabled={vars.disabled}
                            value={this.state.descripcion}
                            onChange={(e) => this.onChangeField('descripcion', e.target.value)}
                            style={{ height: 50 }}
                        ></textarea>
                    }
                    error={() => this.getError('descripcion')}
                />

                <ParadigmaLabeledInput
                    label="Encomienda"
                    md={[3, 9]}
                    inputComponent={
                        <ParadigmaAsyncSeeker
                            disabled={vars.disabled}
                            url={api.expedientes.encomiendaprofesionalSelect}
                            displayField={"nroOrden"}
                            value={this.state.encomiendaProfesional_id}
                            parameters={{
                                paginationEnabled:false,
                                sort:['fechaIngreso']
                            }}
                            onChange={e => this.onChangeField('encomiendaProfesional_id', (e) ? (e.id) : (null))}
                            CreateComponent={props => <ModalEncomienda id={() => {return (encomiendaProfesional_id) ? (encomiendaProfesional_id) : (false)}} 
                                                                        action={"DETAIL"} 
                                                                        ar_estados={this.props.ar_estados}/>}
                        />
                    }
                    error={() => this.getError('encomiendaProfesional_id')}
                />

                <Col xs={12} className="col-separator my-2 py-1 mr-md-1">Visibilidad</Col>

                <div className={"mt-sm-1 row"}>
                    <div className={"col-12 col-md-12 mt-sm-1 row"}>
                        <div className={"col-12 col-md-4"}>
                            <label onClick={(vars.disabled) ? (null) : (() => {this.onChangeField('visible', 1)})}>
                                <input type="radio" disabled={vars.disabled} name="group1" className={"with-gap filled-in"} value="1" onChange={() => {}} checked={this.state.visible === 1} />
                                <span>Usuario</span> 
                            </label>
                        </div>
                        <div className={"col-12 col-md-4"}>
                            <label onClick={(vars.disabled) ? (null) : (() => {this.onChangeField('visible', 2)})}>
                                <input type="radio" disabled={vars.disabled} name="group1" className={"with-gap filled-in"} value="2" onChange={() => {}} checked={this.state.visible === 2} />
                                <span>Todos</span>
                            </label>
                        </div>
                        {/*<div className={"col-12 col-md-4"}>
                            <label onClick={(vars.disabled) ? (null) : (() => {this.onChangeField('visible', 3)})}>
                                <input type="radio" disabled={vars.disabled} name="group1" className={"with-gap filled-in"} value="3" onChange={() => {}} checked={visible === 3} />
                                <span>Empresa</span>
                            </label>
                        </div>*/}
                    </div>
                </div>

                {(visible==1) && 
                <Fragment>  
                    <ParadigmaLabeledInput
                        label="Usuario"
                        md={[3, 9]}
                        error={() => this.getError('usuario')}
                        inputComponent={
                            <ParadigmaAsyncSeeker
                                disabled={vars.disabled}
                                multiselect={true}
                                //url={`${api.usuarios.usuarios}?is_staff=1`}
                                // url={`${api.tickets.usuariosSelect}?is_staff=1`}
                                url={api.usuarios.usuarios}
                                value={this.state.usuario}
                                // onChange={data => this.onChangeField('usuario', data ? data.id : null)}
                                onChange={data => this.onChangeField('usuario', data ? data.map(e => e.id) : [])}
                                //displayField={"apellido_nombre"}
                                parameters={{
                                    paginationEnabled:false,
                                    sort:['last_name'],
                                    filters:['is_staff=1']
                                }}
                                valueRenderer={data => `${data.last_name} ${data.first_name}`}
                                optionRenderer={data => `${data.last_name} ${data.first_name}`}
                            />
                        }
                    />
                    <ParadigmaLabeledInput
                        label="Comitentes"
                        md={[3, 9]}
                        error={() => this.getError('comitentes')}
                        inputComponent={
                            <ParadigmaAsyncSeeker
                                disabled={vars.disabled}
                                multiselect={true}
                                url={api.comitentes.comitentes}
                                value={this.state.comitentes}
                                onChange={data => this.onChangeField('comitentes', data ? data.map(e => e.id) : [])}
                                displayField={"apellido_nombre"}
                                parameters={{
                                    paginationEnabled:false,
                                    sort:['apellido_nombre'],
                                    // filters:['is_staff=1']
                                }}
                            />
                        }
                    />
                </Fragment>}

            </ParadigmaModal>
        );
    }
}

export default Modal;

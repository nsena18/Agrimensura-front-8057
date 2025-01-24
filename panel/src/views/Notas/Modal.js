import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import api from "../../api";
import { formatCurrency } from '../../functions/functions';

import { Row, Col, Label, Input, InputGroup, FormFeedback, FormGroup } from 'reactstrap';
import moment from 'moment';

import ParadigmaModal from "../../components/ParadigmaModal/ParadigmaModal.js"
import ParadigmaAsyncSeeker from "../../components/ParadigmaAsyncSeeker/ParadigmaAsyncSeeker.js"
import ParadigmaLabeledInput from "../../components/ParadigmaLabeledInput/ParadigmaLabeledInput.js"
import ParadigmaDatePicker from "../../components/ParadigmaDatePicker/ParadigmaDatePicker.js"

import ModalEncomienda from '../Expedientes/EncomiendaProfesional/Modal'

class Modal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            descripcion: '',
            fecha: moment(),
            autor_id: null,
            destinatario_id: null,
            encomiendaProfesional_id: null,
            filtroDest: 1,
            enviarMail: false,
            postVariables: ['descripcion', 'fecha', 'destinatario_id', 'encomiendaProfesional_id'],
            errors: [],
        };
        this.descripcionRef = React.createRef();
    }

    static propTypes = {
        onSubmit: PropTypes.func,
        id: PropTypes.func,
        action: PropTypes.oneOf(['CREATE', 'EDIT', 'DETAIL', 'DELETE']).isRequired,
    }

    resetForm() {
        this.setState({
            id: null,
            descripcion: '',
            fecha: moment(),
            autor_id: null,
            destinatario_id: null,
            encomiendaProfesional_id: null,

            filtroDest: 1,
            enviarMail: false,
            errors: [],
        });
        this.descripcionRef.current.value = '';
    }

    getData() {
        const { action } = this.props;
        const { precioUnitario, postVariables, enviarMail } = this.state;
        let data = {};
        postVariables.forEach(x => {
            if( x == 'descripcion'){
                data[x] = this.descripcionRef.current.value;
            } else {
                data[x] = this.state[x];
            }            
        });
        if ((action==='CREATE') && (enviarMail==true)){
            data['enviarMail'] = true;
        }
        console.log(data)
        return data;
    }

    setData(data) {
        if (data.success) {
            this.setState({
                id: data.id,
                descripcion: data.descripcion,
                fecha: moment(data.fecha),
                autor_id: data.autor ? data.autor.id : null,
                destinatario_id: data.destinatario ? data.destinatario.id : null,
                encomiendaProfesional_id: data.encomiendaProfesional ? data.encomiendaProfesional.id : null,
                filtroDest: (data.destinatario && data.destinatario.is_staff==false) ? (2) : (1)
            });
        }
    }

    setErrors(errors) {
        this.setState({
            errors: errors,
        });
    }

    onChangeField(field, value) {       
        this.setState(prevState => ({
            ...prevState,
            [field]: value, // Actualiza solo el campo que cambia
            errors: { ...prevState.errors, [field]: null }, // Limpia el error del campo
        }));
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
                title: "Nueva Nota",
                buttonTitle: "Nuevo",
                danger: false,
                buttonIcon: "fa fa-plus fa-lg",
                successMessage: "La Nota ha sido creada con éxito.",
                saveButton: true,
                saveButtonLabel: "Guardar",
                buttonClass: "",
                disabled: false,
            };
        } else if (action == "EDIT") {
            return {
                get: true,
                submitType: "PUT",
                title: "Editar Nota",
                buttonTitle: "Editar",
                danger: false,
                buttonIcon: "fa fa-pencil fa-lg",
                successMessage: "La Nota ha sido editada con éxito.",
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
                title: "Nota",
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
                title: "Eliminar Nota",
                buttonTitle: "Eliminar",
                danger: true,
                buttonIcon: "fa fa-trash fa-lg",
                successMessage: "La Nota ha sido eliminada con éxito.",
                saveButton: true,
                saveButtonLabel: "Eliminar",
                buttonClass: "",
                disabled: true,
                id: this.props.id,
            };
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        // Actualiza solo si cambian campos relevantes
        return nextState.descripcion !== this.state.descripcion || nextState.errors !== this.state.errors;
    }
    
    onOpen = () => {
        const { action } = this.props;
        let iduser = parseInt(localStorage.iduser);
        if(action==='CREATE' && iduser!=undefined && iduser!=null){
            this.setState({
                autor_id: iduser,
            })
        }
    }

    render() {
        let vars = this.modalVars();
        const { action, asUsuarios, ar_estados } = this.props;
        const { descripcion, fecha, autor_id, destinatario_id, encomiendaProfesional_id, filtroDest, enviarMail } = this.state;
        
        return (
            <ParadigmaModal
                getUrl={(vars.get ? api.notas.notas : null)}
                submitUrl={(vars.submitType ? api.notas.notas : null)}
                submitType={vars.submitType}
                id={vars.id}

                onGotData={(data) => this.setData(data)}
                onGotErrors={(errors) => this.setErrors(errors)}
                onSubmit={(e) => this.props.onSubmit(e)}
                onClose={() => this.resetForm()}
                onPreSubmit={() => this.getData()}
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

                escClose={true}
            >


                <ParadigmaLabeledInput 
                    disabled={vars.disabled}
                    md={[3, 7]}
                    maxLength={50}
                    label={"Fecha"} 
                    inputComponent={
                        <ParadigmaDatePicker
                            disabled={vars.disabled}
                            value={fecha}
                            onChange={(e) => this.setState({ 'fecha': e })}
                            datetime={false}
                            className={"inp_fecha"}
                        />} 
                    error={() => this.getError('fecha')}
                />

                <ParadigmaLabeledInput
                    label="Autor"
                    md={[3, 9]}
                    inputComponent={
                        <ParadigmaAsyncSeeker
                            disabled={true}
                            // url={api.usuarios.usuarios}
                            url={(asUsuarios && asUsuarios.length>0) ? (undefined) : (api.usuarios.usuarios)}
                            optionDefault={(asUsuarios && asUsuarios.length>0) ? (asUsuarios) : (undefined)}
                            displayField={"apellido_nombre"}
                            value={autor_id}
                            parameters={{
                                paginationEnabled:false,
                                sort:['apellido_nombre'],
                                filters:['is_staff=1']
                            }}
                            onChange={e => this.onChangeField('autor_id', (e) ? (e.id) : (null))}
                        />
                    }
                    error={() => this.getError('autor_id')}
                />

                <Row className={'mt-1'}>
                    <Col className={"col-0 col-md-3"}>
                    </Col>
                    <Col className={"col-12 col-md-4"}>
                        <label onClick={(vars.disabled) ? (null) : (() => {this.onChangeField('filtroDest', 1); this.onChangeField('destinatario_id', null)})}>
                            <input type="radio" disabled={vars.disabled} name="group1" className={"with-gap filled-in mr-2"} value="1" onChange={() => {}} checked={filtroDest === 1} />
                            <span>Usuarios</span> 
                        </label>
                    </Col>
                    <Col className={"col-12 col-md-4"}>
                        <label onClick={(vars.disabled) ? (null) : (() => {this.onChangeField('filtroDest', 2); this.onChangeField('destinatario_id', null)})}>
                            <input type="radio" disabled={vars.disabled} name="group1" className={"with-gap filled-in mr-2"} value="2" onChange={() => {}} checked={filtroDest === 2} />
                            <span>Comitentes</span>
                        </label>
                    </Col>
                </Row>

                <ParadigmaLabeledInput
                    label="Destinatario"
                    md={[3, 9]}
                    inputComponent={
                        <ParadigmaAsyncSeeker
                            disabled={vars.disabled}
                            url={(asUsuarios && asUsuarios.length>0) ? (undefined) : (api.usuarios.usuarios)}
                            optionDefault={(asUsuarios && asUsuarios.length>0) ? (asUsuarios.filter(e => e.is_staff == (filtroDest===2 ? false : true))) : (undefined)}
                            displayField={"apellido_nombre"}
                            value={destinatario_id}
                            parameters={{
                                paginationEnabled:false,
                                sort:['apellido_nombre'],
                                // filters:['is_staff='+(filtroDest===2 ? '0' : '1')]
                            }}
                            onChange={e => this.onChangeField('destinatario_id', (e) ? (e.id) : (null))}
                        />
                    }
                    error={() => this.getError('destinatario_id')}
                />

                <ParadigmaLabeledInput
                    label="Encomienda"
                    md={[3, 9]}
                    inputComponent={
                        <ParadigmaAsyncSeeker
                            disabled={vars.disabled}
                            url={api.expedientes.encomiendaprofesionalSelect}
                            displayField={"nroOrden"}
                            value={encomiendaProfesional_id}
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

                <FormGroup className="ta_m_movil md-3" >
                    <Label for="descripcion">Descripción</Label>
                    <Input
                        id="descripcion"
                        type="textarea"
                        defaultValue={descripcion}
                        className="ta_m_movil"
                        innerRef={(element) => {
                            this.descripcionRef.current = element;
                        }}
                        
                    />
                    {this.getError('descripcion') && (
                        <FormFeedback className= "d-block">Descripción no debe ser vacia</FormFeedback>
                    )}
                </FormGroup>

                 
                {(action==='CREATE' && filtroDest===2) &&
                <Row className={"mt-sm-1 row"}>
                    <Col className={"col-0 col-md-3"}>
                    </Col>
                    <Col className={'Col-9'} onClick={()=>this.onChangeField('enviarMail', !enviarMail)}>
                        <input type="checkbox" className="filled-in" checked={enviarMail} onChange={(e) => {}}/>
                        <label className="ml-2" htmlFor="enviarMail">Enviar Mail</label>
                    </Col>
                </Row>}
            
            </ParadigmaModal>
        );
    }
}

export default Modal;

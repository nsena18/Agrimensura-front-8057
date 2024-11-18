import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ParadigmaModal from "../../../components/ParadigmaModal/ParadigmaModal.js"
import api from "../../../api";

import { Row, Col, ButtonGroup, Button, Input, UncontrolledTooltip } from 'reactstrap';

import ParadigmaLabeledInput from "../../../components/ParadigmaLabeledInput/ParadigmaLabeledInput.js"
import ParadigmaColorPicker from "../../../components/ParadigmaColorPicker/ParadigmaColorPicker.js"
import ParadigmaAsyncSeeker from "../../../components/ParadigmaAsyncSeeker/ParadigmaAsyncSeeker.js"


class Modal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            numero: 0,
            nombre: "",
            background: "",
            texto:"",
            diasEstimados: 1,

            permisosNivel1: false,
            permisosNivel2: false,
            archivoObligatorio: false,
            labelArchivo: '',
            proximosEstado: [],
            sePuedeAvanzar: true,
            mensajeError: '',
            tituloModal: '',
            primerEstado: false,
            editarEncomienda: false,
            anvazaCliente: false,
            iconoEstado: '',

            plantilla_id: null,
            activeMail: false,

            postVariables: ['numero', 'nombre', 'background', 'texto', 'diasEstimados',
                            'permisosNivel1', 'permisosNivel2', 'archivoObligatorio', 'labelArchivo', 
                            'proximosEstado', 'sePuedeAvanzar', 'mensajeError', 'tituloModal',
                            'primerEstado', 'editarEncomienda', 'anvazaCliente', 'iconoEstado',
                            'plantilla_id', 'activeMail'],
            errors: [],
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
            numero: 0,
            nombre: "",
            background: "",
            texto:"",
            diasEstimados: 1,
            
            permisosNivel1: false,
            permisosNivel2: false,
            archivoObligatorio: false,
            labelArchivo: '',
            proximosEstado: [],
            sePuedeAvanzar: true,
            mensajeError: '',
            tituloModal: '',
            primerEstado: false,
            editarEncomienda: false,
            anvazaCliente: false,
            iconoEstado: '',

            plantilla_id: null,
            activeMail: false,

            errors: [],
        });
    }

    getData() {
        const { postVariables, maxSize } = this.state;
        let data = {};

        // data.habilitado = true;
        postVariables.forEach(x => {
            data[x] = this.state[x];
        });

        if (maxSize !== null) {
            data.maxSize = maxSize
        };

        if (!this.state.habilitado) {
            data.motivo = this.state.motivo
        }


        return data;
    }

    setData(data) {
        if (data.success) {
            this.setState({
                id: data.id,
                numero: data.numero,
                nombre: data.nombre,
                background: data.background,
                texto: data.texto,
                diasEstimados: data.diasEstimados,

                permisosNivel1: data.permisosNivel1,
                permisosNivel2: data.permisosNivel2,
                archivoObligatorio: data.archivoObligatorio,
                labelArchivo: data.labelArchivo,
                proximosEstado: data.proximosEstado.map((e) => {return e.id}),
                sePuedeAvanzar: data.sePuedeAvanzar,
                mensajeError: data.mensajeError,
                tituloModal: data.tituloModal,
                primerEstado: data.primerEstado,
                editarEncomienda: data.editarEncomienda,
                anvazaCliente: data.anvazaCliente,
                iconoEstado: data.iconoEstado,

                plantilla_id: data.plantilla ? data.plantilla.id : null,
                activeMail: data.activeMail,
            })
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
            if (field === "imagen") {
                value = value === "Imagen" ? true : false;
                prevState[field] = value;
            }
            else if(field==='texto' || field==='background'){
                let st=value;
                let array= st.split("#");
                prevState[field] = array[1];
            }
            else
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
        if (action == "CREATE") {
            return {
                get: false,
                submitType: "POST",
                title: "Nuevo Estado",
                buttonTitle: "Nuevo",
                danger: false,
                buttonIcon: "fa fa-plus fa-lg",
                successMessage: "El Estado ha sido creado con éxito.",
                saveButton: true,
                saveButtonLabel: "Guardar",
                buttonClass: "",
                disabled: false,
            };
        } else if (action == "EDIT") {
            return {
                get: true,
                submitType: "PUT",
                title: "Editar Estado",
                buttonTitle: "Editar",
                danger: false,
                buttonIcon: "fa fa-pencil fa-lg",
                successMessage: "El estado se eduti con éxito.",
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
                title: "Estado",
                buttonTitle: "Ver",
                danger: false,
                buttonIcon: "fa fa-search fa-lg",
                successMessage: "",
                saveButton: false,
                buttonClass: "",
                disabled: true,
                id: this.props.id,
            };
        } else if (action == "DELETE") {
            return {
                get: true,
                submitType: "DELETE",
                title: "Eliminar Estado",
                buttonTitle: "Eliminar",
                danger: true,
                buttonIcon: "fa fa-trash fa-lg",
                successMessage: "El Estado ha sido eliminado con éxito.",
                saveButton: true,
                saveButtonLabel: "Eliminar",
                buttonClass: "btn-danger",
                disabled: true,
                id: this.props.id,
            };
        }
    }

    render() {
        const { numero, nombre, background, texto, diasEstimados, permisosNivel1, permisosNivel2, archivoObligatorio, labelArchivo, proximosEstado, 
                sePuedeAvanzar, mensajeError, tituloModal, primerEstado, editarEncomienda, anvazaCliente, iconoEstado, plantilla_id, activeMail } = this.state;
        let vars = this.modalVars();
        
        return (
            <ParadigmaModal
                getUrl={(vars.get ? api.expedientes.estadosencomienda : null)}
                submitUrl={(vars.submitType ? api.expedientes.estadosencomienda : null)}
                submitType={vars.submitType}
                id={vars.id}
                onGotData={(data) => this.setData(data)}
                onGotErrors={(errors) => this.setErrors(errors)}
                onSubmit={(e) => this.props.onSubmit(e)}
                onClose={() => this.resetForm()}
                onPreSubmit={() => this.getData()}

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
                // className={'modal-lg'}
            >
                <Row>
                    <Col className={'col-12'}>
                        <ParadigmaLabeledInput
                            disabled={vars.disabled}
                            md={[3, 9]}
                            maxLength={50}
                            label="Nombre"
                            value={nombre}
                            onChange={(e) => this.onChangeField('nombre', e.target.value)}
                            error={() => this.getError('nombre')}
                        />
                    </Col>
                    <Col className={'col-6 mt-2'}>
                        <ParadigmaLabeledInput
                            disabled={true}
                            md={[6, 6]}
                            type={"integer"}
                            maxLength={50}
                            label="Numero"
                            value={numero}
                            onChange={(e) => this.onChangeField('numero', e.target.value)}
                            error={() => this.getError('numero')}
                        />
                    </Col>
                    <Col className={'col-6 mt-2'}>
                        <ParadigmaLabeledInput
                            disabled={vars.disabled}
                            md={[6, 6]}
                            type={"integer"}
                            maxLength={4}
                            label="Días Estimados"
                            value={diasEstimados}
                            onChange={(e) => this.onChangeField('diasEstimados', e.target.value)}
                            error={() => this.getError('diasEstimados')}
                        />
                    </Col>
                    <Col className={'col-6 mt-2'}>
                        <ParadigmaLabeledInput
                             md={[6, 6]}
                            label={"Fondo"}
                            onChange={(e) => this.onChangeField('background', e.target.value)}
                            error={() => this.getError('background')}
                            inputComponent= {
                                <ParadigmaColorPicker
                                    disabled= {vars.disabled}
                                    onChange={(color) => this.onChangeField('background',color)}
                                    value={background}
                                />
                            }
                        />
                    </Col>
                    <Col className={'col-6 mt-2'}>
                        <ParadigmaLabeledInput
                            md={[6, 6]}
                            label={"Texto"}
                            onChange={(e) => this.onChangeField('texto', e.target.value)}
                            error={() => this.getError('texto')}
                            inputComponent= {
                                <ParadigmaColorPicker
                                    disabled= {vars.disabled}
                                    onChange={(color) => this.onChangeField('texto',color)}
                                    value={texto}
                                />
                            }
                        /> 
                    </Col>
                    

                    <Col className={'col-6 mt-2'} onClick={() => {this.onChangeField('permisosNivel1', !permisosNivel1)}}>
                            <input type="checkbox" style={{marginTop: '5px', cursor: 'pointer'}} className="filled-in" checked={permisosNivel1} onChange={(e) => {}}/>
                            <span style={{marginLeft: '10px', cursor: 'pointer'}}>
                                {' Permisos Nivel 1'}
                            </span>
                    </Col>
                    
                    <Col className={'col-6 mt-2'} onClick={() => {this.onChangeField('permisosNivel2', !permisosNivel2)}}>
                            <input type="checkbox" style={{marginTop: '5px', cursor: 'pointer'}} className="filled-in" checked={permisosNivel2} onChange={(e) => {}}/>
                            <span style={{marginLeft: '10px', cursor: 'pointer'}}>
                                {' Permisos Nivel 2'}
                            </span>
                    </Col>

                    <Col className={'col-12 mt-2'} onClick={() => {this.onChangeField('archivoObligatorio', !archivoObligatorio)}}>
                            <input type="checkbox" style={{marginTop: '5px', cursor: 'pointer'}} className="filled-in" checked={archivoObligatorio} onChange={(e) => {}}/>
                            <span style={{marginLeft: '10px', cursor: 'pointer'}}>
                                {' Archivo Obligatorio'}
                            </span>
                    </Col>
                        
                    <Col className={'col-12 mt-2'}>
                        <ParadigmaLabeledInput
                            md={[3, 9]}
                            disabled={vars.disabled}
                            label={"Label Archivo"}
                            error={() => this.getError('labelArchivo')}
                            value={labelArchivo}
                            onChange={(e) => this.onChangeField('labelArchivo', e.target.value)}
                        /> 
                    </Col>
                    
                    <Col className={'col-12 mt-2'}>
                        <ParadigmaLabeledInput
                            label="Proximos estados"
                            md={[3, 9]}
                            classNames={['pr-0','']}
                            error={() => this.getError('proximosEstado')}
                            inputComponent={
                                <ParadigmaAsyncSeeker
                                    disabled={vars.disabled}
                                    multiselect={true}
                                    url={api.expedientes.estadosencomiendaSelect}
                                    // valueField={'numero'}
                                    value={proximosEstado}
                                    onChange={data => this.onChangeField('proximosEstado', data ? data.map(e => e.id) : [])}
                                    parameters={{
                                        paginationEnabled:false,
                                        sort:['numero'],
                                        // filters:['is_staff=1']
                                    }}
                                    valueRenderer={data => `${data.numero} ${data.nombre}`}
                                    optionRenderer={data => `${data.numero} ${data.nombre}`}
                                />
                            }
                        /> 
                    </Col>
                    
                    <Col className={'col-6 mt-2'} onClick={() => {this.onChangeField('sePuedeAvanzar', !sePuedeAvanzar); 
                                                                    if (!sePuedeAvanzar==false) this.onChangeField('mensajeError', '')
                                                                    else this.onChangeField('tituloModal', '')}}>
                            <input type="checkbox" style={{marginTop: '5px', cursor: 'pointer'}} className="filled-in" checked={sePuedeAvanzar} onChange={(e) => {}}/>
                            <span style={{marginLeft: '10px', cursor: 'pointer'}}>
                                {' Se Puede Avanzar'}
                            </span>
                    </Col>
                    
                    {sePuedeAvanzar==false ? 
                    <Col className={'col-6 mt-2'}>
                    </Col>
                    :
                    <Col className={'col-6 mt-2'} onClick={() => {this.onChangeField('anvazaCliente', !anvazaCliente)}}>
                        <input type="checkbox" style={{marginTop: '5px', cursor: 'pointer'}} className="filled-in" checked={anvazaCliente} onChange={(e) => {}}/>
                        <span style={{marginLeft: '10px', cursor: 'pointer'}}>
                            {' Puede Avanzar Cliente'}
                        </span>
                    </Col>}
                    
                    
                    {sePuedeAvanzar==false ?
                    <Col className={'col-12 mt-2'}>
                        <ParadigmaLabeledInput
                            md={[3, 9]}
                            disabled={vars.disabled}
                            label={"Mensaje error"}
                            error={() => this.getError('mensajeError')}
                            value={mensajeError}
                            onChange={(e) => this.onChangeField('mensajeError', e.target.value)}
                        /> 
                    </Col>
                    :
                    <Col className={'col-12 mt-2'}>
                        <ParadigmaLabeledInput
                            md={[3, 9]}
                            disabled={vars.disabled}
                            label={"Título Modal"}
                            error={() => this.getError('tituloModal')}
                            value={tituloModal}
                            onChange={(e) => this.onChangeField('tituloModal', e.target.value)}
                        /> 
                    </Col>}

                    <Col className={'col-12 mt-2'}>
                        <ParadigmaLabeledInput
                            md={[3, 9]}
                            disabled={vars.disabled}
                            label={"Icono Botones"}
                            error={() => this.getError('iconoEstado')}
                            value={iconoEstado}
                            onChange={(e) => this.onChangeField('iconoEstado', e.target.value)}
                        />
                    </Col>
                    
                    <Col className={'col-6 mt-2'} onClick={() => {this.onChangeField('primerEstado', !primerEstado)}}>
                            <input type="checkbox" style={{marginTop: '5px', cursor: 'pointer'}} className="filled-in" checked={primerEstado} onChange={(e) => {}}/>
                            <span style={{marginLeft: '10px', cursor: 'pointer'}}>
                                {' Primer Estado'}
                            </span>
                    </Col>
                    
                    <Col className={'col-6 mt-2'} onClick={() => {this.onChangeField('editarEncomienda', !editarEncomienda);}}>
                            <input type="checkbox" style={{marginTop: '5px', cursor: 'pointer'}} className="filled-in" checked={editarEncomienda} onChange={(e) => {}}/>
                            <span style={{marginLeft: '10px', cursor: 'pointer'}}>
                                {' Editar Encomienda'}
                            </span>
                    </Col>
                    
                    {/* Mail */}
                    <Col className={'col-12'}>
                        <Row className="mt-3">
                            <Col className="col-12 col-separator">Envio de Mail</Col>

                            <Col className={'col-6 mt-2'} onClick={() => {this.onChangeField('activeMail', !activeMail);}}>
                                    <input type="checkbox" className="filled-in" checked={activeMail} onChange={(e) => {}}/>
                                    <span style={{marginLeft: '10px', cursor: 'pointer'}}>Activado</span>
                            </Col>

                            <Col className={'col-12'}>
                                <ParadigmaLabeledInput
                                    label={"Plantilla"}
                                    md={[3, 9]}
                                    inputComponent={<ParadigmaAsyncSeeker
                                        displayField="descripcion"
                                        clearable={true}
                                        url={api.mails.plantillas}
                                        value={plantilla_id}
                                        onChange={(data) => this.setState({ plantilla_id: (data ? data.id : null) })}
                                    />}
                                    error={() => this.getError('plantilla_id')}
                                />
                            </Col>
                        </Row>
                    </Col>

                </Row>
            </ParadigmaModal>
        );
    }
}

export default Modal;

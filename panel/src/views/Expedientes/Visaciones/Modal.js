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
            archivoobligatorio: false,
            labelarchivo: '',
            titulomodal: '',
            plantilla_id: null,
            activemail: false,
            postVariables: ['numero', 'nombre', 'background', 'texto', 'diasestimados',
                            'archivoobligatorio', 'labelarchivo',  'listaestadosid',
                            'titulomodal',  'avanzacliente', 'plantilla_id', 'activemail', 'comitentesentidades_id'
                           ],
            errors: [],
            comitentesentidades_id: 0,
            organismo : null,
            listaestadosid: [],
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
            diasestimados: 1,
            archivoobligatorio: false,
            labelarchivo: '',
            avanzacliente: false,
            titulomodal: '',
            plantilla_id: null,
            activemail: false,
            errors: [],
            comitentesentidades_id: 0,
            organismo: null,
            listaestadosid: [],

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
        const { listEntidades, listaControlEstados } = this.props;
        if (data.success) {
            console.log(data)
            this.setState({
                id: data.id,
                numero: data.numero,
                nombre: data.nombre,
                background: data.background,
                texto: data.texto,
                diasestimados: data.diasestimados,

                archivoobligatorio: data.archivoobligatorio,
                labelarchivo: data.labelarchivo,

                titulomodal: data.titulomodal,
                avanzacliente: data.avanzacliente,

                plantilla_id: data.plantilla ? data.plantilla.id : null,
                activemail: data.activemail,
                comitentesentidades_id: data.comitentesentidades == null ? 0 : data.comitentesentidades.id,
                listaestadosid: data.listaestadosid ?  data.listaestadosid : []
            })
            if(data.comitentesentidades != null) {
                let obj = listEntidades.find( x => x.id == data.comitentesentidades.id);
                this.setState({
                    organismo: obj
                })
            }
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

    onChangeSelect(data) {
        console.log(data)
        this.setState({ comitentesentidades_id: (data ? data.id : null), organismo: data })
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
                title: "Nueva Plantilla de Visaciones",
                buttonTitle: "Nuevo",
                danger: false,
                buttonIcon: "fa fa-plus fa-lg",
                successMessage: "La Plantilla de Visaciones ha sido creado con éxito.",
                saveButton: true,
                saveButtonLabel: "Guardar",
                buttonClass: "",
                disabled: false,
            };
        } else if (action == "EDIT") {
            return {
                get: true,
                submitType: "PUT",
                title: "Editar Plantilla de Visaciones",
                buttonTitle: "Editar",
                danger: false,
                buttonIcon: "fa fa-pencil fa-lg",
                successMessage: "La Plantilla de Visaciones se eduti con éxito.",
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
                title: "Eliminar Plantilla de Visaciones",
                buttonTitle: "Eliminar",
                danger: true,
                buttonIcon: "fa fa-trash fa-lg",
                successMessage: "la Plantilla de Visaciones ha sido eliminado con éxito.",
                saveButton: true,
                saveButtonLabel: "Eliminar",
                buttonClass: "btn-danger",
                disabled: true,
                id: this.props.id,
            };
        }
    }

    render() {
        const { listEntidades, listaControlEstados } = this.props;
        const {
            numero,
            nombre,
            background,
            texto,
            diasestimados,
            archivoobligatorio,
            labelarchivo,
            avanzacliente,
            titulomodal,
            plantilla_id,
            activemail,
            comitentesentidades_id,
            organismo,
            listaestadosid
         } = this.state;
        let vars = this.modalVars();

        return (
            <ParadigmaModal
                getUrl={(vars.get ? api.visaciones.estados : null)}
                submitUrl={(vars.submitType ? api.visaciones.estados : null)}
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
                            disabled={false}
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
                            value={diasestimados}
                            onChange={(e) => this.onChangeField('diasestimados', e.target.value)}
                            error={() => this.getError('diasestimados')}
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

                    <Col className={'col-12 mt-2'}>
                        <ParadigmaLabeledInput
                            label="Estados visaciones"
                            md={[4, 8]}
                            classNames={['pr-0','']}
                            error={() => this.getError('listaestadosid')}
                            inputComponent={
                                <ParadigmaAsyncSeeker
                                    disabled={vars.disabled}
                                    multiselect={true}
                                    clearable={false}
                                    url={api.visaciones.controlEstadosSelect}
                                    value={listaestadosid}
                                    optionDefault={listaControlEstados.map(e => {return { id: e.id, nombre: e.nombre, numero: e.numero }})}
                                    parameters={{
                                        paginationEnabled:false,
                                    }}
                                    valueRenderer={data => `${data.numero} => ${data.nombre}`}
                                    optionRenderer={data => `${data.numero} => ${data.nombre}`}
                                    onChange={data => this.onChangeField('listaestadosid', data ? data.map(e => e.id) : [])}
                                />
                            }
                        />
                    </Col>

                    <Col className={'col-12 mt-2'} onClick={() => {this.onChangeField('archivoobligatorio', !archivoobligatorio)}}>
                            <input type="checkbox" style={{marginTop: '5px', cursor: 'pointer'}} className="filled-in" checked={archivoobligatorio} onChange={(e) => {}}/>
                            <span style={{marginLeft: '10px', cursor: 'pointer'}}>
                                {' Archivo Obligatorio'}
                            </span>
                    </Col>

                    <Col className={'col-12 mt-2'}>
                                            <ParadigmaLabeledInput
                                                md={[3, 9]}
                                                disabled={vars.disabled}
                                                label={"Título Modal"}
                                                error={() => this.getError('tituloModal')}
                                                value={titulomodal}
                                                onChange={(e) => this.onChangeField('titulomodal', e.target.value)}
                                            />
                                        </Col>

                    <Col className={'col-12 mt-2'}>
                        <ParadigmaLabeledInput
                            md={[3, 9]}
                            disabled={vars.disabled}
                            label={"Label Archivo"}
                            error={() => this.getError('labelarchivo')}
                            value={labelarchivo}
                            onChange={(e) => this.onChangeField('labelarchivo', e.target.value)}
                        />
                    </Col>

                    {/* Mail */}
                    <Col className={'col-12'}>
                        <Row className="mt-3">
                            <Col className="col-12 col-separator">Envio de Mail</Col>

                            <Col className={'col-6 mt-2'} onClick={() => {this.onChangeField('activemail', !activemail);}}>
                                    <input type="checkbox" className="filled-in" checked={activemail} onChange={(e) => {}}/>
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

                    <Col className={'col-12'}>
                        <Row className="mt-3">
                            <Col className="col-12 col-separator">Organismos Entidades</Col>
                            <Col className={'col-12'}>
                                <ParadigmaLabeledInput
                                    label={"Entidad"}
                                    md={[3, 9]}
                                    inputComponent={<ParadigmaAsyncSeeker
                                        displayField="nombre"
                                        clearable={false}
                                        url={undefined}
                                        value={comitentesentidades_id}
                                        optionDefault={listEntidades.map(e => {return {nombre: e.nombre, id: e.id, email: e.email }})}
                                        onChange={(data) => this.onChangeSelect(data)}
                                    />}
                                    error={() => this.getError('comitentesentidades_id')}
                                />
                            </Col>
                            <Col className={'col-12 mt-2'}>
                                <ParadigmaLabeledInput
                                    md={[3, 9]}
                                    disabled={true}
                                    label={"Email de la entidad"}
                                    error={null}
                                    value={organismo == null ? '' : (organismo.email || 'Sin email')}

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

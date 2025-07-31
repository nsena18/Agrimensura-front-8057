import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import InputMask from 'react-input-mask';

import api from "../../../api";
import apiFunctions from "../../../api/functions.js"

import { formatCurrency } from '../../../functions/functions';

import { Row, Col, Label, Input, InputGroup, FormFeedback, Form, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, TabContent, TabPane, Nav, NavItem, NavLink, Button, FormGroup } from 'reactstrap';
import moment from 'moment';
import HistorialItem from '../EncomiendaProfesional/HistorialItem.js';
import ParadigmaModal from "../../../components/ParadigmaModal/ParadigmaModal.js"
import ParadigmaAsyncSeeker from "../../../components/ParadigmaAsyncSeeker/ParadigmaAsyncSeeker.js"
import ParadigmaLabeledInput from "../../../components/ParadigmaLabeledInput/ParadigmaLabeledInput.js"
import ParadigmaDatePicker from "../../../components/ParadigmaDatePicker/ParadigmaDatePicker.js"

class Modal extends Component {
    constructor(props) {
        super(props);
        const { list_tipovisaciones } = this.props;
        this.state = {
            id: null,
            estado_id: 0,
            estadosplantillas: null,
            estadosplantillas_id: null,
            encomiendaprofesional: null,
            encomiendaprofesional_id: null,
            idGrupoVisacion: null,
            fechacaducidad: moment(),
            fechaestimacion: moment(),
            postVariables: [
                'estadosplantillas',
                'estadosplantillas_id',
                'encomiendaprofesional',
                'encomiendaprofesional_id',
                'fechacaducidad',
                'fechaestimacion',
                'estado_id',
                'idGrupoVisacion',
                'lista_correlativos',
            ],
            errors: [],
            activeTab: 0,
            listObservaciones: [],
            listVisacionesEncomienda: [],
            lista_correlativos: [],
            list_tipovisaciones_local: list_tipovisaciones,
            opcionSeleccionada: 'Sin pack',
            idGrupoVisacion: null,
            listaVisacionesPorGrupo: [],
            textoEstado: '',
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
            estadosplantillas: null,
            estadosplantillas_id: null,
            encomiendaprofesional: null,
            encomiendaprofesional_id: null,
            fechacaducidad: moment(),
            fechaestimacion: moment(),
            estado_id: 0,
            errors: [],
            listObservaciones: [],
            listVisacionesEncomienda: [],
            lista_correlativos: [],
            list_tipovisaciones_local: [],
            idGrupoVisacion: null,
            opcionSeleccionada: 'Sin pack',
            textoEstado: '',
        });
    }

    getData() {
        const { action, list_encomienda, listaGrupoVisaciones } = this.props;
        const { postVariables, fechacaducidad, fechaestimacion, idGrupoVisacion, encomiendaprofesional_id, opcionSeleccionada } = this.state;
        let data = {};
        postVariables.forEach(x => {
            data[x] = this.state[x];
        });

        if (action == 'CREATE') {
            data['estado'] = 'Previa';
        }

        data['fechacaducidad'] = fechacaducidad.format('YYYY-MM-DD')
        data['fechaestimacion'] = fechaestimacion.format('YYYY-MM-DD')

        // Asegurar que idGrupoVisacion se envíe cuando se usa "Con pack"
        if (opcionSeleccionada === 'Con pack' && idGrupoVisacion) {
            data['idGrupoVisacion'] = idGrupoVisacion;
        }

        if (opcionSeleccionada === 'Con pack') {
            let dataVisaciones = listaGrupoVisaciones.find(x => x.id == idGrupoVisacion);
            if (dataVisaciones && dataVisaciones.visaciones.length > 1) {
                console.log(dataVisaciones.visaciones)
                let visacionesList = dataVisaciones.visaciones;
                let objPrimero = visacionesList.shift();
                visacionesList.forEach((element, index) => {
                    let dataExtra = {
                        fechacaducidad: moment().add(1, 'd').format('YYYY-MM-DD'),
                        fechaestimacion: moment().format('YYYY-MM-DD'),
                        estadosplantillas_id: element.id,
                        encomiendaprofesional_id: encomiendaprofesional_id,
                        estado: 'Previa',
                        lista_correlativos: [],
                        idGrupoVisacion: idGrupoVisacion // Agregar aquí también
                    }
                    apiFunctions.post(api.visaciones.encomienda, null, dataExtra, (response) => {
                        console.log(' dato registro ')
                        console.log(response)
                    }, (response) => {
                        console.log(' error  grupos ')
                        console.log(response)
                    }, null);
                });
                data['estadosplantillas_id'] = objPrimero.id;
                data['fechacaducidad'] = moment().add(1, 'd').format('YYYY-MM-DD');
                data['fechaestimacion'] = moment().format('YYYY-MM-DD');
            } else if (dataVisaciones && dataVisaciones.visaciones.length == 1) {
                data['estadosplantillas_id'] = dataVisaciones.visaciones[0].id;
                data['fechacaducidad'] = moment().add(1, 'd').format('YYYY-MM-DD');
                console.log(data.fechacaducidad)
                data['fechaestimacion'] = moment().format('YYYY-MM-DD');
            }
        }

        console.log('Datos a enviar:', data); // Para debug
        return data;
    }

    setData(data) {
        const { action, list_encomienda, list_tipovisaciones } = this.props;
        if (data.success) {
            // Si el estado no puede editar encomienda devuelve mensaje de error
            let idEncomiendaPadre = data.encomiendaprofesional.id;
            this.setState({
                id: data.id,
                estadosplantillas: data.estadosplantillas,
                estadosplantillas_id: data.estadosplantillas.id,
                encomiendaprofesional: data.encomiendaprofesional,
                encomiendaprofesional_id: idEncomiendaPadre,
                fechacaducidad: moment(data.fechacaducidad),
                fechaestimacion: moment(data.fechaestimacion),
                estado_id: data.estado_id,
                lista_correlativos: data.lista_correlativos == null ? [] : data.lista_correlativos,
            });

            if (action == 'DETAIL') {
                apiFunctions.get(api.visaciones.cambioestado, data.id, null, null, (response) => {
                    this.setState({
                        listObservaciones: response.data
                    })
                });
            }
            let plantillaActualId = data.estadosplantillas.id;
            apiFunctions.get(api.visaciones.listadovisacionesencomiendas, idEncomiendaPadre, null, null, (response) => {
                let registros = response.data
                let visacionesFormateada = registros
                    .map((e) => ({
                        id: e.id,
                        nombre: e.estadosplantillas.nombre,
                        numero: e.estadosplantillas.numero
                    }))
                    .filter(item => item.id !== data.id);

                let visacionesFormateadaEstados = registros
                    .map((e) => ({
                        id: e.estadosplantillas.id,
                        nombre: e.estadosplantillas.nombre,
                        numero: e.estadosplantillas.numero
                    }));
                let resultadoNewEstadosPlantillas = list_tipovisaciones.filter(item1 =>
                    !visacionesFormateadaEstados.some(item2 => item2.id === item1.id)
                );
                let plantillaActual = visacionesFormateadaEstados.find(x => x.id == plantillaActualId);
                if (plantillaActual) {
                    resultadoNewEstadosPlantillas.push(plantillaActual)
                }
                this.setState({
                    listVisacionesEncomienda: visacionesFormateada,
                    list_tipovisaciones_local: resultadoNewEstadosPlantillas,
                })
            });

            this.searchEstadoVisacion(data.estado_id)
        }
    }

    setErrors(errors) {
        this.setState({
            errors: errors,
        });
    }

    componentDidMount = () => {
        /* apiFunctions.get(api.visaciones.estadosSelect, null, null, null, (response) => {
            console.log('response')
            console.log(response)
            this.setState({
                list_tipovisaciones: response.data
            })
        }); */
    }

    onChangeSelectEncomienda(data) {
        const { list_tipovisaciones } = this.props;
        this.setState({
            encomiendaprofesional_id: data ? data.id : null
        })

        apiFunctions.get(api.visaciones.listadovisacionesencomiendas, data.id, null, null, (response) => {
            let registros = response.data
            let visacionesFormateada = registros
                .map((e) => ({
                    id: e.estadosplantillas.id,
                }));
            let resultadoNewEstadosPlantillas = list_tipovisaciones.filter(item1 =>
                !visacionesFormateada.some(item2 => item2.id === item1.id)
            );
            let visacionesFormateadaPrevias = registros
                .map((e) => ({
                    id: e.id,
                    nombre: e.estadosplantillas.nombre,
                    numero: e.estadosplantillas.numero
                }))
            this.setState({
                list_tipovisaciones_local: resultadoNewEstadosPlantillas,
                listVisacionesEncomienda: visacionesFormateadaPrevias
            })
        });

    }

    onChangeField(field, value) {
        const { action } = this.props;
        this.setState(prevState => {
            let errors = prevState.errors;
            if (errors) errors[field] = null;
            prevState.errors = errors;
            prevState[field] = value;
            return prevState;
        });

        if (field == 'estadosplantillas_id' && action == 'CREATE') {
            this.searchEstadoInicialVisacion(value);
        }
    }

    searchEstadoInicialVisacion(id) {
        const { lista_estados, list_tipovisaciones } = this.props;

        // Obtener información de la plantilla seleccionada
        const plantillaSeleccionada = list_tipovisaciones.find(plantilla => plantilla.id === id);
        console.log(plantillaSeleccionada)
        apiFunctions.get(api.visaciones.estados, id, null, null, (response) => {
            let registros = response.data;
            if (registros.listaestadosid.length > 0) {
                let idInicial = registros.listaestadosid[0];
                let estadoEncontrado = lista_estados.find(x => x.id == idInicial);
                console.log(plantillaSeleccionada.diasestimados)
                // Calcular nueva fecha de caducidad basada en la fecha de estimación actual
                let nuevaFechaCaducidad = moment(this.state.fechaestimacion);

                if (plantillaSeleccionada && plantillaSeleccionada.diasestimados) {
                    nuevaFechaCaducidad = nuevaFechaCaducidad.add(plantillaSeleccionada.diasestimados, 'days');
                } else {
                    // Valor por defecto si no tiene diasestimados
                    nuevaFechaCaducidad = nuevaFechaCaducidad.add(1, 'days');
                }

                if (estadoEncontrado) {
                    this.setState({
                        estado_id: estadoEncontrado.id,
                        textoEstado: estadoEncontrado.nombre,
                        fechacaducidad: nuevaFechaCaducidad // Establecer la nueva fecha calculada
                    });
                }
            }
        });
    }

    searchEstadoVisacion(id) {
        const { lista_estados } = this.props;
        let estadoEncontrado = lista_estados.find(x => x.id == id);
        console.log(estadoEncontrado)
        if (estadoEncontrado) {
            this.setState({
                estado_id: estadoEncontrado.id,
                textoEstado: estadoEncontrado.nombre
            })
        }
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
                title: "Nueva Visación para la encomienda",
                buttonTitle: "Nuevo",
                danger: false,
                buttonIcon: "fa fa-plus fa-lg",
                successMessage: "La visacion ha sido creada con éxito.",
                saveButton: true,
                saveButtonLabel: "Guardar",
                buttonClass: "",
                disabled: false,
            };
        } else if (action == "EDIT") {
            return {
                get: true,
                submitType: "PUT",
                title: "Editar visación de la encomienda",
                buttonTitle: "Editar",
                danger: false,
                buttonIcon: "fa fa-pencil fa-lg",
                successMessage: "La visación ha sido editada con éxito.",
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
                title: "Visacion de Encomienda",
                buttonTitle: "Ver",
                danger: false,
                buttonIcon: "fa fa-search fa-lg",
                successMessage: "",
                cancelButtonLabel: "Cerrar",
                saveButton: false,
                buttonClass: "",
                disabled: true,
                id: this.props.id,
            };
        } else if (action == "DELETE") {
            return {
                get: true,
                submitType: "DELETE",
                title: "Eliminar visación de la encomienda",
                buttonTitle: "Eliminar",
                danger: true,
                buttonIcon: "fa fa-trash fa-lg",
                successMessage: "La visación ha sido eliminada con éxito.",
                saveButton: true,
                saveButtonLabel: "Eliminar",
                buttonClass: "",
                disabled: true,
                id: this.props.id,
            };
        }
    }

    // Validacion de datos
    onValidation = () => {
        let error = {};
        let validate = true;
        this.setState({
            errors: error,
        })
        return validate;
    }

    handleOpcionChange = (event) => {
        this.setState({
            opcionSeleccionada: event.target.value
        })
        //setOpcionSeleccionada(event.target.value);
    }

    searchVisacionesGroup(field, value) {
        const { listaGrupoVisaciones } = this.props;
        this.setState({
            idGrupoVisacion: value
        })
        let dataVisaciones = listaGrupoVisaciones.find(x => x.id == value);
        if (dataVisaciones) {
            console.log(dataVisaciones.visaciones)
            this.setState({
                listaVisacionesPorGrupo: dataVisaciones.visaciones
            })
        }
    }

    onOpen = () => {
        const { list_encomienda, action, listaGrupoVisaciones } = this.props;
        const { id } = this.state;
        if (action === 'CREATE') {

        }
    }

    render() {
        let vars = this.modalVars();
        const { action, list_encomienda, list_tipovisaciones, listaGrupoVisaciones } = this.props;
        const {
            estadosplantillas,
            estadosplantillas_id,
            encomiendaprofesional,
            encomiendaprofesional_id,
            fechacaducidad,
            fechaestimacion,
            listObservaciones,
            listVisacionesEncomienda,
            lista_correlativos,
            list_tipovisaciones_local,
            opcionSeleccionada,
            idGrupoVisacion,
            listaVisacionesPorGrupo,
            textoEstado,
            estado_id } = this.state;

        return (
            <ParadigmaModal
                getUrl={(vars.get ? api.visaciones.encomienda : null)}
                submitUrl={(vars.submitType ? api.visaciones.encomienda : null)}
                submitType={vars.submitType}
                id={vars.id}

                onGotData={(data) => this.setData(data)}
                onGotErrors={(errors) => this.setErrors(errors)}
                onSubmit={(e) => this.props.onSubmit(e)}
                onClose={() => this.resetForm()}
                onPreSubmit={() => this.getData()}
                onValidation={() => this.onValidation()}
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

                /* className={'modal-lg'} */
                escClose={true}
                fileUploader
            >

                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={(this.state.activeTab == 0 ? "active" : "")}
                            onClick={() => { this.setState({ activeTab: 0 }) }}
                        >Visacion Encomienda</NavLink>
                    </NavItem>
                    {(action == 'DETAIL') &&
                        <NavItem>
                            <NavLink
                                className={(this.state.activeTab == 1 ? "active" : "")}
                                onClick={() => { this.setState({ activeTab: 1 }) }}
                            >Registro de observaciones</NavLink>
                        </NavItem>}
                </Nav>

                <TabContent
                    activeTab={this.state.activeTab}
                    className={"pb-2"}>

                    <TabPane tabId={0} className="py-1">
                        <ParadigmaLabeledInput
                            label="Encomienda"
                            md={[4, 8]}
                            inputComponent={
                                <ParadigmaAsyncSeeker
                                    // disabled={vars.disabled}
                                    disabled={vars.disabled || action != "CREATE"}
                                    url={undefined}
                                    clearable={false}
                                    displayField={"nroOrden"}
                                    value={encomiendaprofesional_id}
                                    optionDefault={list_encomienda.map(e => { return { id: e.id, nroOrden: e.nroOrden } })}
                                    onChange={e => this.onChangeSelectEncomienda(e)}
                                />
                            }
                            error={() => this.getError('encomiendaprofesional_id')}
                        />
                        <ParadigmaLabeledInput
                            md={[4, 8]}
                            label={"Estado Visación"}
                            inputComponent={
                                <ParadigmaAsyncSeeker
                                    clearable={true}
                                    disabled={vars.disabled}
                                    url={api.visaciones.controlEstadosSelect}
                                    value={estado_id}
                                    parameters={{
                                        paginationEnabled: false,
                                        sort: ['nombre'],
                                    }}
                                    onChange={(data) => { this.onChangeField('estado_id', (data ? data.id : null)); }}
                                />
                            }
                            error={() => this.getError('estado_id')}
                        />
                        {
                            (action == 'CREATE') && (
                                <div>
                                    <Row>
                                        <Col style={{ marginTop: '10px' }}>
                                            <Label>Selecciona una opción</Label>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col style={{ marginBottom: '5px' }}>
                                            <FormGroup check inline>
                                                <Input
                                                    type="radio"
                                                    name="visacionGroup"
                                                    value="Sin pack"
                                                    checked={opcionSeleccionada === 'Sin pack'}
                                                    onChange={this.handleOpcionChange}
                                                />
                                                <Label check>
                                                    Visación individual
                                                </Label>
                                            </FormGroup>

                                            <FormGroup check inline>
                                                <Input
                                                    type="radio"
                                                    name="visacionGroup"
                                                    value="Con pack"
                                                    checked={opcionSeleccionada === 'Con pack'}
                                                    onChange={this.handleOpcionChange}
                                                />
                                                <Label check>
                                                    Usar paquete de visaciones
                                                </Label>
                                            </FormGroup>


                                        </Col>
                                    </Row>
                                </div>
                            )
                        }


                        {
                            (opcionSeleccionada === 'Sin pack' || action != 'CREATE') && (
                                <div>
                                    <ParadigmaLabeledInput
                                        disabled={vars.disabled || action != "CREATE"}
                                        label="Plantilla Visación"
                                        md={[4, 8]}
                                        inputComponent={
                                            <ParadigmaAsyncSeeker
                                                // disabled={vars.disabled}
                                                disabled={vars.disabled || action != "CREATE"}
                                                url={undefined}
                                                clearable={false}
                                                value={estadosplantillas_id}
                                                displayField={'nombre'}
                                                optionDefault={list_tipovisaciones_local.map(e => { return { id: e.id, nombre: e.nombre } })}
                                                onChange={e => this.onChangeField('estadosplantillas_id', (e) ? (e.id) : (null))}
                                            />
                                        }
                                        error={() => this.getError('estadosplantillas_id')}
                                    />
                                    <ParadigmaLabeledInput
                                        label="Visaciones Previas"
                                        md={[4, 8]}
                                        classNames={['pr-0', '']}
                                        error={() => this.getError('lista_correlativos')}
                                        inputComponent={
                                            <ParadigmaAsyncSeeker
                                                disabled={vars.disabled}
                                                multiselect={true}
                                                clearable={false}
                                                url={undefined}
                                                value={lista_correlativos}
                                                optionDefault={listVisacionesEncomienda.map(e => { return { id: e.id, nombre: e.nombre, numero: e.numero } })}
                                                parameters={{
                                                    paginationEnabled: false,
                                                }}
                                                valueRenderer={data => `${data.numero} => ${data.nombre}`}
                                                optionRenderer={data => `${data.numero} => ${data.nombre}`}
                                                onChange={data => this.onChangeField('lista_correlativos', data ? data.map(e => e.id) : [])}
                                            />
                                        }
                                    />
                                    <ParadigmaLabeledInput
                                        disabled={vars.disabled}
                                        md={[4, 8]}
                                        maxLength={50}
                                        label={"Fecha Estimación"}
                                        inputComponent={
                                            <ParadigmaDatePicker
                                                disabled={vars.disabled}
                                                // disabled={true}
                                                value={fechaestimacion}
                                                onChange={(e) => this.setState({ 'fechaestimacion': e })}
                                                datetime={false}
                                                className={"inp_fecha"}
                                            />}
                                        error={() => this.getError('fechaestimacion')}
                                    />
                                    <ParadigmaLabeledInput
                                        disabled={vars.disabled}
                                        md={[4, 8]}
                                        maxLength={50}
                                        label={"Fecha Caducidad"}
                                        inputComponent={
                                            <ParadigmaDatePicker
                                                disabled={vars.disabled}
                                                // disabled={true}
                                                value={fechacaducidad}
                                                onChange={(e) => this.setState({ 'fechacaducidad': e })}
                                                datetime={false}
                                                className={"inp_fecha"}
                                            />}
                                        error={() => this.getError('fechacaducidad')}
                                    />
                                </div>
                            )
                        }
                        {
                            (opcionSeleccionada === 'Con pack' && action == 'CREATE') && (
                                <div>
                                    <ParadigmaLabeledInput
                                        label="Grupo de visaciones"
                                        md={[4, 8]}
                                        inputComponent={
                                            <ParadigmaAsyncSeeker
                                                // disabled={vars.disabled}
                                                disabled={vars.disabled}
                                                url={undefined}
                                                clearable={false}
                                                value={idGrupoVisacion}
                                                displayField={'nombre'}
                                                optionDefault={listaGrupoVisaciones.map(e => { return { id: e.id, nombre: e.nombre_grupo } })}
                                                onChange={e => this.searchVisacionesGroup('idGrupoVisacion', (e) ? (e.id) : (null))}
                                            />
                                        }
                                        error={() => this.getError('idGrupoVisacion')}
                                    />
                                    {
                                        listaVisacionesPorGrupo.length > 0 ? (
                                            <div style={{ marginTop: '10px' }} >
                                                <ListGroup>
                                                    {
                                                        listaVisacionesPorGrupo.map((e, index) => {
                                                            return (
                                                                <ListGroupItem key={index} >
                                                                    <strong>{(index + 1)} .-  Visación #{e.numero}</strong><br></br>
                                                                    {e.nombre}
                                                                </ListGroupItem>
                                                            )
                                                        })
                                                    }

                                                </ListGroup>
                                            </div>
                                        ) : (
                                            <div style={{ textAlign: 'center', marginTop: '10px' }} >
                                                <strong style={{ color: 'red' }} >Sin visaciónes</strong>
                                            </div>
                                        )
                                    }
                                </div>
                            )
                        }


                    </TabPane>
                    <TabPane tabId={1} className="py-1">

                        {Array.isArray(listObservaciones) && listObservaciones.length > 0 ? (
                            listObservaciones.map((dataestado, i) => (
                                <div key={`historia-${i}`}>
                                    <div className="d-flex my-3">
                                        <div style={{ minWidth: 120 }}>
                                            {dataestado.fecharegistrada && moment(dataestado.fecharegistrada).format('DD/MM/YYYY')}
                                        </div>
                                        <div className="text-center px-2">
                                            <div
                                                className="historial__icon bg-success rounded-circle d-flex justify-content-center align-items-center"
                                                style={{ width: 25, height: 25 }}
                                            >
                                                <i className="fa fa-arrow-right"></i>
                                            </div>
                                        </div>
                                        <div className="flex-grow-1">
                                            <HistorialItem
                                                tituloheader="Cambio de Estado"
                                                titulo={"Visacion en estado :  " + dataestado.estado}
                                                observacion={dataestado.observaciones || ''}
                                                archivo={dataestado.archivoAdjunto ? `${api.visaciones.archivo}${dataestado.id}/` : `${api.visaciones.archivo}${dataestado.id}/`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-muted text-center py-3">
                                No hay observaciones registradas
                            </div>
                        )}

                    </TabPane>
                </TabContent>
            </ParadigmaModal>
        );
    }
}

export default Modal;

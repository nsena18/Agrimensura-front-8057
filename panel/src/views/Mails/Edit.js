import React, { Component } from "react";
import PropTypes from "prop-types";
import ParadigmaModal from "../../components/ParadigmaModal/ParadigmaModal.js";
import api from "../../api";
import apiFunctions from "../../api/functions.js";

import { Row, Col, Label, Input, InputGroup, FormFeedback } from "reactstrap";

import ParadigmaAsyncSeeker from "../../components/ParadigmaAsyncSeeker/ParadigmaAsyncSeeker.js";
import ParadigmaLabeledInput from "../../components/ParadigmaLabeledInput";

class Edit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            casilla_id: null,
            plantillaRegistroUsuario_id: null,
            activeRegistroUsuario: false,

            plantillaForgottenPass_id: null,
            activeForgottenPass: false,

            plantillaEPF_id: null,
            activeEPF: false,

            plantillaEPP_id: null,
            activeEPP: false,

            plantillaEPCE_id: null,
            activeEPCE: false,

            plantillaCC_id: null,
            activeCC: false,

            plantillaCE_id: null,
            activeCE: false,

            plantillaAE_id: null,
            activeAE: false,
            diasPreviosAE: 1,

            plantillaRUA_id: null,
            activeRUA: false,
            emailRUA: "",

            plantillaECE_id: null,
            activeECE: false,

            plantillaCN_id: null,
            activeCN: false,

            plantillaCUA_id: null,
            activeCUA: false,

            postVariables: [
                "casilla_id",
                "activeRegistroUsuario",
                "plantillaRegistroUsuario_id",
                "activeForgottenPass",
                "plantillaForgottenPass_id",
                "activeEPF",
                "plantillaEPF_id",
                "activeEPP",
                "plantillaEPP_id",
                "plantillaEPCE_id",
                "activeEPCE",
                "activeCC",
                "plantillaCC_id",
                "activeRUA",
                "plantillaRUA_id",
                "emailRUA",
                "activeCE",
                "plantillaCE_id",
                "activeAE",
                "plantillaAE_id",
                "diasPreviosAE",
                "plantillaECE_id",
                "activeECE",
                "plantillaCN_id",
                "activeCN",
                "plantillaCUA_id",
                "activeCUA",
            ],
            errors: [],
            ar_plantillas: [],
        };
    }

    static propTypes = {
        nav: PropTypes.any,
    };

    getData() {
        const { postVariables } = this.state;
        let data = {};
        postVariables.forEach((x) => {
            data[x] = this.state[x];
        });

        return data;
    }

    resetForm() {
        this.setState({
            casilla_id: null,
            plantillaRegistroUsuario_id: null,
            activeRegistroUsuario: null,

            plantillaForgottenPass_id: null,
            activeForgottenPass: null,

            plantillaEPF_id: null,
            activeEPF: false,

            plantillaEPP_id: null,
            activeEPP: false,

            plantillaEPCE_id: null,
            activeEPCE: false,

            plantillaCC_id: null,
            activeCC: false,

            plantillaCE_id: null,
            activeCE: false,

            plantillaAE_id: null,
            activeAE: false,
            diasPreviosAE: 1,

            plantillaRUA_id: null,
            activeRUA: false,
            emailRUA: "",

            plantillaECE_id: null,
            activeECE: false,

            plantillaCN_id: null,
            activeCN: false,

            plantillaCUA_id: null,
            activeCUA: false,

            ar_plantillas: [],
        });
    }

    setData(data) {
        this.setState({
            casilla_id: data.casilla ? data.casilla.id : null,
            plantillaRegistroUsuario_id: data.plantillaRegistroUsuario
                ? data.plantillaRegistroUsuario.id
                : null,
            activeRegistroUsuario: data.activeRegistroUsuario,

            plantillaForgottenPass_id: data.plantillaForgottenPass
                ? data.plantillaForgottenPass.id
                : null,
            activeForgottenPass: data.activeForgottenPass,

            plantillaEPF_id: data.plantillaEPF ? data.plantillaEPF.id : null,
            activeEPF: data.activeEPF,

            plantillaEPP_id: data.plantillaEPP ? data.plantillaEPP.id : null,
            activeEPP: data.activeEPP,

            plantillaEPCE_id: data.plantillaEPCE ? data.plantillaEPCE.id : null,
            activeEPCE: data.activeEPCE,

            plantillaCC_id: data.plantillaCC ? data.plantillaCC.id : null,
            activeCC: data.activeCC,

            plantillaCE_id: data.plantillaCE ? data.plantillaCE.id : null,
            activeCE: data.activeCE,

            plantillaAE_id: data.plantillaAE ? data.plantillaAE.id : null,
            activeAE: data.activeAE,
            diasPreviosAE: data.diasPreviosAE,

            plantillaRUA_id: data.plantillaRUA ? data.plantillaRUA.id : null,
            activeRUA: data.activeRUA,
            emailRUA: data.emailRUA,

            plantillaECE_id: data.plantillaECE ? data.plantillaECE.id : null,
            activeECE: data.activeECE,

            plantillaCN_id: data.plantillaCN ? data.plantillaCN.id : null,
            activeCN: data.activeCN,

            plantillaCUA_id: data.plantillaCUA ? data.plantillaCUA.id : null,
            activeCUA: data.activeCUA,
        });
    }

    setErrors(errors) {
        this.setState({
            errors: errors,
        });
    }

    onChangeField(field, value) {
        this.setState((prevState) => {
            let errors = prevState.errors;
            if (errors) errors[field] = null;
            prevState.errors = errors;
            prevState[field] = value;
            return prevState;
        });
    }

    getError(field) {
        let errors = this.state.errors;
        if (errors) return errors[field];
        else return null;
    }

    toggleCheckActive = (field, value) => {
        this.onChangeField(field, !value);
    };

    componentDidMount = () => {
        apiFunctions.get(
            api.mails.plantillas,
            null,
            this.props.depth,
            null,
            (response) => {
                this.setState({
                    ar_plantillas: response.data,
                });
            }
        );
    };

    render() {
        const {
            casilla_id,
            plantillaRegistroUsuario_id,
            activeRegistroUsuario,
            plantillaForgottenPass_id,
            activeForgottenPass,
            plantillaEPF_id,
            activeEPF,
            plantillaEPP_id,
            activeEPP,
            plantillaEPCE_id,
            activeEPCE,
            plantillaCC_id,
            activeCC,
            plantillaRUA_id,
            activeRUA,
            emailRUA,
            plantillaCE_id,
            activeCE,
            plantillaAE_id,
            activeAE,
            diasPreviosAE,
            plantillaECE_id,
            activeECE,
            plantillaCN_id,
            activeCN,
            ar_plantillas,
            plantillaCUA_id,
            activeCUA,
        } = this.state;

        return (
            <ParadigmaModal
                navButton={true}
                nav={this.props.nav}
                getUrl={api.mails.config}
                submitUrl={api.mails.config}
                submitType={"PUT"}
                id={null}
                onGotData={(data) => this.setData(data)}
                onGotErrors={(errors) => this.setErrors(errors)}
                onSubmit={(e) => null}
                onClose={() => this.resetForm()}
                onPreSubmit={() => this.getData()}
                title={"Editar Configuración"}
                successMessage={"La Configuración ha sido editada con éxito."}
                missingIdMessage={"Debe seleccionar una fila."}
                buttonTitle={"Editar"}
                buttonIcon={"fa fa-pencil fa-lg"}
                saveButton={true}
                closeButton={true}
                className={"modal-lg"}
                escClose={true}
            >
                <Row>
                    <Col className={"col-12 col-md-6"}>
                        <ParadigmaLabeledInput
                            label={"Casilla"}
                            md={[3, 9]}
                            inputComponent={
                                <ParadigmaAsyncSeeker
                                    clearable={true}
                                    url={api.mails.casillas}
                                    value={casilla_id}
                                    onChange={(data) =>
                                        this.onChangeField(
                                            "casilla_id",
                                            data ? data.id : null
                                        )
                                    }
                                />
                            }
                            error={() => this.getError("casilla_id")}
                        />
                    </Col>
                </Row>

                <Row>
                    <Col className={"col-12 col-md-6"}>
                        <Row className="mt-2">
                            <Col className="col-12 col-separator">
                                Registro de Usuario
                            </Col>
                        </Row>
                        <div className={"mt-sm-1 row"}>
                            <label
                                className={"col-12 col-md-8"}
                                style={{ marginRight: "10px" }}
                            >
                                <input
                                    type="checkbox"
                                    className="filled-in"
                                    checked={activeRegistroUsuario}
                                    onChange={(e) => {}}
                                />
                                <span
                                    onClick={() =>
                                        this.toggleCheckActive(
                                            "activeRegistroUsuario",
                                            activeRegistroUsuario
                                        )
                                    }
                                >
                                    Activado
                                </span>
                            </label>
                        </div>

                        <ParadigmaLabeledInput
                            label={"Plantilla"}
                            md={[3, 9]}
                            inputComponent={
                                <ParadigmaAsyncSeeker
                                    displayField="descripcion"
                                    clearable={true}
                                    url={
                                        ar_plantillas &&
                                        ar_plantillas.length > 0
                                            ? undefined
                                            : api.mails.plantillas
                                    }
                                    optionDefault={
                                        ar_plantillas &&
                                        ar_plantillas.length > 0
                                            ? ar_plantillas
                                            : undefined
                                    }
                                    value={plantillaRegistroUsuario_id}
                                    onChange={(data) =>
                                        this.setState({
                                            plantillaRegistroUsuario_id: data
                                                ? data.id
                                                : null,
                                        })
                                    }
                                />
                            }
                            error={() =>
                                this.getError("plantillaRegistroUsuario_id")
                            }
                        />
                    </Col>

                    <Col className={"col-12 col-md-6"}>
                        <Row className="mt-2">
                            <Col className="col-12 col-separator">
                                Recuperar Contraseña
                            </Col>
                        </Row>
                        <div className={"mt-sm-1 row"}>
                            <label
                                className={"col-12 col-md-8"}
                                style={{ marginRight: "10px" }}
                            >
                                <input
                                    type="checkbox"
                                    className="filled-in"
                                    checked={activeForgottenPass}
                                    onChange={(e) => {}}
                                />
                                <span
                                    onClick={() =>
                                        this.toggleCheckActive(
                                            "activeForgottenPass",
                                            activeForgottenPass
                                        )
                                    }
                                >
                                    Activado
                                </span>
                            </label>
                        </div>

                        <ParadigmaLabeledInput
                            label={"Plantilla"}
                            md={[3, 9]}
                            inputComponent={
                                <ParadigmaAsyncSeeker
                                    displayField="descripcion"
                                    clearable={true}
                                    url={
                                        ar_plantillas &&
                                        ar_plantillas.length > 0
                                            ? undefined
                                            : api.mails.plantillas
                                    }
                                    optionDefault={
                                        ar_plantillas &&
                                        ar_plantillas.length > 0
                                            ? ar_plantillas
                                            : undefined
                                    }
                                    value={plantillaForgottenPass_id}
                                    onChange={(data) =>
                                        this.setState({
                                            plantillaForgottenPass_id: data
                                                ? data.id
                                                : null,
                                        })
                                    }
                                />
                            }
                            error={() =>
                                this.getError("plantillaForgottenPass_id")
                            }
                        />
                    </Col>

                    <Col className={"col-12 col-md-6"}>
                        <Row className="mt-2">
                            <Col className="col-12 col-separator">
                                Confirmación Comitente
                            </Col>
                        </Row>
                        <div className={"mt-sm-1 row"}>
                            <label
                                className={"col-12 col-md-8"}
                                style={{ marginRight: "10px" }}
                            >
                                <input
                                    type="checkbox"
                                    className="filled-in"
                                    checked={activeCC}
                                    onChange={(e) => {}}
                                />
                                <span
                                    onClick={() =>
                                        this.toggleCheckActive(
                                            "activeCC",
                                            activeCC
                                        )
                                    }
                                >
                                    Activado
                                </span>
                            </label>
                        </div>

                        <ParadigmaLabeledInput
                            label={"Plantilla"}
                            md={[3, 9]}
                            inputComponent={
                                <ParadigmaAsyncSeeker
                                    displayField="descripcion"
                                    clearable={true}
                                    url={
                                        ar_plantillas &&
                                        ar_plantillas.length > 0
                                            ? undefined
                                            : api.mails.plantillas
                                    }
                                    optionDefault={
                                        ar_plantillas &&
                                        ar_plantillas.length > 0
                                            ? ar_plantillas
                                            : undefined
                                    }
                                    value={plantillaCC_id}
                                    onChange={(data) =>
                                        this.setState({
                                            plantillaCC_id: data
                                                ? data.id
                                                : null,
                                        })
                                    }
                                />
                            }
                            error={() => this.getError("plantillaCC_id")}
                        />
                    </Col>

                    <Col className={"col-12 col-md-6"}>
                        <Row className="mt-2">
                            <Col className="col-12 col-separator">
                                Creación de Evento
                            </Col>
                        </Row>
                        <div className={"mt-sm-1 row"}>
                            <label
                                className={"col-12 col-md-8"}
                                style={{ marginRight: "10px" }}
                            >
                                <input
                                    type="checkbox"
                                    className="filled-in"
                                    checked={activeCE}
                                    onChange={(e) => {}}
                                />
                                <span
                                    onClick={() =>
                                        this.toggleCheckActive(
                                            "activeCE",
                                            activeCE
                                        )
                                    }
                                >
                                    Activado
                                </span>
                            </label>
                        </div>

                        <ParadigmaLabeledInput
                            label={"Plantilla"}
                            md={[3, 9]}
                            inputComponent={
                                <ParadigmaAsyncSeeker
                                    displayField="descripcion"
                                    clearable={true}
                                    url={
                                        ar_plantillas &&
                                        ar_plantillas.length > 0
                                            ? undefined
                                            : api.mails.plantillas
                                    }
                                    optionDefault={
                                        ar_plantillas &&
                                        ar_plantillas.length > 0
                                            ? ar_plantillas
                                            : undefined
                                    }
                                    value={plantillaCE_id}
                                    onChange={(data) =>
                                        this.setState({
                                            plantillaCE_id: data
                                                ? data.id
                                                : null,
                                        })
                                    }
                                />
                            }
                            error={() => this.getError("plantillaCE_id")}
                        />
                    </Col>

                    <Col className={"col-12 col-md-6"}>
                        <Row className="mt-2">
                            <Col className="col-12 col-separator">
                                Aviso de Evento
                            </Col>
                        </Row>
                        <div className={"mt-sm-1 row"}>
                            <label
                                className={"col-12 col-md-8"}
                                style={{ marginRight: "10px" }}
                            >
                                <input
                                    type="checkbox"
                                    className="filled-in"
                                    checked={activeAE}
                                    onChange={(e) => {}}
                                />
                                <span
                                    onClick={() =>
                                        this.toggleCheckActive(
                                            "activeAE",
                                            activeAE
                                        )
                                    }
                                >
                                    Activado
                                </span>
                            </label>
                        </div>

                        <ParadigmaLabeledInput
                            label={"Plantilla"}
                            md={[3, 9]}
                            inputComponent={
                                <ParadigmaAsyncSeeker
                                    displayField="descripcion"
                                    clearable={true}
                                    url={
                                        ar_plantillas &&
                                        ar_plantillas.length > 0
                                            ? undefined
                                            : api.mails.plantillas
                                    }
                                    optionDefault={
                                        ar_plantillas &&
                                        ar_plantillas.length > 0
                                            ? ar_plantillas
                                            : undefined
                                    }
                                    value={plantillaAE_id}
                                    onChange={(data) =>
                                        this.setState({
                                            plantillaAE_id: data
                                                ? data.id
                                                : null,
                                        })
                                    }
                                />
                            }
                            error={() => this.getError("plantillaAE_id")}
                        />

                        <ParadigmaLabeledInput
                            label={"Dias Previos"}
                            md={[3, 9]}
                            type={"integer"}
                            value={diasPreviosAE}
                            classNames={["pr-0", ""]}
                            onChange={(data) =>
                                this.setState({
                                    diasPreviosAE: data.target.value,
                                })
                            }
                            error={() => this.getError("diasPreviosAE")}
                        />
                    </Col>

                    <Col className={"col-12 col-md-6"}>
                        <Row className="mt-2">
                            <Col className="col-12 col-separator">
                                Aviso de Usuario Registrado
                            </Col>
                        </Row>
                        <div className={"mt-sm-1 row"}>
                            <label
                                className={"col-12 col-md-8"}
                                style={{ marginRight: "10px" }}
                            >
                                <input
                                    type="checkbox"
                                    className="filled-in"
                                    checked={activeRUA}
                                    onChange={(e) => {}}
                                />
                                <span
                                    onClick={() =>
                                        this.toggleCheckActive(
                                            "activeRUA",
                                            activeRUA
                                        )
                                    }
                                >
                                    Activado
                                </span>
                            </label>
                        </div>

                        <ParadigmaLabeledInput
                            label={"Plantilla"}
                            md={[3, 9]}
                            inputComponent={
                                <ParadigmaAsyncSeeker
                                    displayField="descripcion"
                                    clearable={true}
                                    url={
                                        ar_plantillas &&
                                        ar_plantillas.length > 0
                                            ? undefined
                                            : api.mails.plantillas
                                    }
                                    optionDefault={
                                        ar_plantillas &&
                                        ar_plantillas.length > 0
                                            ? ar_plantillas
                                            : undefined
                                    }
                                    value={plantillaRUA_id}
                                    onChange={(data) =>
                                        this.setState({
                                            plantillaRUA_id: data
                                                ? data.id
                                                : null,
                                        })
                                    }
                                />
                            }
                            error={() => this.getError("plantillaRUA_id")}
                        />

                        <ParadigmaLabeledInput
                            label={"Email Admin"}
                            md={[3, 9]}
                            value={emailRUA}
                            onChange={(data) =>
                                this.setState({ emailRUA: data.target.value })
                            }
                            classNames={["pr-0", ""]}
                            error={() => this.getError("emailRUA")}
                        />
                    </Col>

                    <Col className={"col-12 col-md-6"}>
                        <Row className="mt-2">
                            <Col className="col-12 col-separator">
                                Edición de Encomienda Comitente
                            </Col>
                        </Row>
                        <div className={"mt-sm-1 row"}>
                            <label
                                className={"col-12 col-md-8"}
                                style={{ marginRight: "10px" }}
                            >
                                <input
                                    type="checkbox"
                                    className="filled-in"
                                    checked={activeECE}
                                    onChange={(e) => {}}
                                />
                                <span
                                    onClick={() =>
                                        this.toggleCheckActive(
                                            "activeECE",
                                            activeECE
                                        )
                                    }
                                >
                                    Activado
                                </span>
                            </label>
                        </div>

                        <ParadigmaLabeledInput
                            label={"Plantilla"}
                            md={[3, 9]}
                            inputComponent={
                                <ParadigmaAsyncSeeker
                                    displayField="descripcion"
                                    clearable={true}
                                    url={
                                        ar_plantillas &&
                                        ar_plantillas.length > 0
                                            ? undefined
                                            : api.mails.plantillas
                                    }
                                    optionDefault={
                                        ar_plantillas &&
                                        ar_plantillas.length > 0
                                            ? ar_plantillas
                                            : undefined
                                    }
                                    value={plantillaECE_id}
                                    onChange={(data) =>
                                        this.setState({
                                            plantillaECE_id: data
                                                ? data.id
                                                : null,
                                        })
                                    }
                                />
                            }
                            error={() => this.getError("plantillaECE_id")}
                        />
                    </Col>

                    <Col className={"col-12 col-md-6"}>
                        <Row className="mt-2">
                            <Col className="col-12 col-separator">
                                Creación de Notas
                            </Col>
                        </Row>
                        <div className={"mt-sm-1 row"}>
                            <label
                                className={"col-12 col-md-8"}
                                style={{ marginRight: "10px" }}
                            >
                                <input
                                    type="checkbox"
                                    className="filled-in"
                                    checked={activeCN}
                                    onChange={(e) => {}}
                                />
                                <span
                                    onClick={() =>
                                        this.toggleCheckActive(
                                            "activeCN",
                                            activeCN
                                        )
                                    }
                                >
                                    Activado
                                </span>
                            </label>
                        </div>

                        <ParadigmaLabeledInput
                            label={"Plantilla"}
                            md={[3, 9]}
                            inputComponent={
                                <ParadigmaAsyncSeeker
                                    displayField="descripcion"
                                    clearable={true}
                                    url={
                                        ar_plantillas &&
                                        ar_plantillas.length > 0
                                            ? undefined
                                            : api.mails.plantillas
                                    }
                                    optionDefault={
                                        ar_plantillas &&
                                        ar_plantillas.length > 0
                                            ? ar_plantillas
                                            : undefined
                                    }
                                    value={plantillaCN_id}
                                    onChange={(data) =>
                                        this.setState({
                                            plantillaCN_id: data
                                                ? data.id
                                                : null,
                                        })
                                    }
                                />
                            }
                            error={() => this.getError("plantillaCN_id")}
                        />
                    </Col>

                    <Col className={"col-12 col-md-6"}>
                        <Row className="mt-2">
                            <Col className="col-12 col-separator">
                                Creación de Usuario Administrativo
                            </Col>
                        </Row>
                        <div className={"mt-sm-1 row"}>
                            <label
                                className={"col-12 col-md-8"}
                                style={{ marginRight: "10px" }}
                            >
                                <input
                                    type="checkbox"
                                    className="filled-in"
                                    checked={activeCUA}
                                    onChange={(e) => {}}
                                />
                                <span
                                    onClick={() =>
                                        this.toggleCheckActive(
                                            "activeCUA",
                                            activeCUA
                                        )
                                    }
                                >
                                    Activado
                                </span>
                            </label>
                        </div>

                        <ParadigmaLabeledInput
                            label={"Plantilla"}
                            md={[3, 9]}
                            inputComponent={
                                <ParadigmaAsyncSeeker
                                    displayField="descripcion"
                                    clearable={true}
                                    url={
                                        ar_plantillas &&
                                        ar_plantillas.length > 0
                                            ? undefined
                                            : api.mails.plantillas
                                    }
                                    optionDefault={
                                        ar_plantillas &&
                                        ar_plantillas.length > 0
                                            ? ar_plantillas
                                            : undefined
                                    }
                                    value={plantillaCUA_id}
                                    onChange={(data) =>
                                        this.setState({
                                            plantillaCUA_id: data
                                                ? data.id
                                                : null,
                                        })
                                    }
                                />
                            }
                            error={() => this.getError("plantillaCUA_id")}
                        />
                    </Col>

                    {/*<Col className={'col-12 col-md-6'}>
                        <Row className="mt-2">
                            <Col className="col-12 col-separator">Encomienda Presupuesto</Col>
                        </Row>
                        <div className={"mt-sm-1 row"}>
                                <label className={"col-12 col-md-8"} style={{marginRight: '10px'}}>
                                    <input type="checkbox" className="filled-in" checked={activeEPP} onChange={(e) => {}}/>
                                    <span onClick={() => this.toggleCheckActive('activeEPP', activeEPP)}>Activado</span>
                                </label>
                        </div>
                        
                        <ParadigmaLabeledInput
                            label={"Plantilla"}
                            md={[3, 9]}
                            inputComponent={<ParadigmaAsyncSeeker
                                displayField="descripcion"
                                clearable={true}
                                url={api.mails.plantillas}
                                value={plantillaEPP_id}
                                onChange={(data) => this.setState({ plantillaEPP_id: (data ? data.id : null) })}
                            />}
                            error={() => this.getError('plantillaEPP_id')}
                        />
                    </Col>

                    <Col className={'col-12 col-md-6'}>
                        <Row className="mt-2">
                            <Col className="col-12 col-separator">Encomienda Finalizada</Col>
                        </Row>
                        <div className={"mt-sm-1 row"}>
                                <label className={"col-12 col-md-8"} style={{marginRight: '10px'}}>
                                    <input type="checkbox" className="filled-in" checked={activeEPF} onChange={(e) => {}}/>
                                    <span onClick={() => this.toggleCheckActive('activeEPF', activeEPF)}>Activado</span>
                                </label>
                        </div>
                        
                        <ParadigmaLabeledInput
                            label={"Plantilla"}
                            md={[3, 9]}
                            inputComponent={<ParadigmaAsyncSeeker
                                displayField="descripcion"
                                clearable={true}
                                url={api.mails.plantillas}
                                value={plantillaEPF_id}
                                onChange={(data) => this.setState({ plantillaEPF_id: (data ? data.id : null) })}
                            />}
                            error={() => this.getError('plantillaEPF_id')}
                        />
                    </Col>

                    <Col className={'col-12 col-md-6'}>
                        <Row className="mt-2">
                            <Col className="col-12 col-separator">Cambio de Estado</Col>
                        </Row>
                        <div className={"mt-sm-1 row"}>
                                <label className={"col-12 col-md-8"} style={{marginRight: '10px'}}>
                                    <input type="checkbox" className="filled-in" checked={activeEPCE} onChange={(e) => {}}/>
                                    <span onClick={() => this.toggleCheckActive('activeEPCE', activeEPCE)}>Activado</span>
                                </label>
                        </div>
                        
                        <ParadigmaLabeledInput
                            label={"Plantilla"}
                            md={[3, 9]}
                            inputComponent={<ParadigmaAsyncSeeker
                                displayField="descripcion"
                                clearable={true}
                                url={api.mails.plantillas}
                                value={plantillaEPCE_id}
                                onChange={(data) => this.setState({ plantillaEPCE_id: (data ? data.id : null) })}
                            />}
                            error={() => this.getError('plantillaEPCE_id')}
                        />
                    </Col>*/}
                </Row>
            </ParadigmaModal>
        );
    }
}

export default Edit;

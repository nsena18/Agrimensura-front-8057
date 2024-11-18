import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from "axios";
import api from "../../api";
import apifunctions from "../../api/functions.js";
import auth from "../../auth";
import serialize from 'form-serialize';
import { NavItem, NavLink, Row, UncontrolledTooltip, Tooltip, Label, FormFeedback, Col, Button, Input, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardHeader, CardBody } from 'reactstrap';
import Draggable from 'react-draggable';

import jsonToFormData from 'json-form-data';
import Loader from '../Loader'
import "./ParadigmaModal.scss";

class ParadigmaModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: (this.props.initOpen ? true : false),
            navButton: (this.props.navButton ? true : false),
            success: null,
            allowed: true,
            message: undefined,
            error: undefined,
            id: this.NewID(),
            backdrop: (!this.props.hideBackdrop ? true : false),
            keyboard: (this.props.keyboard ? true : false),

            // Propiedad para permitir cerrar el modal haciendo click fuera de la modal. En caso de que no haya postUrl se permitira de todos modos. (Ventanas de detalle)
            backdropToggle: (this.props.backdropToggle ? true : (!this.props.submitUrl ? true : false)),
            protected: undefined,

        };
    }

    static propTypes = {
        initOpen: PropTypes.bool,
        hideBackdrop: PropTypes.bool,
        keyboard: PropTypes.bool,

        showConfirmationMessages: PropTypes.bool,

        id: PropTypes.func,
        multiSelectIds: PropTypes.func,
        multiSelect: PropTypes.bool,

        title: PropTypes.string,

        danger: PropTypes.bool,
        warning: PropTypes.bool,
        className: PropTypes.string,

        buttonIcon: PropTypes.string,
        buttonClass: PropTypes.string,
        buttonTitle: PropTypes.string,

        getUrl: PropTypes.string,
        getDepth: PropTypes.number,
        submitUrl: PropTypes.string,
        downloadUrl: PropTypes.string,
        submitType: PropTypes.oneOf(['POST', 'PUT', 'PATCH', 'DELETE']),
        forceDelete: PropTypes.bool, // fuerza el delete

        onSubmit: PropTypes.func,
        onClose: PropTypes.func,
        onOpen: PropTypes.func,
        onCleanForm: PropTypes.func,
        onGotData: PropTypes.func,
        onGotErrors: PropTypes.func,
        onPreSubmit: PropTypes.func,
        onPreGet: PropTypes.func,
        onValidation: PropTypes.func,

        notAllowedMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
        missingIdMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
        successMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),

        buttonLabel: PropTypes.string,

        saveButton: PropTypes.bool,
        saveButtonLabel: PropTypes.string,
        saveReloadButton: PropTypes.bool,
        saveReloadButtonLabel: PropTypes.string,
        closeButton: PropTypes.bool,
        cancelButtonLabel: PropTypes.string,

        fileUploader: PropTypes.bool,
        fileDownloader: PropTypes.bool,

        navButton: PropTypes.bool,
        nav: PropTypes.any,

        disableddraggable: PropTypes.bool, //Disable draggable modal (mover modal)
        escClose: PropTypes.bool,
    }

    componentWillMount() {
        this.state.loading = this.props.Loading;
    }


    toggleModal(e, forceOpen = false, initop = false) {
        if (e)
            e.preventDefault();
        if (!this.state.loading)
            if (this.state.visible && !forceOpen && !initop) {
                var self = this;
                if (self.props.onClose) {
                    self.props.onClose();
                }
                this.setState({
                    visible: !this.state.visible,
                    tooltipOpen: false,
                    loading: true,
                });
                setTimeout(function () {
                    self.setState({
                        loading: false,
                        success: null,
                        missingId: false,
                        allowed: true,
                        message: undefined,
                        tooltipOpen: false,
                    });
                }, 200);
            }
            else if (this.state.visible && forceOpen && !initop) {

            }
            else {
                if (this.props.onOpen) {
                    this.props.onOpen();
                }
                if (this.props.id != undefined)
                    if (this.props.id() === false) {
                        this.setState({
                            visible: true,
                            loading: false,
                            missingId: true,
                            tooltipOpen: false,
                        });
                        return;
                    }
                if (this.props.getUrl == undefined) {
                    this.setState({
                        visible: true,
                        loading: false,
                        success: null,
                        missingId: false,
                        allowed: true,
                        message: undefined,
                        tooltipOpen: false,
                    });
                }
                else if (this.props.getUrl && (this.props.multiSelect == undefined ||
                    this.props.multiSelect == false || this.props.multiSelectIds().length > 0)) {
                    this.setState({
                        visible: true,
                        success: null,
                        missingId: false,
                        loading: true,
                        allowed: true,
                        message: undefined,
                        tooltipOpen: false,
                    });
                    this.get((response) => {
                        this.setState({
                            loading: false,
                            success: null,
                            missingId: false,
                            allowed: response.allowed,
                            message: response.message,
                            tooltipOpen: false,
                        });
                        if (this.props.onGotData && response.allowed != false) {
                            const allowedObj = this.props.onGotData(response);
                            if (allowedObj && !allowedObj.allowed) {
                                this.setState({
                                    loading: false,
                                    success: null,
                                    missingId: false,
                                    allowed: false,
                                    message: allowedObj.message,
                                    tooltipOpen: false,
                                });
                            }
                        }
                    });
                }
                else {
                    this.setState({
                        visible: true,
                        loading: false,
                        missingId: true,
                        tooltipOpen: false,
                    });
                }
            }
    }


    modalClass() {
        if (this.state.success != null) {
            if (this.state.success) {
                return "modal-success ";
            } else {
                return "modal-warning ";
            }
        } else if (this.state.missingId) {
            return "modal-warning ";
        }
        else if (this.props.warning) {
            return "modal-warning ";
        }
        else if (this.props.danger) {
            return "modal-danger ";
        }
        else {
            return "modal-primary ";
        }
    }

    onSubmit(e, toggle = true, force = false) {
        if (e)
            e.preventDefault();
        this.setState({ loading: true });
        this.submit((response) => {
            this.setState({ loading: false });
            if (response.success) {
                if (toggle) {
                    if (this.props.showConfirmationMessages) {
                        this.setState({ success: true });
                        if (this.props.successMessage == undefined || this.props.successMessage == "") this.toggleModal();
                    } else {
                        this.toggleModal();
                    }
                }
                else
                    this.cleanForm();
            }
            else {
                this.setState({ success: false });
            }
        }, force);
    }

    get(callback) {
        const { getUrl, id, getDepth, onPreGet } = this.props;

        // { allowed: Boolean, [message: String] }
        if (onPreGet) {
            const allowed = onPreGet().allowed || true;
            const message = onPreGet().message || '';
            if (!allowed) {
                return this.setState({ allowed, message });
            }
        }

        apifunctions.get(getUrl, id, getDepth, {},
            response => {
                let meta = response.meta;
                let data = response.data;
                if (meta.allowed === true) {
                    data.success = true;
                    data.allowed = true;
                    if (callback) callback(data);
                } else {
                    if (callback) callback({ success: false, allowed: false, message: data.message });
                }
            },
            response => {
                let meta = response.meta;
                let errors = response.errors;
                let data = { success: false };
                if (callback) callback(data);
            },
            response => {
                let data = { success: false };
                if (callback) callback(data);
            }
        );
    }

    cleanForm() {
        this.setState({
            loading: false,
            visible: true,
            success: null,
            allowed: true,
            message: undefined,
            error: undefined,
            protected: undefined,
        });
        if (this.props.onCleanForm) this.props.onCleanForm();
    }

    processSubmit(data, successCallback, errorCallback, failCallback) {
        const { submitType, submitUrl, id } = this.props;
        switch (submitType) {
            case 'POST':
                return apifunctions.post(submitUrl, id, data, successCallback, errorCallback, failCallback);
            case 'PUT':
                return apifunctions.put(submitUrl, id, data, successCallback, errorCallback, failCallback);
            case 'PATCH':
                return apifunctions.patch(submitUrl, id, data, successCallback, errorCallback, failCallback);
            case 'DELETE':
                return apifunctions.delete(submitUrl, id, data, successCallback, errorCallback, failCallback);
        }
    }

    submit(callback, force = false) {
        var self = this;
        var submitData = {};
        const { submitUrl, submitType, onPreSubmit, onGotErrors, onSubmit, onValidation } = this.props;

        if (onValidation) if (!onValidation()) {
            let data = { success: false };
            if (callback) callback(data);
            return;
        };
        if (onPreSubmit) submitData = onPreSubmit();

        if (force) submitData['force'] = true;

        // Si fileUploader es true, hace el request como formData
        if (this.props.fileUploader) {
            submitData = jsonToFormData(submitData);
        }

        if (submitUrl != undefined) {
            this.processSubmit(submitData,
                response => {
                    let meta = response.meta;
                    let data = response.data;

                    if (data) data.success = true;
                    else data = { success: true };

                    if (meta && meta.message) self.setState({ message: meta.message });
                    if (onSubmit) onSubmit(data);
                    if (callback) callback(data);
                },
                response => {
                    let meta = response.meta;
                    let errors = response.errors;

                    let data = { success: false };
                    self.setState(prevState => {
                        if (meta) {
                            if (meta.error) prevState.error = meta.error;
                            if (meta.message) prevState.message = meta.message;
                            if (meta.protected) prevState.protected = meta.protected;
                            prevState.allowed = meta.allowed;
                        }
                        return prevState;
                    });
                    if (onGotErrors) onGotErrors(errors);
                    if (callback) callback(data);
                },
                response => {
                    let data = { success: false };
                    if (callback) callback(data);
                }
            );
        } else {
            submitData.success = true;
            self.props.onSubmit(submitData);
            if (callback) callback(submitData);
        }
    }

    NewID() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }



    Footer() {
        const { danger, warning, saveReloadButton, saveButton, saveReloadButtonLabel, saveButtonLabel, closeButton, cancelButtonLabel } = this.props;
        return (<ModalFooter>

            {saveReloadButton && <Button className={(danger && "btn-danger") ||
                (warning && "btn-warning") || (!danger && "btn-success")}
                color="visible" disabled={this.state.loading} onClick={(e) => this.onSubmit(null, false)}>{saveReloadButtonLabel}</Button>}

            {saveButton && <Button className={(danger && "btn-danger") ||
                (warning && "btn-warning") || (!danger && "btn-success")}
                color="visible" disabled={this.state.loading} onClick={(e) => this.onSubmit()}>{saveButtonLabel}</Button>}

            {' '}

            {closeButton && <Button color="secondary" disabled={this.state.loading}
                onClick={(e) => this.toggleModal()}>{cancelButtonLabel}</Button>}
        </ModalFooter>);
    }


    render() {
        let body = <ModalBody>
            {this.state.message != "" && this.state.message != null &&
                <Label className="badge badge-danger w-100">{this.state.message}</Label>}

            {this.state.error && <div className="col-12 invalid-feedback d-block pl-0 mt-0 mb-2">{this.state.error}</div>}
            {this.props.children}
        </ModalBody>;

        var saveButtonLabel = "Guardar";
        var saveReloadButtonLabel = "Guardar y Limpiar Formulario";
        var cancelButtonLabel = "Cancelar";
        if (this.props.saveButtonLabel)
            saveButtonLabel = this.props.saveButtonLabel;
        if (this.props.saveReloadButtonLabel)
            saveReloadButtonLabel = this.props.saveReloadButtonLabel;
        if (this.props.cancelButtonLabel)
            cancelButtonLabel = this.props.cancelButtonLabel;

        var buttons = <ModalFooter>

            {this.props.saveReloadButton && <Button className={(this.props.danger && "btn-danger") ||
                (this.props.warning && "btn-warning") || (!this.props.danger && "btn-success")}
                color="visible" disabled={this.state.loading} onClick={(e) => this.onSubmit(null, false)}>{saveReloadButtonLabel}</Button>}

            {this.props.saveButton && <Button className={(this.props.danger && "btn-danger") ||
                (this.props.warning && "btn-warning") || (!this.props.danger && "btn-success")}
                color="visible" disabled={this.state.loading} onClick={(e) => this.onSubmit()}>{saveButtonLabel}</Button>}

            {' '}

            {this.props.closeButton && <Button color="secondary" disabled={this.state.loading}
                onClick={(e) => this.toggleModal()}>{cancelButtonLabel}</Button>}
        </ModalFooter>;

        // Messages
        const { missingIdMessage, successMessage, notAllowedMessage, forceDelete } = this.props;
        const { message, protected: isProtected } = this.state;

        // Success Message
        const confirm = (
            <ModalBody className="text-center">
                {
                    typeof successMessage === 'function' ?
                        successMessage(message) :
                        <h3> {successMessage || message} </h3>
                }
                <h1><i className="icon-check icons font-5xl d-block mt-4"></i></h1>
            </ModalBody>
        );

        // Missing ID Message
        const missingId = (
            <ModalBody className="text-center">
                <h3>{missingIdMessage}</h3>
                <h1><i className="icon-close icons font-5xl d-block mt-4"></i></h1>
            </ModalBody>
        );

        // Not Allowed Message
        const notAllowed = (
            <ModalBody className="text-center">
                {
                    typeof notAllowedMessage === 'function' ?
                        notAllowedMessage(message) :
                        <h3> {notAllowedMessage || message} </h3>
                }
                <h1><i className="icon-ban icons font-5xl d-block mt-4"></i></h1>
                {
                    forceDelete && isProtected &&
                    <Button
                        color="danger"
                        onClick={(e) => this.onSubmit(null, true, true)}
                    >
                        Forzar eliminación
                    </Button>
                }
            </ModalBody>
        );

        var buttonContent = <i className={this.props.buttonIcon}></i>


        var buttonId = this.state.id;

        var buttonClass = "icon btn btn-sm h-100 ";
        if (this.props.buttonClass) {
            buttonClass += this.props.buttonClass;
        } else {
            buttonClass += ' btn-secondary';
        }

        let forceToggle = (this.state.missingId ? false :
            (!this.state.allowed ? false : true && !this.state.backdropToggle));

        if (this.props.navButton) {
            let nav = this.props.nav;
            var navtag = (nav.tag ? nav.tag : "li");
            return (
                <a id={buttonId.toString()} href={'#'} onClick={(e) => this.toggleModal(e, true)} className={nav.className ? nav.className : "nav-item nav-link"}>
                    <i className={nav.icon}></i>{nav.name}

                    {this.props.buttonLabel && this.props.buttonLabel}
                    <Draggable disabled={(this.props.disableddraggable) ? (this.props.disableddraggable) : (false)} handle=".modal-header">
                        <div onKeyDown={(e) => {if ((e.key=='Escape' || e.key=='Esc') && this.state.visible==true && this.props.escClose==true) {this.toggleModal()}}}>
                            <Modal keyboard={this.state.keyboard} isOpen={this.state.visible}
                                toggle={(e) => this.toggleModal(e, forceToggle)} backdrop={this.state.backdrop}
                                className={this.modalClass() + this.props.className}>
                                <ModalHeader toggle={() => this.toggleModal()}>{this.props.title}</ModalHeader>

                                {!!!this.state.success && this.state.allowed && !this.state.missingId && body}
                                {!!!this.state.success && this.state.allowed && !this.state.missingId && buttons}
                                {this.state.success && !this.state.missingId && this.props.showConfirmationMessages && confirm}
                                {!this.state.allowed && notAllowed}
                                {this.state.missingId && missingId}


                                {this.state.loading && <Loader></Loader>}
                            </Modal>
                        </div>
                    </Draggable>
                </a>);
        }
        else {
            if(this.props.initOpen && this.props.initOpen==true && this.state.loading==undefined){
                this.toggleModal(null, true, true)
            }
            return (
                <button id={buttonId.toString()} className={buttonClass} onClick={(e) => this.toggleModal(e, true)} disabled={(this.props.openButtonDisabled && this.props.openButtonDisabled==true)}>
                    {
                        this.props.buttonTitle &&
                        <Tooltip placement="bottom" target={buttonId.toString()}
                            toggle={(e) => this.setState({ tooltipOpen: !this.state.tooltipOpen })}
                            isOpen={this.state.tooltipOpen && !this.state.visible}>
                            {this.props.buttonTitle}
                        </Tooltip>
                    }
                    {buttonContent}
                    {this.props.buttonLabel && this.props.buttonLabel}
                    
                    <Draggable disabled={(this.props.disableddraggable) ? (this.props.disableddraggable) : (false)} handle=".modal-header">
                        <div onKeyDown={(e) => {if ((e.key=='Escape' || e.key=='Esc') && this.state.visible==true && this.props.escClose==true) {this.toggleModal()}}}>
                            <Modal keyboard={this.state.keyboard} isOpen={this.state.visible}
                                toggle={(e) => this.toggleModal(e, forceToggle)} backdrop={this.state.backdrop}
                                className={this.modalClass() + this.props.className}>
                                <ModalHeader toggle={() => this.toggleModal()}>{this.props.title}</ModalHeader>

                                {!!!this.state.success && this.state.allowed && !this.state.missingId && body}
                                {!!!this.state.success && this.state.allowed && !this.state.missingId && buttons}
                                {this.state.success && !this.state.missingId && this.props.showConfirmationMessages && confirm}
                                {!this.state.allowed && notAllowed}
                                {this.state.missingId && missingId}


                                {this.state.loading && <Loader></Loader>}
                            </Modal>
                        </div>
                    </Draggable>
                </button>
            );
        }
    }
}

export default ParadigmaModal;

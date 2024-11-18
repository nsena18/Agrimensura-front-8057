import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ParadigmaModal from "../../../components/ParadigmaModal/ParadigmaModal.js"
import api from "../../../api";

import { Row, Col, Label, Input, InputGroup, FormFeedback } from 'reactstrap';

import PermisosListSelect from "../Permisos/PermisosListSelect.js"
import ParadigmaAsyncSeeker from "../../../components/ParadigmaAsyncSeeker/ParadigmaAsyncSeeker.js"
import ParadigmaLabeledInput from "../../../components/ParadigmaLabeledInput/ParadigmaLabeledInput.js"

class Modal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            nombre: "",
            permisos_checked: [],
            permisos_disabled: [],
            postVariables: ['nombre'],
            errors: [],
        };
    }

    static propTypes = {
        onSubmit: PropTypes.func,
        id: PropTypes.func,
        action: PropTypes.oneOf(['CREATE', 'EDIT', 'DETAIL', 'DELETE']).isRequired,
    }

    groupLoaded(value) {
        if (value && value.permisos_id != this.state.permisos_disabled) {
            this.setState({
                permisos_disabled: value.permisos_id
            })
        }
    }

    groupChanged(value) {
        if (value) {
            this.setState({
                permisos_disabled: value.permisos_id,
                permisos_checked: [],
            });
        } else {
            this.setState({
                permisos_disabled: [],
                permisos_checked: [],
            });
        }
    }

    resetForm() {
        this.setState({
            id: null,
            nombre: "",
            permisos_checked: [],
            permisos_disabled: [],
            errors: [],
        });
    }

    getData() {
        const { postVariables, permisos_checked, permisos_disabled } = this.state;
        let data = {};
        postVariables.forEach(x => {
            data[x] = this.state[x];
        });
        let permisos = permisos_checked.map(x => parseInt(x));
        if (permisos_disabled)
            permisos = permisos.filter(x => permisos_disabled.filter(y => y === x).length == 0);
        data['permisos_id'] = permisos;
        return data;
    }

    setData(data) {
        if (data.success) {
            this.setState({
                id: data.id,
                nombre: data.nombre,
                descripcion: data.descripcion,

                permisos_checked: data.permisos_id,
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
                title: "Nuevo Grupo",
                buttonTitle: "Nuevo",
                danger: false,
                buttonIcon: "fa fa-plus fa-lg",
                successMessage: "El Grupo ha sido creado con éxito.",
                saveButton: true,
                saveButtonLabel: "Guardar",
                buttonClass: "",
                disabled: false,
            };
        } else if (action == "EDIT") {
            return {
                get: true,
                submitType: "PUT",
                title: "Editar Grupo",
                buttonTitle: "Editar",
                danger: false,
                buttonIcon: "fa fa-pencil fa-lg",
                successMessage: "El Grupo ha sido editado con éxito.",
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
                title: "Grupo",
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
                title: "Eliminar Grupo",
                buttonTitle: "Eliminar",
                danger: true,
                buttonIcon: "fa fa-trash fa-lg",
                successMessage: "El Grupo ha sido eliminado con éxito.",
                saveButton: true,
                saveButtonLabel: "Eliminar",
                buttonClass: "btn-danger",
                disabled: true,
                id: this.props.id,
            };
        }
    }

    render() {
        let vars = this.modalVars();
        return (
            <ParadigmaModal
                getUrl={(vars.get ? api.usuarios.grupos : null)}
                submitUrl={(vars.submitType ? api.usuarios.grupos : null)}
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
            >
                <ParadigmaLabeledInput
                    disabled={vars.disabled}
                    md={[2, 10]}
                    label={"Nombre"}
                    value={this.state.nombre}
                    onChange={(e) => this.onChangeField('nombre', e.target.value)}
                    error={() => this.getError('nombre')}
                />

                <Row className="mt-4">
                    <Col className="col-12">
                        <Label>Permisos</Label>
                        <PermisosListSelect
                            disabled={vars.disabled}
                            onChange={(value) => this.setState({ permisos_checked: value })}
                            checked={this.state.permisos_checked}
                            disabledNodes={this.state.permisos_disabled}
                        />
                    </Col>
                </Row>
            </ParadigmaModal>
        );
    }
}

export default Modal;

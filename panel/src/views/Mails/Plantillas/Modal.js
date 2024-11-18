import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ParadigmaModal from "../../../components/ParadigmaModal/ParadigmaModal.js"
import api from "../../../api";

import { Row, Col, Label, Input, InputGroup, FormFeedback } from 'reactstrap';

import ParadigmaLabeledInput from "../../../components/ParadigmaLabeledInput/ParadigmaLabeledInput.js"
import ParadigmaEditor from "../../../components/ParadigmaEditor/ParadigmaEditor.js"

class Modal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            descripcion: "",
            cuerpo: "",
            asunto: "",
            postVariables: ['descripcion', 'cuerpo', 'asunto'],
            errors: [],
            variablesCuerpo: [
                                {
                                    nombre : 'Número de Pedido',
                                    valor : '{{numero}}',
                                },
                                {
                                    nombre : 'Fecha Pedido',
                                    valor : '{{fecha_pedido}}',
                                },
                                {
                                    nombre : 'Detalle de Pedido',
                                    valor : '{{detalle_pedido}}',
                                },
                                {
                                    nombre : 'Fecha Capturado',
                                    valor : '{{fecha_capturado}}',
                                },
                                {
                                    nombre : 'Email Cliente',
                                    valor : '{{#codigo_cliente}}{{#user}}{{email}}{{/user}}{{/codigo_cliente}}',
                                },
                                {
                                    nombre : 'Nombre Cliente',
                                    valor : '{{#codigo_cliente}}{{nombre}}{{/codigo_cliente}}',
                                },
                                {
                                    nombre : 'Codigo Postal',
                                    valor : '{{#codigo_cliente}}{{codigo_postal}}{{/codigo_cliente}}',
                                },
                                {
                                    nombre : 'Localidad',
                                    valor : '{{#codigo_cliente}}{{localidad}}{{/codigo_cliente}}',
                                },
                                {
                                    nombre : 'Cuit',
                                    valor : '{{#codigo_cliente}}{{cuit}}{{/codigo_cliente}}',
                                },
                                {
                                    nombre : 'Estado',
                                    valor : '{{estado}}',
                                },
                                {
                                    nombre : 'Entrega Prevista',
                                    valor : '{{entrega_prevista}}',
                                },
                            ]
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
            descripcion: "",
            cuerpo: "",
            asunto: "",
            errors: [],
        });
    }

    getData() {
        const { postVariables } = this.state;
        let data = {};
        postVariables.forEach(x => {
            data[x] = this.state[x];
        });

        return data;
    }

    setData(data) {
        if (data.success) {
            this.setState({
                id: data.id,
                descripcion: data.descripcion,
                cuerpo: data.cuerpo,
                asunto: data.asunto,
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
                title: "Nueva Plantilla",
                buttonTitle: "Nuevo",
                danger: false,
                buttonIcon: "fa fa-plus fa-lg",
                successMessage: "La Plantilla ha sido creado con éxito.",
                saveButton: true,
                saveButtonLabel: "Guardar",
                buttonClass: "",
                disabled: false,
            };
        } else if (action == "EDIT") {
            return {
                get: true,
                submitType: "PUT",
                title: "Editar Plantilla",
                buttonTitle: "Editar",
                danger: false,
                buttonIcon: "fa fa-pencil fa-lg",
                successMessage: "La Plantilla ha sido editado con éxito.",
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
                title: "Plantilla",
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
                title: "Eliminar Plantilla",
                buttonTitle: "Eliminar",
                danger: true,
                buttonIcon: "fa fa-trash fa-lg",
                successMessage: "La Plantilla ha sido eliminado con éxito.",
                saveButton: true,
                saveButtonLabel: "Eliminar",
                buttonClass: "",
                disabled: true,
                id: this.props.id,
            };
        }
    }

    onCuerpoChange = html => this.setState({ cuerpo: html });

    //Agrega las variables seleccionadas en el multiselect
    agregarVariables(i){
        var variablesCuerpo = this.state.variablesCuerpo;
        let cuerpo=this.state.cuerpo;
        let nuevoCuerpo = '';
        let ultimosCaracteres = cuerpo.substr((cuerpo.length-11))
        if (ultimosCaracteres == '<p><br></p>'){
            nuevoCuerpo = cuerpo.substr(0, (cuerpo.length-8)) + variablesCuerpo[i].valor + '</p>';
        }else{
            nuevoCuerpo = cuerpo.substr(0, (cuerpo.length-4)) + variablesCuerpo[i].valor + '</p>';
        }
        this.setState({
            cuerpo: nuevoCuerpo,
        })

    }

    render() {
        let vars = this.modalVars();
        let varablesCuerpo = this.state.variablesCuerpo;
        return (
            <ParadigmaModal
                getUrl={(vars.get ? api.mails.plantillas : null)}
                submitUrl={(vars.submitType ? api.mails.plantillas : null)}
                submitType={vars.submitType}
                id={vars.id}
                onGotData={(data) => this.setData(data)}
                onGotErrors={(errors) => this.setErrors(errors)}
                onSubmit={(e) => this.props.onSubmit(e)}
                onClose={() => this.resetForm()}
                onPreSubmit={() => this.getData()}

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
                className="modal-lg"

                escClose={true}
            >
                <ParadigmaLabeledInput
                    disabled={vars.disabled}
                    md={[2, 6]}
                    maxLength={255}
                    label={"Descripción"}
                    value={this.state.descripcion}
                    onChange={(e) => this.onChangeField('descripcion', e.target.value)}
                    error={() => this.getError('descripcion')}
                />
                <ParadigmaLabeledInput
                    disabled={vars.disabled}
                    md={[2, 6]}
                    maxLength={100}
                    label={"Asunto"}
                    value={this.state.asunto}
                    onChange={(e) => this.onChangeField('asunto', e.target.value)}
                    error={() => this.getError('asunto')}
                />

                <Row className="my-1 mx-0">
                    <Col className="px-0 col-12 col-md-8">
                    <Label>Cuerpo</Label>
                        <ParadigmaEditor
                            disabled={vars.disabled}
                            value={this.state.cuerpo}
                            onChange={this.onCuerpoChange}
                        />
                    </Col>

                    {/*<Col className="col-12 col-md-4">
                        <Label for="multiSelectVariables">Variables</Label>
                        <Input type="select" style={{height: '267px', maxWidth: '250px',}} id="multiSelectVariables" value='' multiple>
                            <option onClick={() => this.agregarVariables(0)}>{varablesCuerpo[0].nombre}</option>
                            <option onClick={() => this.agregarVariables(1)}>{varablesCuerpo[1].nombre}</option>
                            <option onClick={() => this.agregarVariables(2)}>{varablesCuerpo[2].nombre}</option>
                            <option onClick={() => this.agregarVariables(3)}>{varablesCuerpo[3].nombre}</option>
                            <option onClick={() => this.agregarVariables(4)}>{varablesCuerpo[4].nombre}</option>
                            <option onClick={() => this.agregarVariables(5)}>{varablesCuerpo[5].nombre}</option>
                            <option onClick={() => this.agregarVariables(6)}>{varablesCuerpo[6].nombre}</option>
                            <option onClick={() => this.agregarVariables(7)}>{varablesCuerpo[7].nombre}</option>
                            <option onClick={() => this.agregarVariables(8)}>{varablesCuerpo[8].nombre}</option>
                        </Input>
                    </Col>*/}
                </Row>
            </ParadigmaModal>
        );
    }
}

export default Modal;

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import InputMask from 'react-input-mask';

import api from "../../../api";
import apiFunctions from "../../../api/functions.js"

import { formatCurrency } from '../../../functions/functions';

import { Row, Col, Label, Input, InputGroup, FormFeedback, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import moment from 'moment';

import ParadigmaModal from "../../../components/ParadigmaModal/ParadigmaModal.js"
import ParadigmaLabeledInput from "../../../components/ParadigmaLabeledInput/ParadigmaLabeledInput.js"

class ModalDiasEstimados extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,

            diasEstimadosEncomienda: [],
            
            postVariables: [],

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

            diasEstimadosEncomienda: [],
        });
    }

    getData() {
        const { postVariables, diasEstimadosEncomienda } = this.state;
        let data = {};
        postVariables.forEach(x => {
            data[x] = this.state[x];
        });
        data['diasEstimadosEncomienda'] = diasEstimadosEncomienda;

        return data;
    }

    setData(data) {
        const { action, ar_estados } = this.props;
        
        if(data.estado>7){
            return {
                allowed: false,
                message: 'La encomienda ya fue '+((data.estado==7) ? ('Finalizada') : ('Desestimada')),
            }
        }

        if (data.success) {
                    
            let diasAux = [];

            if(data.diasEstimadosEncomienda && data.diasEstimadosEncomienda.length>0){
                ar_estados.forEach(e => {
                    let dee = data.diasEstimadosEncomienda.filter(x => (x.estado==e.id))
                    if(e.id!=7 && e.id!=8){
                        diasAux.push({
                            encomienda_id: data.id,
                            estado: e.id,
                            estado_nombre: e.nombre,
                            // diasEstimados: e.diasEstimados,
                            // habilitado: true,
                            diasEstimados: dee.length>0 ? dee[0].diasEstimados : e.diasEstimados,
                            habilitado: dee.length>0 ? dee[0].habilitado : true,
                        })
                    }
                })
            }else{
                ar_estados.forEach(e => {
                    if(e.id!=7 && e.id!=8){
                        diasAux.push({
                            encomienda_id: data.id,
                            estado: e.id,
                            estado_nombre: e.nombre,
                            diasEstimados: e.diasEstimados,
                            habilitado: true,
                        })
                    }
                })
            }

            this.setState({
                id: data.id,
                diasEstimadosEncomienda: diasAux.sort((a,b) => {return (a.estado>b.estado) ? (1) : ((b.estado>a.estado) ? (-1) : (0))}),
            });
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
        if (action == "EDIT") {
            return {
                get: true,
                submitType: "PUT",
                title: "Editar Días Estimados",
                buttonTitle: "Días Estimados",
                danger: false,
                buttonIcon: "fa fa-clock-o fa-lg",
                successMessage: ".",
                saveButton: true,
                saveButtonLabel: "Guardar",
                buttonClass: "",
                disabled: false,
                id: this.props.id,
            };
        }
    }

    onValidation = () => {
        const { cantidadUnidades, superficieInmuebles } = this.state;
        let error = {};
        let validate = true;

        this.setState({
            errors: error,
        })
        return validate;
    }

    render() {
        let vars = this.modalVars();
        const { action, ar_estados } = this.props;
        const { diasEstimadosEncomienda } = this.state;
        
        return (
            <ParadigmaModal
                getUrl={(vars.get ? api.expedientes.encomiendaprofesional : null)}
                submitUrl={(vars.submitType ? api.expedientes.encomiendaAsignarDias : null)}
                submitType={vars.submitType}
                id={vars.id}

                onGotData={(data) => this.setData(data)}
                onGotErrors={(errors) => this.setErrors(errors)}
                onSubmit={(e) => this.props.onSubmit(e)}
                onClose={() => this.resetForm()}
                onPreSubmit={() => this.getData()}
                onValidation={() => this.onValidation()}

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

                // className={'modal-lg'}
                escClose={true}
            >

                <Fragment>
                    <Row>
                        <Col className={'col-6 text-center'}>
                            <Label>{'Estado'}</Label>
                        </Col>
                        <Col className={'col-3 text-center'}>
                            <Label>{'Días Estimados'}</Label>
                        </Col>
                        <Col className={'col-3 text-center'}>
                            <Label>{'Habilitado'}</Label>
                        </Col>
                    </Row>
                    <hr className={'my-1'}/>
                    {diasEstimadosEncomienda.map((d, i) => 
                        <Row>
                            <Col className={'col-12'}>
                                <ParadigmaLabeledInput
                                    disabled={vars.disabled}
                                    md={[6, 6]}
                                    label={d.estado+' - '+d.estado_nombre}
                                    error={() => this.getError('diasEstimados')}
                                    classNames={['lbl_diasestimados', '']}
                                    inputComponent= {
                                        <Row>
                                            <Col className={'col-7'}>
                                                <Input 
                                                    type={"number"}
                                                    maxLength={4}
                                                    value={d.diasEstimados}
                                                    onChange={(e) => {let dAux = diasEstimadosEncomienda; 
                                                                        dAux[i].diasEstimados = e.target.value; 
                                                                        this.onChangeField('diasEstimadosEncomienda', dAux)}}
                                                    onFocus={(event) => event.target.select()}
                                                />
                                            </Col>
                                            <Col className={'col-5'} onClick={() => {let dAux = diasEstimadosEncomienda; 
                                                                                    dAux[i].habilitado = !dAux[i].habilitado; 
                                                                                    this.onChangeField('diasEstimadosEncomienda', dAux)}}>
                                                <input type="checkbox" className="filled-in" checked={d.habilitado} onChange={(e) => {}}/>
                                            </Col>
                                        </Row>
                                    }
                                />
                            </Col>
                        </Row>
                    )}
                </Fragment>

            </ParadigmaModal>
        );
    }
}

export default ModalDiasEstimados;

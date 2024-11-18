import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import api from "../../../api";
import apiFunctions from "../../../api/functions.js"

import { Row, Col, Label, Input, InputGroup, FormFeedback, Alert } from 'reactstrap';
import moment from 'moment';
import { formatCurrency } from '../../../functions/functions';

import ParadigmaModal from "../../../components/ParadigmaModal/ParadigmaModal.js"
import ParadigmaTable from "../../../components/ParadigmaTable/ParadigmaTable.js"

import ParadigmaAsyncSeeker from "../../../components/ParadigmaAsyncSeeker/ParadigmaAsyncSeeker.js"
import ParadigmaLabeledInput from "../../../components/ParadigmaLabeledInput/ParadigmaLabeledInput.js"
import ParadigmaCurrencyInput from "../../../components/ParadigmaCurrencyInput/ParadigmaCurrencyInput.js"

import ModalEncomienda from '../../Expedientes/EncomiendaProfesional/Modal'
import ModalComitentes from '../../Comitentes/Modal'
import Modal from '../CuentasCorrientes/Modal'
import { createPortal } from 'react-dom';

class ModalCuentaCorriente extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comitente_id: null,
            postVariables: [],
            errors: [],
            columns: [
                {
                    Header: "id",
                    id: "id",
                    accessor: "id",
                    width: 100,
                    show: false,
                    private: true,
                },
                {
                    Header: "Fecha",
                    id: "fecha",
                    // accessor: d => d.fecha,
                    accessor: d => (d.fecha) ? (moment(d.fecha).format('DD-MM-YYYY')) : (''),
                    width: 120,
                    show: true,
                    filterable: false,
                },
                {
                    Header: "Detalle",
                    id: "detalle",
                    accessor: "detalle",
                    show: true,
                    filterable: false,
                },
                {
                    Header: "Egreso",
                    id: "egreso",
                    accessor: d => formatCurrency(d.egreso),
                    className: "text-right",
                    show: true,
                    filterable: false,
                },
                {
                    Header: "Ingreso",
                    id: "ingreso",
                    accessor: d => formatCurrency(d.ingreso),
                    className: "text-right",
                    show: true,
                    filterable: false,
                },
                {
                    Header: "Saldo",
                    id: "subtotal",
                    accessor: d => formatCurrency(d.subtotal),
                    className: "text-right",
                    show: true,
                    filterable: false,
                },
            ],
            sinaplicar: '0,00',
        };
    }

    static propTypes = {
        onSubmit: PropTypes.func,
        id: PropTypes.func,
        action: PropTypes.oneOf(['CREATE', 'EDIT', 'DETAIL', 'DELETE']).isRequired,
    }


    resetForm() {
        this.setState({
            comitente_id: null,
            sinaplicar: '0,00',
        });
    }

    getData() {
        const { action } = this.props;
        const { postVariables, fecha, importe, aplicacionesEncomienda } = this.state;
        let data = {};
        postVariables.forEach(x => {
            data[x] = this.state[x];
        });
        data.fecha = fecha.format('YYYY-MM-DDThh:mm');
        data.importe = parseFloat(importe.replace(',', '.'));

        if(aplicacionesEncomienda.filter(e => e.isChecked==true).length>0){
            data['aplicacionesEncomienda'] = aplicacionesEncomienda.filter(e => e.isChecked==true).map(d => {return {
                                                                                                                    encomiendaProfesional_id: d.encomiendaProfesional.id,
                                                                                                                    importe: parseFloat(d.importe.replace(',', '.'))
                                                                                                                    }})
        }

        return data;
    }

    setData(data) {
        // let row = this.props.row();
        // // Si la encomienda tiene un movimiento de deuda cargado se recuperan los datos sino asigna los datos por defecto de la encomienda seleccionada
        // if (data.success && data.data!=false) {
        //     this.setState({
        //         id: data.id,
        //         fecha: moment(data.fecha),
        //         comitente_id: data.comitente ? data.comitente.id : null,
        //         encomiendaProfesional_id: data.encomiendaProfesional ? data.encomiendaProfesional.id : null,
        //         detalle: data.detalle,
        //         importe: formatCurrency(data.importe.toString().replace('.',',')),
        //         tipo: data.tipo,
        //     });
        // } else {
        //     this.setState({
        //         comitente_id: row.id,
        //         tipo: 0,
        //     });
        // }
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
        if (action == "DETAIL") {
            return {
                get: false,
                // submitType: "PUT",
                title: "Cuenta Corriente",
                buttonTitle: "Cta. Cte.",
                danger: false,
                buttonIcon: "fa fa-cc fa-lg",
                successMessage: "ha sido editado con éxito.",
                saveButton: false,
                saveButtonLabel: "Guardar",
                buttonClass: "",
                disabled: true,
                cancelButtonLabel: 'Volver',
                // id: this.props.id,
            };
        }
    }

    onOpen = () => {
        if(this.props.id()!=false){
            this.setState({
                comitente_id: this.props.id(),
            })
            this.traerCobroAplicacion(this.props.id());
        }else{
            this.setState({
                sinaplicar: '0,00',
            });
        }
    }

    traerCobroAplicacion = (id) => {
        if(id!=null){
            apiFunctions.get(api.cuentasCorrientes.totalAplicacionesEIngresos, id, null, null, (response) => {
                this.setState({
                    sinaplicar: formatCurrency(response.data.saldoRestante),
                });
            }, (response) => {
                this.setState({
                    sinaplicar: '0,00',
                });
            });
        }
    }

    render() {
        let vars = this.modalVars();
        const { action, asUsuarios } = this.props;
        const { comitente_id, sinaplicar } = this.state;
        const outerSort = [
            {
              id: 'fecha',
              desc: true
            },
        ];

        const outerFilter = [
            {
                id: 'comitente_id',
                value: {
                    lookup: 'exact',
                    input: comitente_id!=null ? comitente_id : 999,
                }
            }
        ]

        return (
            <ParadigmaModal
                getUrl={(vars.get ? api.cuentasCorrientes.cobroAplicacion : null)}
                submitUrl={(vars.submitType ? api.cuentasCorrientes.cobroAplicacion : null)}
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

                className={'modal-lg'}
            >
                <Row>
                    <Col className={'col-8'}>
                        <ParadigmaLabeledInput
                            label="Comitente"
                            md={[2, 8]}
                            inputComponent={
                                <ParadigmaAsyncSeeker
                                    clearable={false}
                                    disabled={false}
                                    url={api.comitentes.comitentes}
                                    value={comitente_id}
                                    displayField={'apellido_nombre'}
                                    parameters={{
                                        paginationEnabled:false,
                                        sort:['apellido_nombre']
                                    }}
                                    onChange={e => {this.onChangeField('comitente_id', (e) ? (e.id) : (null)); this.traerCobroAplicacion((e) ? (e.id) : (null))}}
                                    CreateComponent={props => <ModalComitentes id={() => {return (comitente_id) ? (comitente_id) : (false)}} 
                                                                                action={"DETAIL"}/>}
                                />
                            }
                        />
                    </Col>
                    <Col className={'col-12 t_ctacte'} style={comitente_id==null ? { filter: 'blur(2px)', pointerEvents: 'none' } : {}}>
                        <ParadigmaTable
                            buttons={[
                                {
                                    create: true,
                                    component: (props) => <Modal {...props} action="CREATE" onSubmit={(e) => {this.traerCobroAplicacion(comitente_id); props.onSubmit(e)}} ar_estados={this.props.ar_estados} comitente_id={comitente_id}/>,
                                    permission: 'cuentascorrientes_new',
                                },
                                /*{
                                    edit: true,
                                    component: (props) => <Modal {...props} action="EDIT" ar_estados={this.props.ar_estados}/>,
                                    permission: 'cuentascorrientes_edit',
                                },*/
                                {
                                    edit: true,
                                    component: (props) => <Modal {...props} action="DETAIL" ar_estados={this.props.ar_estados}/>,
                                    permission: 'cuentascorrientes_detail',
                                },
                                // {
                                //     edit: true,
                                //     component: (props) => <Modal {...props} action="DELETE" ar_estados={this.props.ar_estados}/>,
                                //     permission: 'cuentascorrientes_delete',
                                // },
                            ]}
                            apiUrl={api.cuentasCorrientes.movimientos}
                            columns={this.state.columns}
                            exportUrl={api.cuentasCorrientes.movimientos}
                            title={"Movimientos"}
                            outerSort={outerSort}
                            outerFilter={outerFilter}
                            defaultPageSize={10}
                        />
                    </Col>

                    <Col className={'col-7 mt-4'}>
                        <ParadigmaLabeledInput
                            md={[4, 8]}
                            label={"Ingresos sin aplicar"}
                            error={() => this.getError('sinaplicar')}
                            inputComponent={
                                <ParadigmaCurrencyInput 
                                    type="text"
                                    disabled={vars.disabled}
                                    value={sinaplicar}
                                    onChange={(data) => this.onChangeField('sinaplicar', data)}
                                    className={'monto'}
                                    dobleSimboloDecimal={true}
                                    selectOnFocus={true}
                                    onBlurComplete={true}
                                    maskOptions={{prefix: '$ '}}
                                />}
                        />
                    </Col>
                </Row>
            </ParadigmaModal>
        );
    }
}

export default ModalCuentaCorriente;

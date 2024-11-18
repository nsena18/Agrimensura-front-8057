import React, { Component, Fragment } from 'react';
import { Row, Col, Table, FormGroup, Label, Input } from 'reactstrap';

import api from '../../../api/api';
import { formatCurrency } from '../../../functions/functions';

import ParadigmaModal from '../../../components/ParadigmaModal/ParadigmaModal';
import ParadigmaLabeledInput from '../../../components/ParadigmaLabeledInput/ParadigmaLabeledInput';
import ParadigmaCurrencyInput from '../../../components/ParadigmaCurrencyInput/ParadigmaCurrencyInput';

import moment from 'moment'

class ModalResumenDeuda extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            aplicaciones: [],
            estadoDeuda: null,
            nroOrden: '',
        }
    }

    resetForm = () => {
        this.setState({
            id: null,
            aplicaciones: [],
            estadoDeuda: null,
            nroOrden: '',
        })
    }

    setSelects = data => {
        this.setState({
            aplicaciones: (data.aplicaciones_encomienda && data.aplicaciones_encomienda.length>0) ? (data.aplicaciones_encomienda) : ([]),
            estadoDeuda: (data.cuentacorriente_encomienda && data.cuentacorriente_encomienda.length>0) ? (data.cuentacorriente_encomienda[0]) : (null),
        });
    }

    setData(data) {
        const { action } = this.props;
        
        if (data.success) {
            this.setState({
                aplicaciones: (data.aplicaciones_encomienda && data.aplicaciones_encomienda.length>0) ? (data.aplicaciones_encomienda) : ([]),
                estadoDeuda: (data.cuentacorriente_encomienda && data.cuentacorriente_encomienda.length>0) ? (data.cuentacorriente_encomienda[0]) : (null),
            });
        }
    }

    modalVars() {
        const { action } = this.props;
        if (action == "DETAIL") {
            return {
                get: true,
                submitType: null,
                title: "Resumen Estado de Deuda",
                buttonTitle: "Resumen",
                danger: false,
                buttonIcon: "fa fa-usd fa-lg",
                successMessage: "",
                cancelButtonLabel:"Cerrar",
                saveButton: false,
                buttonClass: "",
                disabled: true,
                id: this.props.id,
                cancelButtonLabel: 'Volver',
            };
        }
    }

    render() {
        let vars = this.modalVars();
        const { aplicaciones, estadoDeuda, nroOrden } = this.state;
        const redImpAplicado = (accumulator, currentValue) => accumulator + currentValue.importe;

        return (
            <ParadigmaModal
                getUrl={(vars.get ? api.expedientes.encomiendaprofesional : null)}
                submitUrl={(vars.submitType ? api.expedientes.encomiendaprofesional : null)}
                submitType={vars.submitType}
                id={vars.id}

                onGotData={(data) => this.setData(data)}
                // onGotErrors={(errors) => this.setErrors(errors)}
                onSubmit={(e) => this.props.onSubmit(e)}
                onClose={() => this.resetForm()}
                // onPreSubmit={() => this.getData()}

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

                className={'modal-lg'}
                escClose={true}
            >
                {estadoDeuda!=null ?
                <Fragment>
                    <Table striped responsive>
                        <thead>
                            <tr>
                                <th>Resumen</th>
                                <th>Egresos</th>
                                <th>Ingresos</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{'Encomienda N°'+nroOrden}</td>
                                <td className="text-right">{'$ '+formatCurrency(estadoDeuda.importe)}</td>
                                <td></td>
                            </tr>
                            {aplicaciones.map((data,i) =>
                                <tr key={i}>
                                    <td>{'Aplicación '+(data.fecha && moment(data.fecha).format('DD/MM/YYYY'))}</td>
                                    <td></td>
                                    <td className="text-right">{'$ '+formatCurrency(data.importe)}</td>
                                </tr>
                            )}
                            <tr className={'t_total_resumen'}>
                                <td>Total</td>
                                <td className="monto">{'$ '+formatCurrency(estadoDeuda.importe)}</td>
                                <td className="monto">{'$ '+formatCurrency(aplicaciones.reduce(redImpAplicado, 0))}</td>
                            </tr>
                        </tbody>
                    </Table>
                                
                    <Row>
                        <Col className="col-lg-5 offset-lg-7">
                            <ParadigmaLabeledInput
                                label="Deuda Restante"
                                classNames={['lbl_total_resumen pr-0', '']}
                                md={[5, 7]}
                                inputComponent={
                                    <ParadigmaCurrencyInput 
                                        type="text"
                                        disabled={true}
                                        value={formatCurrency(estadoDeuda.importe-aplicaciones.reduce(redImpAplicado, 0))}
                                        onChange={() => null}
                                        className={'montoDisabled'}
                                        dobleSimboloDecimal={true}
                                        maskOptions={{prefix: '$ '}}
                                    />
                                }
                            />
                        </Col>
                    </Row>
                </Fragment>
                :
                <Col classNames={'col-12'}>
                    <h3 className={'text-center'}>{'La encomienda '+nroOrden+' no posee estado de deuda'}</h3>
                </Col>}

            </ParadigmaModal>
        );
    }
}

export default ModalResumenDeuda;
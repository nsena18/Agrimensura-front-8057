import React, { Component } from 'react';
import axios from "axios";

import api from '../../../api/api';
import apiFunctions from "../../../api/functions.js"
import { formatCurrency } from '../../../functions/functions';

import Modal from "./Modal"

import ParadigmaTable from "../../../components/ParadigmaTable/ParadigmaTable";

import NumericFilter from '../../../components/ParadigmaTable/NumericFilter';
import DateFilter from "../../../components/ParadigmaTable/DateFilter";
import ParadigmaDatePicker from '../../../components/ParadigmaDatePicker/ParadigmaDatePicker';
import ParadigmaAsyncSeeker from '../../../components/ParadigmaAsyncSeeker/ParadigmaAsyncSeeker';
import moment from 'moment';

class CuentasCorrientes extends Component {
    constructor() {
        super();
        this.state = {
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
                    Filter: ({ filter, onChange }) => <div className={"date-filter has-value"}>
                                                        <ParadigmaDatePicker
                                                                dateFormat="DD/MM/YYYY"
                                                                value={filter ? moment(filter.value).format('DD/MM/YYYY') : ''}
                                                                onChange={date => {
                                                                    onChange((moment(date).isValid()) ? (moment(date).format('YYYY-MM-DD')) : (''))}}
                                                            />
                                                        <div className="date-filter__buttons">
                                                            <button
                                                                className="date-filter__button date-filter__button-close"
                                                                onClick={(e) => {onChange('')}}
                                                            >
                                                                <i className={'fa fa-times'}></i>
                                                            </button>
                                                        </div>
                                                    </div>
                },
                {
                    Header: "Detalle",
                    id: "detalle",
                    accessor: "detalle",
                    show: true,
                },
                {
                    Header: "encomiendaProfesional",
                    id: "encomiendaProfesional",
                    accessor: (d) => d.encomiendaProfesional ? d.encomiendaProfesional.nroOrden : (''),
                    show: false,
                    private: true,
                },
                {
                    Header: "Encomienda",
                    id: "encomiendaProfesional_id",
                    lookup: "exact",
                    accessor: d => (d.encomiendaProfesional) ? (d.encomiendaProfesional.nroOrden) : (''),
                    show: true,
                    Filter: ({ filter, onChange }) =>
                        <ParadigmaAsyncSeeker
                            url={api.expedientes.encomiendaprofesionalSelect}
                            value={filter ? filter.value : ""}
                            onChange={data => (data) ? (onChange(data.id)): ((filter) ? onChange('') : null)}
                            displayField={"nroOrden"}
                            parameters={{
                                paginationEnabled:false,
                                sort:['fechaIngreso'],
                            }}
                        />
                },
                {
                    Header: "comitente",
                    id: "comitente",
                    accessor: (d) => d.comitente ? d.comitente.nombre : (''),
                    show: false,
                    private: true,
                },
                {
                    Header: "Comitente",
                    id: "comitente_id",
                    lookup: "exact",
                    accessor: d => (d.comitente) ? (d.comitente.apellido+' '+d.comitente.nombre) : (''),
                    show: true,
                    Filter: ({ filter, onChange }) =>
                        <ParadigmaAsyncSeeker
                            url={api.comitentes.comitentes}
                            value={filter ? filter.value : ""}
                            onChange={data => (data) ? (onChange(data.id)): ((filter) ? onChange('') : null)}
                            displayField={"apellido_nombre"}
                            parameters={{
                                paginationEnabled:false,
                                sort:['apellido_nombre'],
                            }}
                        />
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
                // {
                //     Header: "Tipo",
                //     id: "tipo",
                //     accessor: d => d.tipo==0 ? 'Ingresos' : 'Egresos',
                //     show: true,
                //     Filter: ({ filter, onChange }) =>
                //         <ParadigmaAsyncSeeker
                //             url={undefined}
                //             clearable={true}
                //             optionDefault={[{nombre: 'Ingresos', id: '0'}, {nombre: 'Egresos', id: '1'}]}
                //             value={filter ? filter.value : ''}
                //             onChange={data => (data) ? (onChange(data.id)): (onChange(''))}
                //         />
                // },
                // {
                //     Header: "Importe",
                //     id: "importe",
                //     accessor: d => formatCurrency(d.importe),
                //     className: "text-right",
                //     show: true,
                // },
            ],
            ar_estados: [],
        };
    }

    componentWillMount = () =>{
        apiFunctions.get(api.expedientes.estadosencomiendaSelect, null, null, {sort:['numero']}, (response) => {
                                                        this.setState({
                                                            ar_estados: response.data.map((d) => { return {id: d.numero.toString(), nombre: d.nombre, background: d.background, color: d.texto, diasEstimados: d.diasEstimados} })
                                                        })
                                                    });
    }

    render() {
        const { ar_estados } = this.state;
        const outerSort = [
          {
            id: 'fecha',
            desc: true
          },
        ];
       
        return (
            <ParadigmaTable
                buttons={[
                    {
                        create: true,
                        component: (props) => <Modal {...props} action="CREATE" ar_estados={ar_estados}/>,
                        permission: 'cuentascorrientes_new',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="EDIT" ar_estados={ar_estados}/>,
                        permission: 'cuentascorrientes_edit',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="DETAIL" ar_estados={ar_estados}/>,
                        permission: 'cuentascorrientes_detail',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="DELETE" ar_estados={ar_estados}/>,
                        permission: 'cuentascorrientes_delete',
                    },
                ]}
                apiUrl={api.cuentasCorrientes.movimientos}
                columns={this.state.columns}
                exportUrl={api.cuentasCorrientes.movimientos}
                title={"Movimientos Cta Cte"}
                outerSort={outerSort}
            />
        );
    }
}

export default CuentasCorrientes;

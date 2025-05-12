import React, { Component } from 'react';
import axios from "axios";

import api from '../../../api/api';
import apiFunctions from "../../../api/functions.js"
import { formatCurrency } from '../../../functions/functions';

import Modal from "./Modal"
/* import ModalDiasEstimados from "./ModalDiasEstimados"
import CambioEstado from "./CambioEstado"
import ModalResumenDeuda from "./ModalResumenDeuda"

import ModalEvento from '../../Calendar/Modal' */
import CambioEstado from "./CambioEstado"

import ParadigmaTable from "../../../components/ParadigmaTable/ParadigmaTable";
import ParadigmaDatePicker from '../../../components/ParadigmaDatePicker/ParadigmaDatePicker';
import ParadigmaAsyncSeeker from '../../../components/ParadigmaAsyncSeeker/ParadigmaAsyncSeeker';
import moment from 'moment';

class TableVisaciones extends Component {
    constructor() {
        super();
        this.state = {
            list_encomienda: [],
            list_tipovisaciones: [],
            usuario_id: null,
            columns: [
                {
                    Header: "ID",
                    id: "id",
                    accessor: "id",
                    width: 50,
                    show: true,
                    private: true,
                },
                {
                    Header: "N° Encomienda",
                    id: "encomiendaprofesional_nroOrden",
                    accessor: d => (d.encomiendaprofesional_nroOrden),
                    exportWidth: '8%',
                    show: true,
                },
                {
                    Header: "Comitente",
                    id: "encomiendaprofesional_comitente_nombre",
                    accessor: 'encomiendaprofesional_comitente_nombre',
                    exportWidth: '8%',
                    show: true,
                    Filter: ({ filter, onChange }) =>
                    <ParadigmaAsyncSeeker
                        url={api.comitentes.comitentes}
                        value={filter ? filter.value : ""}
                        onChange={data => (data) ? (onChange(data.apellido_nombre)): ((filter) ? onChange('') : null)}
                        displayField={"apellido_nombre"}
                        valueField={'apellido_nombre'}
                        parameters={{
                            paginationEnabled:false,
                            sort:['apellido_nombre'],
                        }}
                    />
                },
                {
                    Header: "Encomienda",
                    id: "encomiendaprofesional",
                    accessor: "encomiendaprofesional",
                    exportWidth: '8%',
                    show: false,
                },
                {
                    Header: "Nombre Visación",
                    id: "estadosplantillas_nombre",
                    accessor: d => (d.estadosplantillas_nombre),
                    exportWidth: '8%',
                    show: true,
                },
                {
                    Header: "Visación",
                    id: "estadosplantillas",
                    accessor: "estadosplantillas",
                    exportWidth: '8%',
                    show: false,
                },
                {
                    Header: "Fecha Estimación",
                    id: "fechaestimacion",
                    accessor: d => (d.fechaestimacion) ? (moment(d.fechaestimacion).format('DD-MM-YYYY')) : (''),
                    exportWidth: '7%',
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
                    Header: "Fecha Caducidad",
                    id: "fechacaducidad",
                    accessor: d => (d.fechacaducidad) ? (moment(d.fechacaducidad).format('DD-MM-YYYY')) : (''),
                    exportWidth: '7%',
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
                    Header: "Estado",
                    id: "estado",
                    accessor: e =><div
                            className="btn py-0"
                            style={{
                                background: 
                                    e.estado === 'Previa' ? '#FFEB3B' :  // Amarillo
                                    e.estado === 'Observada' ? '#4CAF50' :  // Verde
                                    e.estado === 'Definitiva' ? '#2196F3' :  // Azul
                                    '#BBBBBB',  // Gris por defecto
                                color: 
                                    e.estado === 'Previa' ? '#000000' :  // Texto negro para amarillo
                                    e.estado === 'Observada' || e.estado === 'Definitiva' ? '#FFFFFF' :  // Texto blanco
                                    '#FFFFFF',  // Texto blanco por defecto
                                width: 160,
                                height: 17,
                                fontSize: '0.8em',
                                marginTop: '0px',
                                borderTopWidth: '0px',
                            }}
                        >
                            {e.estado}  {/* Cambié 'd.estado' a 'e.estado' para coincidir con tu objeto */}
                        </div>,
                    width: 160,
                    exportWidth: '5%',
                    show: true,
                },
            ]
        };
    }

    componentDidMount = () => {
        apiFunctions.get(api.expedientes.encomiendaprofesionalSelect, null, null, null, (response) => {
            this.setState({
                list_encomienda: response.data
            })
        });

        apiFunctions.get(api.visaciones.estadosSelect, null, null, null, (response) => {
            this.setState({
                list_tipovisaciones: response.data
            })
        });
       
        // api.visaciones.estadosSelect
    }

    render() {
        const { list_encomienda, usuario_id, list_tipovisaciones } = this.state;
        const outerSort = [
        //   {
        //     id: 'nombre',
        //     desc: false
        //   },
        ];

        return (
            <ParadigmaTable
                buttons={[
                    {
                        create: true,
                        component: (props) => <Modal {...props} action="CREATE" list_tipovisaciones={list_tipovisaciones} list_encomienda={list_encomienda} />,
                        permission: 'encomiendaprofesional_new',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="EDIT" list_tipovisaciones={list_tipovisaciones} list_encomienda={list_encomienda} />,
                        permission: 'encomiendaprofesional_edit',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="DETAIL" list_tipovisaciones={list_tipovisaciones} list_encomienda={list_encomienda} />,
                        permission: 'encomiendaprofesional_detail',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="DELETE" list_tipovisaciones={list_tipovisaciones} list_encomienda={list_encomienda} />,
                        permission: 'encomiendaprofesional_delete',
                    },                 
                   {
                        edit: true,
                        component: (props) => <CambioEstado {...props} list_encomienda={list_encomienda} action="DELETE" />,
                        permission: 'encomiendaprofesional_edit',
                    },
                    {
                        edit: true,
                        component: (props) => <CambioEstado {...props} list_encomienda={list_encomienda} action="EDIT" />,
                        permission: 'encomiendaprofesional_edit',
                    },                                   
                ]}
                apiUrl={api.visaciones.encomienda}
                columns={this.state.columns}
                exportUrl={null}
                title={"Visaciones."}
                outerSort={outerSort}
            />
        );
    }
}

export default TableVisaciones;

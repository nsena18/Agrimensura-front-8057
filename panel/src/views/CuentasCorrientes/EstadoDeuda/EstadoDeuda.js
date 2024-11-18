import React, { Component } from 'react';
import axios from "axios";

import api from '../../../api/api';
import apiFunctions from "../../../api/functions.js"
import { formatCurrency } from '../../../functions/functions';

import Modal from "../../Expedientes/EncomiendaProfesional/Modal"
import ModalResumenDeuda from "../../Expedientes/EncomiendaProfesional/ModalResumenDeuda"

import ModalDeuda from "./ModalDeuda"

import ParadigmaTable from "../../../components/ParadigmaTable/ParadigmaTable";
import ParadigmaDatePicker from '../../../components/ParadigmaDatePicker/ParadigmaDatePicker';
import ParadigmaAsyncSeeker from '../../../components/ParadigmaAsyncSeeker/ParadigmaAsyncSeeker';
import moment from 'moment';

class EstadoDeuda extends Component {
    constructor() {
        super();
        this.state = {
            ar_estados: [],
            usuario_id: null,
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
                    Header: "N° Orden",
                    id: "nroOrden",
                    accessor: "nroOrden",
                    width: 150,
                    show: true,
                },
                {
                    Header: "Fecha",
                    id: "fechaIngreso",
                    // accessor: d => d.fechaIngreso,
                    accessor: d => (d.fechaIngreso) ? (moment(d.fechaIngreso).format('DD-MM-YYYY')) : (''),
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
                    Header: "Telefono",
                    id: "calle",
                    // accessor: "calle",
                    accessor: (e) => (e.comitente) ? (((e.comitente.telefono) ? e.comitente.telefono+', ' : '') +  ((e.comitente.telefono2) ? e.comitente.telefono2+', ' : '')+ ((e.comitente.telefono3) ? e.comitente.telefono3+', ' : '')) : (''),
                    show: true,
                    // private: true,
                    filtered: false,
                },
                {
                    Header: "Domicilio",
                    id: "numero",
                    // accessor: "comitente",
                    accessor: (e) => (e.calle+' '+e.numero),
                    show: true,
                },
                {
                    Header: "Tipo de Encomienda",
                    id: "tipoEncomienda",
                    // accessor: "comitente",
                    accessor: (e) => (e.tipoEncomienda) ? (e.tipoEncomienda.nombre) : (''),
                    show: false,
                    private: true,
                },
                {
                    Header: "Tipo de Encomienda",
                    id: "tipoEncomienda_id",
                    lookup: "exact",
                    width: 115,
                    accessor: (e) => (e.tipoEncomienda) ? (e.tipoEncomienda.nombre) : (''),
                    show: true,
                    Filter: ({ filter, onChange }) =>
                        <ParadigmaAsyncSeeker
                            url={api.expedientes.tiposdeencomiendaSelect}
                            value={filter ? filter.value : ""}
                            onChange={data => (data) ? (onChange(data.id)): ((filter) ? onChange('') : null)}
                            parameters={{
                                paginationEnabled:false,
                                sort:['nombre'],
                            }}
                        />
                },
                {
                    Header: "Estado",
                    id: "estado",
                    // accessor: "estado",
                    // accessor: e => ['Creado', 'Datos Completados', 'Pendiente de Medición', 'Medido', 'Pendiente envio de certificado CPA', 'Finalizado'][e.estado],
                    accessor: e => <div
                                    className="btn py-0"
                                    style={{
                                        // background: `#${['f33030', 'ff9942', '47f7ee', '47f7ee', '47f7ee', '1954fb', 'fbff09', '2ba043', 'f33030'][e.estado]}`,
                                        background: `#${this.state.ar_estados[e.estado] ? this.state.ar_estados[e.estado].background : 'bbb'}`,
                                        // color: `#${['fff', 'fff', 'fff', 'fff', '000000', 'fff', '000000', 'fff', 'fff'][e.estado]}`,
                                        color: `#${this.state.ar_estados[e.estado] ? this.state.ar_estados[e.estado].color : 'fff'}`,
                                        width: 120,
                                        height: 17,
                                        fontSize: '0.8em',
                                        marginTop: '0px',
                                        borderTopWidth: '0px',
                                    }}
                                >
                                    {this.state.ar_estados[e.estado] ? this.state.ar_estados[e.estado].nombre : ''}
                                    {/* {['Creado', 'Datos Completos', 'Presupuesto Enviado', 'Presupuesto Aceptado', 'Pendiente Medición', 'Medido', 'Pendiente Certificado', 'Finalizado', 'Presupuesto Desestimado'][e.estado]} */}
                                </div>,
                    width: 150,
                    show: true,
                    Filter: ({ filter, onChange }) =>
                        <ParadigmaAsyncSeeker
                            url={undefined}
                            // optionDefault={[{nombre: 'Creado', id: '0'}, {nombre: 'Datos Completos', id: '1'}, {nombre: 'Pendiente de Medición', id: '2'}, {nombre: 'Medido', id: '3'}, {nombre: 'Pendiente envio de certificado CPA', id: '4'}, {nombre: 'Finalizado', id: '5'}]}
                            optionDefault={this.state.ar_estados}
                            value={filter ? filter.value : ''}
                            onChange={data => (data) ? (onChange(data.id)): (onChange(''))}
                        />
                },
                {
                    Header: "Estado Deuda",
                    id: "estadoDeuda",
                    className: 'text-right',
                    width: 150,
                    accessor: (d) => '$ '+formatCurrency(d.estadoDeuda),
                    show: true,
                },
                {
                    Header: "Total Aplicado",
                    id: "totalAplicado",
                    className: 'text-right',
                    width: 150,
                    accessor: (d) => '$ '+formatCurrency(d.totalAplicado),
                    show: true,
                },
                {
                    Header: "Diferencia",
                    id: "deudaRestante",
                    className: 'text-right',
                    width: 150,
                    accessor: (d) => '$ '+formatCurrency(d.deudaRestante),
                    show: true,
                },
            ]
        };
    }

    componentDidMount = () => {
        // Cargo los estados de la encomienda con sus respectivos colores
        apiFunctions.get(api.expedientes.estadosencomiendaSelect, null, null, {sort:['numero']}, (response) => {
            this.setState({
                ar_estados: response.data.map((d) => { return {id: d.numero.toString(), nombre: d.nombre, background: d.background, color: d.texto, diasEstimados: d.diasEstimados} })
            })
        });

        apiFunctions.get(api.usuarios.perfil, null, this.props.depth, null, (response) => {
            let usuario_id = (response.data.id) ? (response.data.id) : (null)
            this.setState({
                usuario_id: usuario_id,
            });
        });
    }

    render() {
        const { ar_estados, usuario_id } = this.state;
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
                        edit: true,
                        component: (props) => <ModalDeuda {...props} action="EDIT" ar_estados={ar_estados} />,
                        permission: 'encomiendaprofesional_new',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="DETAIL" ar_estados={ar_estados} />,
                        permission: 'encomiendaprofesional_detail',
                    },
                    {
                        edit: true,
                        component: (props) => <ModalResumenDeuda {...props} action="DETAIL" /*ar_estados={ar_estados}*/ />,
                        permission: 'encomiendaprofesional_detail',
                    },
                ]}
                apiUrl={api.expedientes.encomiendaprofesionalEstadoDeuda}
                columns={this.state.columns}
                exportUrl={api.expedientes.encomiendaprofesional}
                title={"Estado de Deuda"}
                outerSort={outerSort}
            />
        );
    }
}

export default EstadoDeuda;

import React, { Component } from 'react';
import axios from "axios";

import api from '../../../api/api';
import apiFunctions from "../../../api/functions.js"
import { formatCurrency } from '../../../functions/functions';

import ParadigmaTable from "../../../components/ParadigmaTable/ParadigmaTable";
import ParadigmaDatePicker from '../../../components/ParadigmaDatePicker/ParadigmaDatePicker';

import Modal from './Modal.js';
import moment from 'moment';

class Visaciones extends Component {
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
                    Header: "Nombre plantilla",
                    id: "titulo",
                    accessor: "titulo",
                    width: 150,
                    exportWidth: '8%',
                    show: true,
                },
                {
                    Header: "Organismo dirigido",
                    id: "nombreorganismo",
                    accessor: "nombreorganismo",
                    width: 150,
                    exportWidth: '8%',
                    show: true,
                },
                {
                    Header: "Correo default 1",
                    id: "correoorganismo1",
                    exportWidth: '7%',
                    accessor: "correoorganismo2",
                    show: true,
                },
                {
                    Header: "Correo default 2",
                    id: "correoorganismo2",
                    exportWidth: '7%',
                    accessor: "correoorganismo2",
                    show: true,
                },
                {
                    Header: "Creado",
                    id: "created_at",
                    exportWidth: '7%',
                    accessor: d => (d.created_at) ? (moment(d.created_at).format('DD-MM-YYYY HH:mm')) : (''),                    
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
                    Header: "Ultima modificacion",
                    id: "updated_at",
                    exportWidth: '7%',
                    accessor: d => (d.updated_at) ? (moment(d.updated_at).format('DD-MM-YYYY HH:mm')) : (''),
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
            ]
        };
    }

    componentDidMount = () => {
        // Cargo los estados de la encomienda con sus respectivos colores
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
                        create: true,
                        component: (props) => <Modal {...props} action="CREATE" />,
                        permission: 'email_plantillas_new',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="EDIT" />,
                        permission: 'email_plantillas_edit',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="DETAIL" />,
                        permission: 'email_plantillas_detail',
                    },
                    {
                        delete: true,
                        component: (props) => <Modal {...props} action="DELETE" />,
                        permission: 'email_plantillas_delete',
                    }
                ]}
                apiUrl={api.visaciones.plantillas}
                columns={this.state.columns}
                /* exportUrl={null} */
                title={"Plantilla Visaciones"}
                outerSort={outerSort}
            />
        );
    }
}

export default Visaciones;

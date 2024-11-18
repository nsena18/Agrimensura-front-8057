import React, { Component } from 'react';
import axios from "axios";

import api from '../../api/api';
import { formatCurrency } from '../../functions/functions';

import Modal from "./Modal"
import Confirmacion from "./Confirmacion"

import ParadigmaTable from "../../components/ParadigmaTable/ParadigmaTable";
import { format } from '../../functions/functions';
import NumericFilter from '../../components/ParadigmaTable/NumericFilter';
import DateFilter from "../../components/ParadigmaTable/DateFilter";
import moment from 'moment';

class Comitentes extends Component {
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
                    Header: "apellido",
                    id: "apellido",
                    accessor: "apellido",
                    show:false,
                    private: true,
                },
                {
                    Header: "Nombre",
                    id: "nombre",
                    // accessor: "nombre",
                    accessor: (d) => d.apellido + ' ' + d.nombre,
                    show: true,
                },
                {
                    Header: "Documento",
                    id: "documento",
                    accessor: "documento",
                    show: true,
                },
                {
                    Header: "Teléfono",
                    id: "telefono",
                    accessor: "telefono",
                    show: true,
                },
                {
                    Header: "Dirección",
                    id: "direccion",
                    accessor: "direccion",
                    show: true,
                },
                {
                    Header: "Estado Confirmación",
                    id: "confirmacion",
                    accessor: (d)=>(d.confirmacion==false) ? ('Pendiente') : ('Confirmado'),
                    width: 110,
                    className:'text-center',
                    show: true,
                },
            ]
        };
    }

    render() {
        const { data, pages, loading } = this.state;
        const outerSort = [
          {
            id: 'nombre',
            desc: false
          },
        ];
        return (
            <ParadigmaTable
                buttons={[
                    {
                        create: true,
                        component: (props) => <Modal {...props} action="CREATE" />,
                        permission: 'comitentes_new',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="EDIT" />,
                        permission: 'comitentes_edit',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="DETAIL" />,
                        permission: 'comitentes_detail',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="DELETE" />,
                        permission: 'comitentes_delete',
                    },
                    {
                        edit: true,
                        component: (props) => <Confirmacion {...props} action="EDIT" />,
                        permission: 'comitentes_edit',
                    },
                ]}
                apiUrl={api.comitentes.comitentes}
                columns={this.state.columns}
                exportUrl={api.comitentes.comitentes}
                title={"Comitentes"}
                outerSort={outerSort}
            />
        );
    }
}

export default Comitentes;

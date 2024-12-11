import React, { Component } from 'react';
import axios from "axios";

import api from '../../../api/api';
import { formatCurrency } from '../../../functions/functions';

import Modal from "./Modal"

import ParadigmaTable from "../../../components/ParadigmaTable/ParadigmaTable";
import moment from 'moment';

class ObjetosDeTrabajo extends Component {
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
                    Header: "Nombre",
                    id: "nombre",
                    accessor: "nombre",
                    show: true,
                },
                {
                    Header: "Abreviatura",
                    id: "abreviatura",
                    accessor: "abreviatura",
                    show: true,
                },
                {
                    Header: "Tipo de Evento",
                    id: "tipoEncomienda",
                    // accessor: "tipoEncomienda",
                    accessor: (d) => (d.tipoEncomienda) ? (d.tipoEncomienda.nombre) : (''),
                    show: true,
                }
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
                        permission: 'objetosdetrabajo_new',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="EDIT" />,
                        permission: 'objetosdetrabajo_edit',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="DETAIL" />,
                        permission: 'objetosdetrabajo_detail',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="DELETE" />,
                        permission: 'objetosdetrabajo_delete',
                    },
                ]}
                apiUrl={api.expedientes.objetosdetrabajo}
                columns={this.state.columns}
               /*  exportUrl={api.expedientes.objetosdetrabajo} */
                title={"Objetos De Trabajo"}
                outerSort={outerSort}
            />
        );
    }
}

export default ObjetosDeTrabajo;

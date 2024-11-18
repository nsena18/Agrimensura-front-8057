import React, { Component } from 'react';
import axios from "axios";

import api from '../../../api/api';
import { formatCurrency } from '../../../functions/functions';

import Modal from "./Modal"

import ParadigmaTable from "../../../components/ParadigmaTable/ParadigmaTable";
import moment from 'moment';

class EstadoLotes extends Component {
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
                    Header: "Descripción",
                    id: "descripcion",
                    accessor: "descripcion",
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
                        permission: 'estadolotes_new',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="EDIT" />,
                        permission: 'estadolotes_edit',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="DETAIL" />,
                        permission: 'estadolotes_detail',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="DELETE" />,
                        permission: 'estadolotes_delete',
                    },
                ]}
                apiUrl={api.expedientes.estadolotes}
                columns={this.state.columns}
                exportUrl={api.expedientes.estadolotes}
                title={"Estado Lotes"}
                outerSort={outerSort}
            />
        );
    }
}

export default EstadoLotes;

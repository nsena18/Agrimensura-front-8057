import React, { Component } from 'react';
import axios from "axios";

import api from '../../../api/api';

import Modal from "./Modal"

import ParadigmaTable from "../../../components/ParadigmaTable/ParadigmaTable"


class Localidades extends Component {
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
                    Header: "Código Postal",
                    id: "codigoPostal",
                    accessor: "codigoPostal",
                    //className: "text-right",
                    show: true,
                },
                {
                    Header: "Provincia",
                    id: "provincia",
                    accessor: d => d.provincia ? d.provincia.nombre: "",
                    show: true,
                },
                
            ]
        };
    }

    render() {
        const { data, pages, loading } = this.state;
        return (
            <ParadigmaTable
                buttons={[
                    {
                        create: true,
                        component: (props) => <Modal {...props} action="CREATE" />,
                        permission: 'localidades_new',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="EDIT" />,
                        permission: 'localidades_edit',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="DETAIL" />,
                        permission: 'localidades_detail',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="DELETE" />,
                        permission: 'localidades_delete',
                    }
                ]}
                apiUrl={api.geograficas.localidades}
                columns={this.state.columns}
                exportUrl={api.geograficas.localidades}
                title={"Localidades"}
            />
        );
    }
}

export default Localidades;

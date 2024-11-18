import React, { Component } from 'react';
import axios from "axios";

import api from '../../../api/';

import Modal from "./Modal.js"

import ParadigmaTable from "../../../components/ParadigmaTable/"



class Permisos extends Component {
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
                    accessor: d => d.nombre,
                    show: true,
                },
                {
                    Header: "Descripcion",
                    id: "descripcion",
                    accessor: d => d.descripcion,
                    show: true,
                },
                {
                    Header: "Padre",
                    id: "padre",
                    accessor: d => (d.padre ? d.padre.nombre : ""),
                    show: true,
                },
            ]
        };
    }

    render() {
        const { data, pages, loading } = this.state;
        const { modernTheme } = this.props;
        return (
            <ParadigmaTable
                modernTheme={modernTheme}
                buttons={[
                    {
                        create: true,
                        component: (props) => <Modal {...props} action="CREATE" />,
                        permission: 'superadmin',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="EDIT" />,
                        permission: 'superadmin',
                    },
                    {
                        delete: true,
                        component: (props) => <Modal {...props} action="DELETE" />,
                        permission: 'superadmin',
                    }
                ]}
                depth={1}
                apiUrl={api.usuarios.permisos}
                columns={this.state.columns}
                exportUrl={api.usuarios.permisos}
                title={"Permisos"}
            />
        );
    }
}

export default Permisos;

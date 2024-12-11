import React, { Component } from 'react';
import axios from "axios";

import api from '../../../api/api';

import Modal from "./Modal"

import ParadigmaTable from "../../../components/ParadigmaTable/ParadigmaTable"


class Provincias extends Component {
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
                        permission: 'provincias_new',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="EDIT" />,
                        permission: 'provincias_edit',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="DETAIL" />,
                        permission: 'provincias_detail',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="DELETE" />,
                        permission: 'provincias_delete',
                    }
                ]}
                apiUrl={api.geograficas.provincias}
                columns={this.state.columns}
                /* exportUrl={api.geograficas.provincias} */
                title={"Provincias"}
            />
        );
    }
}

export default Provincias;

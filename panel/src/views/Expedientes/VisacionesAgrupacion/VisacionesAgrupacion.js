import React, { Component } from 'react';
import axios from "axios";

import api from '../../../api/api';
import apiFunctions from "../../../api/functions.js"
import Modal from "./Modal";
// import Ordenamiento from "./Ordenamiento";s

import ParadigmaTable from "../../../components/ParadigmaTable/ParadigmaTable"

class AgrupacionVisaciones extends Component {
    constructor() {
        super();
        this.state = {
            columns: [
                {
                    Header: "id",
                    id: "id",
                    accessor: "id",
                    width: 100,
                    show: true,
                    private: true,
                },
                {
                    Header: "Nombre del Grupo",
                    id: "nombre_grupo",
                    accessor: "nombre_grupo",
                    show: true,
                },
                {
                    Header: "Fecha de registro",
                    id: "created_at",
                    accessor: "created_at",
                    show: true,
                },
                {
                    Header: "Ultima actualización",
                    id: "updated_at",
                    accessor: "updated_at",
                    show: true,
                },
            ],
            listVisaciones: [],
        };
    }
    componentDidMount = () => { 
        apiFunctions.get(api.visaciones.estadosSelect, null, null, null, (response) => {
            console.log('response visaciones')
            console.log(response)
            this.setState(
                {
                    listVisaciones: response.data
                }
            )
        });
    }
    render() {
        const { data, pages, loading, listVisaciones} = this.state;
        return (
            <ParadigmaTable
                buttons={[
                    {
                        create: true,
                        component: (props) => <Modal {...props} action="CREATE" listVisaciones={listVisaciones} />,
                        permission: 'estadosencomienda_edit',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="EDIT" listVisaciones={listVisaciones}/>,
                        permission: 'estadosencomienda_edit',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="DETAIL" listVisaciones={listVisaciones}/>,
                        permission: 'estadosencomienda_detail',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="DELETE" listVisaciones={listVisaciones}/>,
                        permission: 'estadosencomienda_delete',
                    }
                ]}
                apiUrl={api.visaciones.agrupacionvisaciones}
                columns={this.state.columns}
                /* exportUrl={api.expedientes.estadosencomienda} */
                title={"Agrupacion de Visaciones"}
            />
        );
    }
}

export default AgrupacionVisaciones;

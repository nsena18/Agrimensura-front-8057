import React, { Component } from 'react';
import axios from "axios";

import api from '../../../api/api';

import Modal from "./Modal"

import ParadigmaTable from "../../../components/ParadigmaTable/ParadigmaTable"

import auth from "../../../auth/";

class Casillas extends Component {
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
                    Header: "Host",
                    id: "host",
                    accessor: "host",
                    show: true,
                },
                {
                    Header: "Usuario",
                    id: "username",
                    accessor: "username",
                    show: true,
                },
            ]
        };
    }

    // componentDidMount = () =>{
    //     document.getElementsByClassName('main')[0].classList.remove('bodyPedidos');    
    // }

    render() {
        const { data, pages, loading } = this.state;
        return (
            <ParadigmaTable
                buttons={[
                    {
                        create: true,
                        component: (props) => <Modal {...props} action="CREATE" />,
                        permission: 'email_casillas_new',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="EDIT" />,
                        permission: 'email_casillas_edit',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="DETAIL" />,
                        permission: 'email_casillas_detail',
                    },
                    {
                        delete: true,
                        component: (props) => <Modal {...props} action="DELETE" />,
                        permission: 'email_casillas_delete',
                    }
                ]}
                apiUrl={api.mails.casillas}
                columns={this.state.columns}
                exportUrl={api.mails.casillas}
                title={"Casillas"}
            />
        );
    }
}

export default Casillas;

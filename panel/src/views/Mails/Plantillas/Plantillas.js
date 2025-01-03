import React, { Component } from 'react';
import axios from "axios";

import api from '../../../api/api';

import Modal from "./Modal"

import ParadigmaTable from "../../../components/ParadigmaTable/ParadigmaTable"

import auth from "../../../auth/";

class Plantillas extends Component {
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
                    Header: "Descripción",
                    id: "descripcion",
                    accessor: "descripcion",
                    show: true,
                },
                {
                    Header: "Asunto",
                    id: "asunto",
                    accessor: "asunto",
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
                apiUrl={api.mails.plantillas}
                columns={this.state.columns}
                /* exportUrl={api.mails.plantillas} */
                title={"Plantillas"}
            />
        );
    }
}

export default Plantillas;

import React, { Component } from 'react';
import axios from "axios";

import api from '../../api/api';
import { formatCurrency } from '../../functions/functions';

import Modal from "./Modal"

import ParadigmaTable from "../../components/ParadigmaTable/ParadigmaTable";
import { format } from '../../functions/functions';
import NumericFilter from '../../components/ParadigmaTable/NumericFilter';
import DateFilter from "../../components/ParadigmaTable/DateFilter";
import ParadigmaDatePicker from '../../components/ParadigmaDatePicker/ParadigmaDatePicker';
import moment from 'moment';

class Profesiones extends Component {
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
                        permission: 'profesiones_new',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="EDIT" />,
                        permission: 'profesiones_edit',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="DETAIL" />,
                        permission: 'profesiones_detail',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="DELETE" />,
                        permission: 'profesiones_delete',
                    },
                ]}
                apiUrl={api.comitentes.profesiones}
                columns={this.state.columns}
                /* exportUrl={api.comitentes.profesiones} */
                title={"Profesiones"}
                outerSort={outerSort}
            />
        );
    }
}

export default Profesiones;

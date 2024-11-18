import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Input, Modal, ModalHeader, ModalBody, ModalFooter, Button, Table } from 'reactstrap';

// import api from '../../api/api';
import ParadigmaLabeledInput from "../../../components/ParadigmaLabeledInput/ParadigmaLabeledInput.js";

class TableArchivos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            archivos: props.archivos,
            selectedRow: null
        }
    }

    componentDidUpdate(prevProps) {
        const { archivos } = this.props;
        if (prevProps.archivos !== archivos) {
            this.setState({ archivos });
        }
    }

    onChange = data => {
            this.setState(
                prevState => ({
                archivos: prevState.archivos.concat(data)
            }),
            () => this.props.onChange(this.state.archivos)
        );
    }

    onDelete = row => {
        this.setState(
            prevState => {
                prevState.archivos.splice(row, 1);
                return {
                    archivos: prevState.archivos,
                    selectedRow: null
                }
            },
            () => this.props.onChange(this.state.archivos)
        );
    }

    render() {
        const { archivos, selectedRow } = this.state;
        const { action } = this.props;
        return (
            <div>
                { (action === 'CREATE' || action === 'EDIT') ?
                    <Fragment>
                        <ModalArchivos
                            onChange={this.onChange}
                            action="create"
                        />
                        <ModalArchivos
                            onDelete={this.onDelete}
                            value={archivos[selectedRow]}
                            row={selectedRow}
                            action="delete"
                        />
                    </Fragment> :
                    <ModalArchivos
                        value={archivos[selectedRow]}
                        row={selectedRow}
                        action="download"
                        url={this.props.url}
                    />
                }
                <Table size="sm" className="mt-1">
                    <thead>
                        <tr>
                            <th>Archivos</th>
                        </tr>
                    </thead>
                    <tbody>
                        { archivos.map(
                            (archivo, i) =>
                                <tr
                                    key={i}
                                    onClick={() => this.setState(prevState => ({
                                        selectedRow: prevState.selectedRow === i ? null : i
                                    }))}
                                    style={{ cursor: 'pointer', background: (selectedRow === i) ? 'rgba(0,0,0,0.1)' : 'none' }}
                                >
                                    <td>{(archivo.archivo && archivo.archivo.name) || archivo.nombre}</td>
                                </tr>
                            )
                        }
                        { archivos.length === 0 &&
                            <tr>
                                <td className="text-center" colSpan={3}>No hay archivos</td>
                            </tr>
                        }
                    </tbody>
                </Table>
            </div>
        );
    }
}

class ModalArchivos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            archivo: null,
            archivoURL: '',
            isOpen: false
        }
    }

    static propTypes = {
        action: PropTypes.string.isRequired,
        onChange: PropTypes.func,
        onDelete: PropTypes.func,
        disabled: PropTypes.bool
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value) {
            this.setState({
                archivo: nextProps.value.archivo
            });
        }
    }

    actionData = {
        delete: {
            icon: 'fa fa-minus',
            color: 'danger',
            title: 'Eliminar archivo',
            button: 'Eliminar',
            buttonColor: 'danger',
            disabled: true,
            modal: 'bg-danger',
            buttonFn: this.deleteFile
        },
        create: {
            icon: 'fa fa-plus',
            color: 'secondary',
            title: 'Agregar archivo',
            button: 'Agregar',
            buttonColor: 'success',
            disabled: false,
            modal: 'bg-success',
            buttonFn: this.toggle
        },
        download: {
            icon: 'fa fa-download',
            color: 'warning',
            title: 'Descargar archivo',
            button: false,
            disabled: true,
            modal: 'bg-secondary',
            buttonFn: this.downloadFile
        }
    };

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    close = () => {
        this.setState({
            archivo: '',
            descripcion: '',
        });
        this.toggle();
    }

    onChangeField = (field, value) => {
        this.setState(prevState => {
            let errors = prevState.errors;
            if (errors) errors[field] = null;
            prevState.errors = errors;
            prevState[field] = value;
            return prevState;
        });
    }

    onSubmit = () => {
        const { action, row } = this.props;
        if (action === 'create') {
            const { archivo } = this.state;
            if (archivo) {
                this.props.onChange({ archivo });
                this.close();
            }
        } else if (action === 'delete') {
            this.props.onDelete(row);
            this.close();
        }
    }

    downloadFile = () => {
        const { url, value } = this.props;
        if (value && url) {
            window.open(url.replace('$id_archivo', value.id) + '?hash=' + value.hash);
        }
    }

    deleteFile = () => {
        this.toggle();
    }

    render() {
        const { isOpen } = this.state;
        const { action, disabled, row } = this.props;
        const actionData = this.actionData[action];
        return (
            <Fragment>
                { !disabled &&
                    <Button
                        color={actionData['color']}
                        onClick={action === 'create' ? this.toggle : (action === 'delete') ? this.deleteFile : this.downloadFile }
                        size="sm"
                        className="mr-1 btn-table-modal rounded"
                        disabled={(action === 'download' || action === 'delete') && (row === null)}
                    >
                        <i className={actionData['icon']} aria-hidden="true"></i>
                    </Button>
                }
                <Modal isOpen={isOpen} toggle={this.toggle} >
                    <ModalHeader toggle={this.toggle} className={actionData['modal']} >
                        { actionData['title'] }
                    </ModalHeader>
                    <ModalBody>
                        {
                            action === 'delete' ?
                            '¿Está seguro que desea eliminar este archivo?' :

                            <ParadigmaLabeledInput
                                md={[3, 9]}
                                label={"Archivo"}
                                inputComponent={
                                    <Input id={'inp_arch'} onChange={e => this.setState({ archivo: e.target.files[0] })} type="file" disabled={actionData['disabled']} />
                                }
                            />
                        }
                    </ModalBody>
                    <ModalFooter>
                        { actionData['button'] &&
                            <Button color={actionData['buttonColor']} onClick={this.onSubmit} className="mr-1">
                                {actionData['button']}
                            </Button>
                        }
                        <Button color="secondary" onClick={this.close}>Cancelar</Button>
                    </ModalFooter>
                </Modal>
            </Fragment>
        );
    }
}

export default TableArchivos;

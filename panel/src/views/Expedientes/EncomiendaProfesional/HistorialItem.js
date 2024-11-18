import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Collapse, Button } from 'reactstrap';

import api from '../../../api/api';

class HistorialItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
        }
    }

    static propTypes = {
        tituloheader: PropTypes.string,
        titulo: PropTypes.string,
        observacion: PropTypes.string,
        archivo: PropTypes.string,
        subtitulo: PropTypes.string,
    }

    toggle = () => this.setState(prevState => ({ isOpen: !prevState.isOpen }));

    render() {
        const { historia, tituloheader, titulo, observacion, archivo, tituloFechas, subtitulo } = this.props;
        const { isOpen } = this.state;

        // const hayDescripcion = !!(historia.mensaje || historia.descripcion);
        return (
            <div
                style={(observacion || archivo) ? { cursor: 'pointer' } : {}}
                onClick={this.toggle}
            >
                <Fragment>
                    <div className="badge badge-success mr-2">{(tituloheader) ? (tituloheader) : ''}</div><br/>
                    {(subtitulo) && <Fragment><span style={{fontSize: "1em"}}>{subtitulo}</span><br/></Fragment>}
                    {(tituloFechas) && <Fragment><span style={{fontWeight: '700', fontSize: "1.05em"}}>{tituloFechas}</span><br/></Fragment>}
                    <span>
                        {/* <strong>{`${historia.autor.first_name} ${historia.autor.last_name}`}</strong> {' '}
                        ha cambiado el estado a {' '}
                        <strong>{historia.estado.nombre}</strong> */}
                        {(titulo) ? (titulo) : ''}
                    </span>
                </Fragment> 
                <Collapse isOpen={isOpen}>
                    <div>{observacion}</div>

                    { // archivo
                        archivo &&
                        <div className="mt-2">
                            <Button
                                tag="a"
                                color="primary"
                                target="_blank"
                                href={archivo}
                            >
                                <i className="fa fa-download mr-2"></i>
                                Descargar archivo
                            </Button>
                            {/* {historia.archivo_nombre} */}
                        </div>
                    }

                    {/*{
                        historia.imagen_url &&
                        <div className="mt-2">
                            <img src={`${api.BASE_URL}${historia.imagen_url}`} />
                        </div>
                    } */}
                </Collapse>
            </div>
        );
    }
}

export default HistorialItem;
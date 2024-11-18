import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Card, CardImg, CardText, CardBody, CardColumns,
  CardTitle, CardSubtitle, Button
} from 'reactstrap';
import { groupBy } from 'lodash';

import api from '../../../api/api';

class CardTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      pageSize: props.pageSize,
      sorted: props.sorted || [],
      filtered: [],
    };
  }

  static propTypes = {
    /** Arreglo de botones para mostrar en cada card */
    buttons: PropTypes.array,
    /** Arreglo de objetos con la data para mosrtar */
    data: PropTypes.array,
    /** titleField: string para acceder al campo de título */
    titleField: PropTypes.string,
    /** subtitleField: string para acceder al campo de subtítulo */
    subtitleField: PropTypes.string,
    /** imageField: string para acceder al campo de imagen */
    imageField: PropTypes.string,
    /** textField: string para acceder al campo de texto */
    textField: PropTypes.string,
    /** anchorField: string para acceder al campo de anchorField */
    anchorField: PropTypes.string,
    /** groupBy: función para determinar el criterio usado para agrupar las cards */
    group: PropTypes.func,
    /** totalRows: numero total de filas que posee la tabla */
    totalRows: PropTypes.number,
    /** pageSize: numero total de filas a mostrar por página */
    pageSize: PropTypes.number,
    /** propiedad que setea si está activado el modo 'Resaltar imágenes' o 'Vista uniforme' */
    resaltarImagenes: PropTypes.bool,
  };

  componentDidMount() {
    if (this.props.onFetchData) this.props.onFetchData(this.state);
  }

  componentDidUpdate(prevProps, prevState) {
    const { pageSize } = this.props;
    if (prevProps.pageSize !== pageSize) {
      this.setState({ pageSize, page: 0 });
      if (this.props.onFetchData) this.props.onFetchData(this.state);
    }

    const { page } = this.state;
    if (prevState.page !== page) {
      if (this.props.onFetchData) this.props.onFetchData(this.state);
    }
  }

  addPage = add => this.setState(prevState => ({ page: prevState.page + add }));

  render() {
    const {
      buttons, data, titleField, subtitleField,
      imageField, textField, anchorField,
      totalRows, group, resaltarImagenes,
    } = this.props;
    const { page, pageSize } = this.state;
    const anteriorDisabled = page === 0;
    const siguienteDisabled = totalRows - ((page) * pageSize + data.length) === 0;

    let grouped;
    if (group) grouped = groupBy(data, group);

    return (
      <div className="flex-grow-1 mt-1">
        {
          grouped ?
            Object.keys(grouped).map(g =>
              <Fragment key={g}>
                <div className="bg-secondary font-weight-bold my-2 px-2 py-1">{g}</div>
                <CardColumns className={'card-tables' + (!resaltarImagenes ? ' uniforme' : '')}>
                  {
                    grouped[g].map((data, i) =>
                      <Card tag={anchorField ? 'a' : 'div'} href={anchorField ? data[anchorField] : null} target="_blank" key={`card-${i}`}>
                        { imageField && data[imageField] && <CardImg top width="100%" src={data[imageField] ? api.BASE_URL + data[imageField] : null} /> }
                        <CardBody>
                          { titleField && <CardTitle>{data[titleField]}</CardTitle> }
                          { subtitleField && <CardSubtitle>{data[subtitleField]}</CardSubtitle> }
                          { textField && <CardText>{data[textField]}</CardText> }
                          <div className="mt-2">
                            {
                              React.Children.map(buttons, button =>
                                <span className="mr-1">
                                  { React.cloneElement(button, { id: () => (data.id) }) }
                                </span>
                              )
                            }
                          </div>
                        </CardBody>
                      </Card>
                    )
                  }
                </CardColumns>
              </Fragment>
            ) :
            <CardColumns className={'card-tables' + (!resaltarImagenes ? ' uniforme' : '')}>
              {
                data.map((data, i) =>
                  <Card tag={anchorField ? 'a' : 'div'} href={anchorField ? data[anchorField] : null} target="_blank" key={`card-${i}`} >
                    { imageField && data[imageField] && <CardImg top width="100%" src={data[imageField] ? api.BASE_URL + data[imageField] : null} /> }
                    <CardBody>
                      { titleField && <CardTitle>{data[titleField]}</CardTitle> }
                      { subtitleField && <CardSubtitle>{data[subtitleField]}</CardSubtitle> }
                      { textField && <CardText>{data[textField]}</CardText> }
                      <div className="mt-2">
                        {
                          React.Children.map(buttons, button =>
                            <span className="mr-1">
                              { React.cloneElement(button, { id: () => (data.id) }) }
                            </span>
                          )
                        }
                      </div>
                    </CardBody>
                  </Card>
                )
              }
            </CardColumns>

        }
        {
          !(anteriorDisabled && siguienteDisabled) &&
          <div className="w-100 d-flex justify-content-between">
            <Button disabled={anteriorDisabled} onClick={_ => this.addPage(-1)}>Anterior</Button>
            <Button
              disabled={siguienteDisabled}
              onClick={_ => this.addPage(1)}
            >Siguiente</Button>
          </div>
        }
      </div>
    );
  }
}

export default CardTable;

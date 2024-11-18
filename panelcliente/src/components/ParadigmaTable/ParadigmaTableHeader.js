import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import {
  DropdownMenu, Dropdown, DropdownToggle,
  DropdownItem, Input, Label, FormGroup,
  UncontrolledTooltip
} from 'reactstrap';

var checkStyle = {
  paddingLeft: '5px',
  paddingRight: '5px',
  margin: '0px',
};

class ParadigmaTableHeader extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.toggleExport = this.toggleExport.bind(this);

    var tmpcolumns = this.props.listColumns;
    var localColumns = localStorage.getItem('table_' + this.props.title.split(' ').join(''));
    if (localColumns) {
      var newcolumns = JSON.parse(localColumns);
      for (var i = 0; i < newcolumns.length; i++) {
        var tmpcolumn = tmpcolumns.filter(x => x.id == newcolumns[i].id);

        if (tmpcolumn.length > 0 && tmpcolumn[0].columns)
        {
          for (var j = 0; j < tmpcolumn[0].columns.length; j++)
          {
            tmpcolumn[0].columns[j].show = newcolumns[i].columns[j].show;
            tmpcolumn[0].columns[j].width = newcolumns[i].columns[j].width;
          }
        } else if (tmpcolumn.length > 0) {
          tmpcolumn[0].show = newcolumns[i].show;
          tmpcolumn[0].width = newcolumns[i].width;
        }
      }
    }

    var defaultConfig = this.props.defaultConfig;
    var config = JSON.parse(localStorage.getItem('table_' + this.props.title.split(' ').join('') + "_config"));
    if (config != null && config.pageSize != defaultConfig.pageSize) {
      defaultConfig.pageSize = config.pageSize;
    }

    this.state = {
      dropdownOpen: false,
      dropdownExportOpen: false,
      selectedColumns: tmpcolumns,
      landscape: false,
      mode: 1,
      format: 'pdf',
      defaultConfig: defaultConfig,
      cardsMode: props.cardsMode, // table o cards
      resaltarImagenes: false, // determina si está activado el modo 'Resaltar imágenes' o 'Vista Uniforme',

      refreshAutomaticoBtnTimer: props.refreshAutomaticoBtnTimer ? props.refreshAutomaticoBtnTimer : 60,//seg
      refreshAutomaticoEnabled: props.refreshAutomaticoBtn ? props.refreshAutomaticoBtn : false,
    };


    const refresh = () => {
      const refreshTime = this.state.refreshAutomaticoBtnTimer * 1000;
      clearTimeout(this.timeoutRefresh);
      if(this.state.refreshAutomaticoEnabled){
        this.timeoutRefresh = setTimeout(refresh, refreshTime);
      }
      this.props.onUpdate();
    }
    this.timeoutRefresh = this.state.refreshAutomaticoEnabled ? setTimeout(refresh, this.state.refreshAutomaticoBtnTimer * 1000) : null;
  }

  componentWillUnmount(){
    clearTimeout(this.timeoutRefresh);
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
      dropdownExportOpen: false,
    });
  }

  toggleExport() {
    this.setState({
      dropdownExportOpen: !this.state.dropdownExportOpen,
      dropdownOpen: false,
    });
  }

  static propTypes = {
    title: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    listColumns: PropTypes.array.isRequired,
    defaultConfig: PropTypes.any,
    resizedColumns: PropTypes.any,
    onExport: PropTypes.func,
    onConfigChanged: PropTypes.func,

    /** Booleano que determina si el modo cards está activado */
    cardsMode: PropTypes.bool,
    /** Funcion que se ejecuta cuando se cambia el modo cards (Resaltar imágenes o vista uniforme) */
    toggleCardsDisplay: PropTypes.func,
    /** Booleano que sirve para habilitar la opcion de refresco automatico de tabla **/
    refreshAutomaticoBtn: PropTypes.bool,
    refreshAutomaticoBtnTimer: PropTypes.number,
  };

  componentDidUpdate(prevProps) {
    const { cardsMode, refreshAutomaticoBtn } = this.props;
    if (cardsMode !== prevProps.cardsMode) this.setState({ cardsMode });
    if (refreshAutomaticoBtn != this.state.refreshAutomaticoBtn) this.setState({refreshAutomaticoBtn});
  }

  handleClick(e) {
    this.toggleColumn(e.target.id);
    this.updateLocalStorage();
    this.triggerChange();
  }

  changeRowCount(e) {
    var newpageSize = parseInt(e.target.value);
    var defaultConfig = this.state.defaultConfig;
    defaultConfig.pageSize = newpageSize;
    this.setState({ defaultConfig: defaultConfig });
    this.props.onConfigChanged(defaultConfig);
    this.updateLocalStorage();
  }

  updateLocalStorage() {
    localStorage.setItem("table_" + this.props.title.split(' ').join(''), JSON.stringify(this.state.selectedColumns));
    localStorage.setItem("table_" + this.props.title.split(' ').join('') + "_config", JSON.stringify(this.state.defaultConfig));
  }

  triggerChange() {
    if (this.props.onChange) this.props.onChange(this.state.selectedColumns);
  }

  toggleColumn(id) {
    var tmpColumns = this.state.selectedColumns;
    for (var i = 0; i < tmpColumns.length; i++) {
      var column = tmpColumns[i];
      if (column.id == id)
      {
        column.show = !column.show;
        if (column.columns && column.show == false)
        {
          for (var j = 0; j < column.columns.length; j++)
            column.columns[j].show = false;
        }
      }

      if (column.columns && column.id != id)
      {
        for (var k = 0; k < column.columns.length; k++)
        if (column.columns[k].id == id) {
          {
            column.columns[k].show = !column.columns[k].show;
            if (column.columns[k].show == true)
            column.show = true;
          }
        }
      }
    }

    this.setState({ selectedColumns: tmpColumns });
  }

  resizeColumn(id, width) {
    var tmpColumns = this.state.selectedColumns;
    for (var i = 0; i < tmpColumns.length; i++) {
      var column = tmpColumns[i];
      if (column.id == id) {
        column.width = width;
      }
      else if (column.columns)
      {
        for (var j = 0; j < tmpColumns.length; j++)
        {
          if (column.columns[j].id == id)
          column.coloumns[j].width = width;
        }
      }
    }
    this.setState({ selectedColumns: tmpColumns });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.resizedColumns) {
      var resize = nextProps.resizedColumns;
      var tmpColumns = this.state.selectedColumns;
      for (var j = 0; j < resize.length; j++) {
        for (var i = 0; i < tmpColumns.length; i++) {
          var column = tmpColumns[i];
          if (column.id == resize[j].id) {
            column.width = resize[j].value;
          }
          else
          {
            if(column.columns)
            {
              for (var k = 0; k < column.columns.length; k++)
              {
                if (column.columns[k].id == resize[j].id)
                column.columns[k].width= resize[j].value;
              }
            }
          }
        }
      }
      this.setState({ selectedColumns: tmpColumns });
      this.updateLocalStorage();
    }
    if (nextProps.defaultConfig != this.state.defaultConfig)
    this.setState({ defaultConfig: nextProps.defaultConfig });
  }

  export() {
    if (this.props.onExport)
    this.props.onExport(this.state.format, this.state.mode, this.state.landscape);
  }

  selectFormat(format) {
    this.setState({ format: format });
  }


  selectOrientation(landscape) {
    this.setState({ landscape: landscape });
  }


  selectMode(mode) {
    this.setState({ mode: mode });
  }

  /**Cuando está el modo cards activado, togglea entre modos 'Resaltar imágenes' y 'Vista uniforme' */
  toggleCardsDisplay = () => {
    this.setState(
      prevState => ({ resaltarImagenes: !prevState.resaltarImagenes }),
      () => {
        const { toggleCardsDisplay } = this.props;
        if (toggleCardsDisplay) toggleCardsDisplay(this.state.resaltarImagenes);
      }
    )
  }

  updateRefreshAutomaticoBtn = (enabled, timer) => {
    const newValue = enabled;
    const refreshTime = timer * 1000;
    clearTimeout(this.timeoutRefresh);

    if(newValue){
      const refresh = () => {
        clearTimeout(this.timeoutRefresh);
        if(this.state.refreshAutomaticoEnabled){
          this.timeoutRefresh = setTimeout(refresh, refreshTime);
        }
        this.props.onUpdate();
      }
      this.timeoutRefresh = setTimeout(refresh, refreshTime);
    }
    this.setState({refreshAutomaticoEnabled:newValue, refreshAutomaticoBtnTimer:timer});
  }

  render() {
    var checks = [];
    var columns = this.props.listColumns;
    for (var i = 0; i < columns.length; i++) {
      var column = columns[i];
      if (!column.private) {
        checks[checks.length] = (
          <div key={i} style={checkStyle}>
          <FormGroup check>
          <Label for={column.id} className="w-100" check>
          <Input type="checkbox" id={column.id} name={column.id} checked={column.show} onChange={(e) => this.handleClick(e)} />{' '}
          {column.Header}
          </Label>
          </FormGroup>

          {column.columns ?
            <ul >
            {column.columns.map( x =>
              {
                return (<li style={{ listStyleType: "none" }}>
                <FormGroup check>
                <Label for={x.id} className="w-100" check>
                <Input type="checkbox" id={x.id} name={x.id} checked={x.show} onChange={(e) => this.handleClick(e)} />{' '}
                {x.Header}
                </Label>
                </FormGroup>
                </li>);
              })}
              </ul>  :null}
              </div>
            );
          }
        }

        return (
          <div>
          <h4 className="rt-thead-title mb-2 mb-sm-0">{this.props.title}</h4>
          <div className="d-flex flex-row justify-content-between flex-wrap" style={{  }}>

          <div className="d-flex flex-row justify-content-center left-buttons">
          {this.props.toolbarButtons}
          </div>

          <div className="d-flex flex-row justify-content-center right-buttons">
          {this.props.btnHelp &&
            <div className="mr-2">
            {this.props.btnHelp}
            </div>
          }
          {
            !this.props.multiSelect &&
            (this.props.total.filtered != this.props.total.total ?
              <label className="d-none d-sm-block pr-2 mt-1 mb-0 float-right">Mostrando {this.props.total.show} de {this.props.total.filtered} (filtrados de {this.props.total.total})</label>
              :
              <label className="d-none d-sm-block pr-2 mt-1 mb-0 float-right">Mostrando {this.props.total.show} de {this.props.total.filtered}</label>
            )
          }

          {
            this.props.multiSelect &&
            (this.props.total.filtered != this.props.total.total ?
              <label className="d-none d-sm-block pr-2 mt-1 mb-0 float-right">Mostrando {this.props.total.show} de {this.props.total.filtered} (filtrados de {this.props.total.total}) ({this.props.total.selected} filas seleccionadas)</label>
              :
              <label className="d-none d-sm-block pr-2 mt-1 mb-0 float-right">Mostrando {this.props.total.show} de {this.props.total.filtered} ({this.props.total.selected} filas seleccionadas)</label>
            )
          }
          {
            this.props.refreshAutomaticoBtn &&
            <div className="d-inline-block position-relative">
            <button id="refreshAutomaticoBtn" className={`icon rounded btn ${this.state.refreshAutomaticoEnabled ? "btn-warning" : "btn-secondary"} btn-sm h-100`} onClick={(e) => this.updateRefreshAutomaticoBtn(!this.state.refreshAutomaticoEnabled, this.state.refreshAutomaticoBtnTimer)}>
            <i className={`fa fa fa-refresh ${this.state.refreshAutomaticoEnabled ? "fa-spin" : ""} fa-fw fa-lg`}></i>
            <UncontrolledTooltip placement="bottom" target="refreshAutomaticoBtn" delay={0}>Actualización Automatica</UncontrolledTooltip>
            </button>
            </div>
          }


          <div className="d-inline-block position-relative">
          <button id="refreshBtn" className="icon rounded btn btn-secondary btn-sm h-100" onClick={(e) => this.props.onUpdate()}>
          <i className="fa fa-repeat fa-lg"></i>
          <UncontrolledTooltip placement="bottom" target={"refreshBtn"} delay={0}>Actualizar Tabla</UncontrolledTooltip>
          </button>
          </div>

          {this.props.showExport &&
            <Dropdown className="d-inline-block" isOpen={this.state.dropdownExportOpen} toggle={this.toggleExport}>
            <DropdownToggle id="exportBtn" className="btn-sm background-transparent border-transparent h-100">
            <i className="fa fa-download fa-lg"></i>
            <UncontrolledTooltip delay={0} className={(this.state.dropdownExportOpen ? "d-none" : "")} placement="bottom"
            target={"exportBtn"}>Exportar datos</UncontrolledTooltip>
            </DropdownToggle>
            <DropdownMenu right>
            <DropdownItem header>Formato</DropdownItem>
            <FormGroup tag="fieldset" className="mb-0 mx-2">
            <FormGroup check className="d-inline-block w-50 m-auto">
            <Label check>
            <Input type="radio" name="radio1" checked={(this.state.format == 'pdf' ? true : false)}
            onChange={() => this.selectFormat('pdf')} />{' '}PDF
            </Label>
            </FormGroup>
            <FormGroup check className="d-inline-block w-50 m-auto">
            <Label check>
            <Input type="radio" name="radio1" checked={(this.state.format == 'xls' ? true : false)}
            onChange={() => this.selectFormat('xls')} />{' '}EXCEL
            </Label>
            </FormGroup>
            </FormGroup>

            <DropdownItem header>Orientacion</DropdownItem>
            <FormGroup tag="fieldset" className="mb-0 mx-2">
            <FormGroup check className="d-inline-block w-50 m-auto">
            <Label check>
            <Input type="radio" name="radio3" checked={!this.state.landscape}
            onChange={() => this.selectOrientation(false)} />{' '}
            <i className="fa fa-mobile-phone fa-lg"></i>
            </Label>
            </FormGroup>
            <FormGroup check className="d-inline-block w-50 m-auto">
            <Label check>
            <Input type="radio" name="radio3" checked={this.state.landscape}
            onChange={() => this.selectOrientation(true)} />{' '}
            <i className="fa fa-mobile-phone rot-90 fa-lg"></i>
            </Label>
            </FormGroup>
            </FormGroup>


            <DropdownItem header>Modo</DropdownItem>
            <FormGroup tag="fieldset" className="mb-0 mx-2">
            <FormGroup check className="d-inline-block w-100 m-auto">
            <Label check>
            <Input type="radio" name="radio2" checked={(this.state.mode == 1 ? true : false)}
            onChange={() => this.selectMode(1)} />{' '}Pagina Actual
            </Label>
            </FormGroup>
            <FormGroup check className="d-inline-block w-100 m-auto">
            <Label check>
            <Input type="radio" name="radio2" checked={(this.state.mode == 2 ? true : false)}
            onChange={() => this.selectMode(2)} />{' '}Lista Filtrada
            </Label>
            </FormGroup>
            <FormGroup check className="d-inline-block w-100 m-auto">
            <Label check>
            <Input type="radio" name="radio2" checked={(this.state.mode == 3 ? true : false)}
            onChange={() => this.selectMode(3)} />{' '}Lista Completa
            </Label>
            </FormGroup>
            </FormGroup>
            <button className="icon btn btn-secondary btn-sm float-right background-transparent border-transparent w-100"
            onClick={(e) => this.export()}>
            <i className="fa fa-download fa-lg"></i>{' '} GENERAR
            </button>

            </DropdownMenu>
            </Dropdown>
          }

          <Dropdown className="d-inline-block" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
          <DropdownToggle id="configureBtn" className="btn-sm rounded background-transparent border-transparent h-100">
          <i className="fa fa-cog fa-lg"></i>
          <UncontrolledTooltip delay={0} className={(this.state.dropdownOpen ? "d-none" : "")} placement="bottom"
          target={"configureBtn"}>Configurar Tabla</UncontrolledTooltip>
          </DropdownToggle>
          <DropdownMenu right>
          <DropdownItem header>Configuración</DropdownItem>
          <div className={"row mx-0"} style={checkStyle}>
          <div className={"col-8 px-0"}>
          <Label for={column.id} className="w-100 h-100 m-0">Filas por Página</Label>
          </div>
          <div className={"col-4 px-0"}>
          <Input type="number" value={this.state.defaultConfig.pageSize} className={"p-0 text-right"}
          onChange={(e) => this.changeRowCount(e)} />
          </div>
          </div>
          {
            this.props.refreshAutomaticoBtn &&
            <div className={"row mx-0"} style={checkStyle}>
            <div className={"col-8 px-0"}>
            <Label for="refreshAutomaticoConfig" className="w-100 h-100 m-0">Actualiza X Seg.</Label>
            </div>
            <div className={"col-4 px-0"}>
            <Input name="refreshAutomaticoConfig"
            type="number"
            defaultValue={this.state.refreshAutomaticoEnabled}
            className={"p-0 text-right"}
            onChange={(evt) => this.setState({refreshAutomaticoBtnTimer:evt.target.value})}
            onBlur={()=> this.updateRefreshAutomaticoBtn(this.state.refreshAutomaticoEnabled, this.state.refreshAutomaticoBtnTimer)}
             />
            </div>
            </div>
          }
          {
            !this.state.cardsMode &&
            <Fragment>
            <DropdownItem header>Columnas</DropdownItem>
            {checks}
            </Fragment>
          }
          </DropdownMenu>
          </Dropdown>

          {
            this.state.cardsMode &&
            <div className="d-inline-block position-relative">
            <button
            id="cardsConfig"
            className="icon btn rounded btn-secondary btn-sm h-100"
            onClick={this.toggleCardsDisplay}
            >
            <i className={'fa fa-lg' + (this.state.resaltarImagenes ? ' fa-th-large' : ' fa-picture-o')}></i>
            <UncontrolledTooltip placement="bottom" target="cardsConfig">
            {this.state.resaltarImagenes ? 'Ver uniforme' : 'Resaltar imágenes'}
            </UncontrolledTooltip>
            </button>
            </div>
          }

          </div>

          </div>
          </div>
        );
      }
    };

    module.exports = ParadigmaTableHeader;

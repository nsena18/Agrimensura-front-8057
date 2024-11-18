import React, { Component } from "react";
import axios from "axios";
import PropTypes from "prop-types";

import apiFunctions from "../../api/functions.js";
import auth from "../../auth/";

import ReactTable from "react-table";
import "react-table/react-table.css";

import "./ParadigmaTable.scss";

import ParadigmaModal from "../ParadigmaModal";
import ParadigmaTableHeader from "./ParadigmaTableHeader.js";

var filterTimeout = null;
var columnsChangedTimeout = null;

import { UncontrolledTooltip } from "reactstrap";
import CardTable from './CardTable/CardTable';

class ParadigmaTable extends Component {
	constructor(props) {
		super(props);
		const { defaultPageSize, modernTheme } = this.props;
		this.state = {
			data: [],
			pages: null,
			loading: true,
			selectedRows: [],
			selectedRow: null,
			firstLoad: true,
			tableState: null,
			columns: this.props.columns,
			tableColumns: this.props.columns,
			resizedColumns: null,
			total: 0,
			totalFiltered: 0,
			showing: 0,
			defaultConfig: {
				pageSize: defaultPageSize ? defaultPageSize : modernTheme ? 26 : 29
			}
		};
		this.fetchData = this.fetchData.bind(this);
	}

	static propTypes = {
		buttons: PropTypes.any,
		apiUrl: PropTypes.any.isRequired,
		columns: PropTypes.any.isRequired,
		exportUrl: PropTypes.any.isRequired,
		title: PropTypes.string.isRequired,
		multiSelect: PropTypes.bool,
		ctrlKeyMultiSelect:PropTypes.bool,
		outerFilter: PropTypes.array,
		outerSort: PropTypes.array,
		customSearchElement: PropTypes.any,
		defaultPageSize: PropTypes.number,
		specifyPageInTable:PropTypes.bool,
		modernTheme: PropTypes.bool,
		refreshAutomaticoBtn: PropTypes.bool,
		refreshAutomaticoBtnTimer: PropTypes.number,
		/** Propiedad que determina si la tabla se muestra en modo cards */
		cards: PropTypes.bool,
		/** Propiedad con configuraciones para el card: */
		cardsConfig: PropTypes.shape({
			/** imageField: string para acceder al campo de imagen */
			imageField: PropTypes.string,
			/** titleField: string para acceder al campo de título */
			titleField: PropTypes.string,
			/** subtitleField: string para acceder al campo de subtítulo */
			subtitleField: PropTypes.string,
			/** anchorField: si está definido convierte la card en un link. String para acceder al campo href */
			anchorField: PropTypes.string,
			/** groupBy: función para determinar el criterio usado para agrupar las cards */
			groupBy: PropTypes.func
		})
	};

	requestData = (pageSize, page, sorted, filtered, columns) => {
		var getUrl = this.props.apiUrl;

		let parameters = {};

		if (pageSize) parameters.pageSize = pageSize;
		if (page) parameters.page = page;

		let fields = columns.map(x => {
										if(x.columns)
											return x.columns.filter(x=> x.ignoreAsField===undefined || x.ignoreAsField === null || x.ignoreAsField === false).map(x =>  x.id);
										else if(x.ignoreAsField===undefined || x.ignoreAsField === null || x.ignoreAsField === false)
											return x.id
										else
											return null
										}).filter(x => x !== undefined && x !== null);
		if (fields.length > 0) parameters.fields = fields;

		let sort = sorted.map(x => (x.desc ? "-" : "") + x.id);
		if (sort.length > 0) parameters.sort = sort;

		let filters = filtered.map(filter => {
			const data = filter.value;
			if (typeof data === "object") {
				return (data.lookup!=null) ? `${filter.id}[${data.lookup}]=${data.input}` : `${filter.id}=${data.input}`;
			} else if (!data) { // en caso en que no se envíen datos en el filtro, se resetea
				return;
			} else {
				const column = columns.find(col => col.id === filter.id);
				if (column && column.lookup) {
					return `${filter.id}[${column.lookup}]=${data}`;
				}
				return filter.id + "[icontains]=" + data;
			}
		}).filter(filter => !!filter); // filtra los vacíos
		if (filters.length > 0) parameters.filters = filters;

		return apiFunctions.get(getUrl, null, this.props.depth, parameters);

		return axios.get(getUrl, auth.header()).then(function (response) {
			return response.data;
		});
	};

	fetchData(state, instance) {
		let { selectedRow } = this.state;
		var self = this;
		self.setState({ tableState: state });
		if (filterTimeout != null) {
			clearInterval(filterTimeout);
		}
		filterTimeout = setTimeout(function () {
			self.setState({ loading: true });
			self
				.requestData(
					self.state.defaultConfig.pageSize,
					state.page,
					state.sorted,
					state.filtered,
					self.state.tableColumns
				)
				.then(res => {
					if (!self.props.multiSelect) {
						selectedRow = selectedRow ? res.data.filter(x => x.id === selectedRow.id) : null;
						if (selectedRow && selectedRow.length) {
							selectedRow = selectedRow[0];
							selectedRow.selected = true;
						} else {
							selectedRow = null;
						}
						self.setState({
							data: res.data,
							pages: res.meta.totalPages,
							loading: false,
							selectedRow: selectedRow,
							total: res.meta.totalRows,
							totalFiltered: res.meta.totalRowsFiltered,
							totalShow: res.meta.rows
						});
					} else {
						if (self.state.selectedRows.length > 0) {
							res.data.forEach(x => {
								self.state.selectedRows.forEach(y => {
									if (x.id == y.id) x.selected = true;
								});
							});
						}
						self.setState({
							data: res.data,
							pages: res.meta.totalPages,
							loading: false,
							total: res.meta.totalRows,
							totalFiltered: res.meta.totalRowsFiltered,
							totalShow: res.meta.rows
						});
					}
				});
		}, self.state.firstLoad ? 0 : 500);
		if (self.state.firstLoad) {
			self.setState({ firstLoad: false });
		}
	}
	/*
	onRowClick(e, t, rowInfo) {
		this.setState(oldState => {
			let data = oldState.data.slice();
			let copy = Object.assign({}, data[rowInfo.index]);

			for (var i = 0; i < data.length; i++) {
				if (i == rowInfo.index) {
					data[i].selected = !data[i].selected;
					if (data[i].selected) {
						if (this.props.multiSelect) this.state.selectedRows.push(data[i]);
						this.state.selectedRow = data[i];
					} else {
						if (this.props.multiSelect)
							this.state.selectedRows = this.state.selectedRows.filter(
								x => x.id != data[i].id
							);
						else this.state.selectedRow = null;
					}
				} else if (!this.props.multiSelect) data[i].selected = false;
			}
			return {
				data: data
			};
		});
	}
	*/
	onRowClick(e, t, rowInfo) {
		let multiSelectEnabled = e.ctrlKey && this.props.multiSelect && this.props.ctrlKeyMultiSelect;
		this.setState(oldState => {
			let data = oldState.data.slice();
			let copy = Object.assign({}, data[rowInfo.index]);

			for (var i = 0; i < data.length; i++) {
				if (i == rowInfo.index) {
					data[i].selected = !data[i].selected;
					if (data[i].selected) {
						if (multiSelectEnabled) this.state.selectedRows.push(data[i]);
						else this.state.selectedRows = [data[i]];
						this.state.selectedRow = data[i];
					} else {
						if (multiSelectEnabled)
							this.state.selectedRows = this.state.selectedRows.filter(
								x => x.id != data[i].id
							);
						else{
							this.state.selectedRow = null;
							this.state.selectedRows = this.state.selectedRows.filter(
								x => x.id != data[i].id
							);
						}
					}
				} else if (!multiSelectEnabled) data[i].selected = false;
			}
			return {
				data: data
			};
		});
	}

	getSelectedRow() {
		if (this.state.selectedRow != null) return this.state.selectedRow;
		else return null;
	}

	getSelectedRows() {
		if (this.state.selectedRows.length > 0) return this.state.selectedRows;
		else return false;
	}

	unselectAll(callback = null) {
		this.setState({
			selectedRows: [],
			selectedRow: null
		}, () => {
			if (callback) callback();
		});
	}

	getSelectedId() {
		var row = this.getSelectedRow();
		if (row) return row.id;
		else return false;
	}

	getSelectedIds() {
		var rows = this.getSelectedRows();
		if (rows.length > 0) return rows.map(x => x.id);
		else return false;
	}

	updateTable() {
		this.fetchData(this.state.tableState);
	}

	columnsChanged(newcolumns) {
		this.setState({ tableColumns: newcolumns });
		this.updateTable();
	}

	columnsResizeChanged(newResized) {
		var self = this;
		if (columnsChangedTimeout != null) {
			clearInterval(columnsChangedTimeout);
		}
		columnsChangedTimeout = setTimeout(function () {
			self.setState({ resizedColumns: newResized });
		}, 100);
	}

	export(format, mode, landscape) {
		const { pageSize } = this.state.defaultConfig;
		const { page, sorted, filtered } = this.state.tableState;
		const { tableColumns } = this.state;

		let url = this.props.apiUrl;
		url += url.slice(-1) === '/' ? 'export/' : '/export/';

		let parameters = {};

		parameters["fields"] = [];
		if (pageSize) parameters["pageSize"] = pageSize;
		if (page) parameters["page"] = page;

		tableColumns.filter(x => !x.private).filter(x=>x.ignoreAsField === undefined || x.ignoreAsField === null || x.ignoreAsField === false).filter(x => x.show).map(x =>
			{ if (x.columns)
				return x.columns.filter(x => x.show).map(x => 	(parameters["fields"].push({
												id: x.id,
												name: x.Header,
												width: x.width,
												exportWidth: x.exportWidth,
												exportCurrency: x.exportCurrency,
											}))
									)
			else
				return (parameters["fields"].push({
					id: x.id,
					name: x.Header,
					width: x.width,
					exportWidth: x.exportWidth,
					exportCurrency: x.exportCurrency,
				}))

			});

		const sort = sorted.map(x => (x.desc ? "-" : "") + x.id);
		if (sort.length > 0) parameters["sort"] = sort;

		parameters["filters"] = filtered.map(x => {
			const data = x.value;
			if (typeof data === "object") {
				return {
					id: x.id,
					lookup: data.lookup,
					input: data.input,
				}
			} else {
				const column = tableColumns.find(col => col.id === x.id);
				if (column && column.lookup) {
					return {
						id: x.id,
						lookup: column.lookup,
						input: data,
					}
				} else {
					return {
						id: x.id,
						lookup: 'icontains',
						input: data,
					}
				}
			}
		});

		if (format) parameters["format"] = format;
		if (mode) parameters["mode"] = mode;
		if (landscape) parameters["landscape"] = landscape;

		apiFunctions.post(url, null, parameters, (data) => {
			window.open(url + data.data.tokenreport);
		},
		//temporal por status=200
		(data) => {
				window.open(url + data.data.tokenreport);
		});

	}

	gotoFirstPage(){
		this.setState(
			prevState=>{
				if(prevState.tableState != undefined && prevState.tableState != null){
					if(prevState.tableState.page != undefined && prevState.tableState.page != null){
						let state = prevState.tableState;
						state.page = 0;
						prevState.tableState = state;
					}
				}
				return prevState;
			},
			()=> this.updateTable()
		);
	}

	configChanged(config) {
		var tableState = this.state.tableState;
		tableState.pageSize = config.pageSize;
		this.setState({ defaultConfig: config });
		this.updateTable();
	}

	// si se modifica la props apiUrl actualizo la tabla y si se modifica las columnas actualizo los states
	componentWillReceiveProps(nextProps) {
		if (this.props.apiUrl != nextProps.apiUrl) {
			this.updateTable()
		}
		if(this.props.columns != nextProps.columns){
			this.setState({
				columns: nextProps.columns,
				tableColumns: nextProps.columns,
			})
		}
	}

	render() {
		const { data, pages, loading } = this.state;
		const { cards, cardsConfig, specifyPageInTable } = this.props;
		var toolbarButtons = [];
		let createButton = [];
		let additionalProps = {};
		if (specifyPageInTable != undefined && specifyPageInTable != null && specifyPageInTable == true){
			additionalProps.page = this.state.tableState ? this.state.tableState.page : 0;
		}
		for (var i = 0; i < this.props.buttons.length; i++) {
			var button = this.props.buttons[i];
			var addButton = false;
			if (button.permission != undefined) {
				if (auth.hasPermission(button.permission)) addButton = true;
			} else addButton = true;
			if (addButton) {
				if (button.edit) {
					toolbarButtons.push(
						<button.component
							key={"toolbar" + i}
							onSubmit={() => this.updateTable()}
							row={() => this.getSelectedRow()}
							id={() => this.getSelectedId()}
						/>
					);
				} else if (button.delete) {
					toolbarButtons.push(
						<button.component
							key={"toolbar" + i}
							onSubmit={() => {
								this.unselectAll(() => {
									this.updateTable();
								});
							}}
							id={() => this.getSelectedId()}
						/>
					);
				} else if (button.createmultiSelect) {
					toolbarButtons.push(
						<button.component
							key={"toolbar" + i}
							onSubmit={() => {
								this.unselectAll(() => {
									this.updateTable();
								});
							}}
							rows={() => this.getSelectedRows()}
							multiSelectIDs={() => this.getSelectedIds()}
						/>
					);
				} else if (button.create) {
					createButton.push(
						<button.component
							key={"toolbar" + i}
							onSubmit={() => this.updateTable()}
							row={() => this.getSelectedRow()}
							id={() => this.getSelectedId()}
						/>
					);
				} else if (button.detail) {
					toolbarButtons.push(
						<button.component
							key={"toolbar" + i}
							row={() => this.getSelectedRow()}
							id={() => this.getSelectedId()}
						/>
					);
				} else if (button.separator) {
					toolbarButtons.push(
						<div key={"separator" + i} className="btn btn-separator" />
					);
				}
			}
		}
		const { modernTheme } = this.props;
		return (
			<div className={`${modernTheme ? 'modern-theme' : ''} ${cards && cardsConfig ? 'card-container' : ''}`}>
				<div className="rt-thead -header mt-1 rt-button-header">
					<ParadigmaTableHeader
						title={this.props.title}
						resizedColumns={this.state.resizedColumns}
						listColumns={this.state.columns}
						defaultConfig={this.state.defaultConfig}
						onChange={newcolumns => this.columnsChanged(newcolumns)}
						onExport={(format, mode, landscape) =>
							this.export(format, mode, landscape)
						}
						showExport={cards && cardsConfig ? false : this.props.exportUrl ? true : false}
						onConfigChanged={config => this.configChanged(config)}
						toolbarButtons={!(cards && cardsConfig) ? createButton.concat(toolbarButtons) : createButton}
						onUpdate={e => this.updateTable()}
						multiselect={this.props.multiselect}
						total={{
							show: this.state.totalShow,
							filtered: this.state.totalFiltered,
							total: this.state.total,
							selected: this.state.selectedRows.length
						}}
						cardsMode={cards && cardsConfig}
						toggleCardsDisplay={resaltarImagenes => this.setState({ resaltarImagenes })}
						btnHelp={(this.props.btnHelp) ? (this.props.btnHelp) : null}
						refreshAutomaticoBtn={this.props.refreshAutomaticoBtn ? this.props.refreshAutomaticoBtn : false }
						refreshAutomaticoBtnTimer={this.props.refreshAutomaticoBtnTimer ? this.props.refreshAutomaticoBtnTimer : 60}
					/>
				</div>

				{this.props.customSearchElement != null &&
					this.props.customSearchElement}

				{
					cards && cardsConfig ?
						<CardTable
							buttons={toolbarButtons}
							imageField={cardsConfig.imageField}
							titleField={cardsConfig.titleField}
							subtitleField={cardsConfig.subtitleField}
							anchorField={cardsConfig.anchorField}
							group={cardsConfig.groupBy}
							data={data}
							onFetchData={this.fetchData}
							pageSize={this.state.defaultConfig.pageSize}
							totalRows={this.state.total}
							sorted={this.props.outerSort}
							resaltarImagenes={this.state.resaltarImagenes}
						/> :

						<ReactTable
							columns={this.state.tableColumns
								.concat({
								width:20,
								resizable: true,
								filterable: false,
								value: null,
							})
						}
							showPageSizeOptions={false}
							previousText={"Anterior"}
							nextText={"Siguiente"}
							pageText={"Página"}
							ofText={"de"}
							noDataText="No se encontraron filas."
							defaultSorted={this.props.outerSort}
							defaultFiltered={this.props.outerFilter}
							manual
							data={data}
							pages={pages}
							loading={loading}
							onFetchData={this.fetchData}
							filterable
							defaultPageSize={this.state.defaultConfig.pageSize}
							pageSize={this.state.defaultConfig.pageSize}
							className="-striped -highlight"
							onResizedChange={(newResized, event) =>
									 this.columnsResizeChanged(newResized)
							}
							getTrProps={(state, rowInfo, column) => {
								return {
									onClick: (e, t) => {
										this.onRowClick(e, t, rowInfo);
									},
									onDoubleClick: (e, t) => {
										if (this.props.doubleClickAction){
											if(this.getSelectedId()==false){
												this.onRowClick(e, t, rowInfo);
											}
											setTimeout(()=>{this.props.doubleClickAction()}, 50)

										}
									},
									style: {
										background:
											rowInfo && rowInfo.original.selected ? "#1c2d42" : "",
										color: rowInfo && rowInfo.original.selected ? "white" : ""
									}
								};
							}}
							{...additionalProps}
						/>
				}
			</div>
		);
	}
}

export default ParadigmaTable;

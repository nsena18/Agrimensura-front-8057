import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from "axios";


import api from '../../../api/';
import auth from '../../../auth/';
var getUrl = api.usuarios.permisos + "?fields=id,descripcion,permisos&padre[isnull]=1";

import CheckboxTree from "./CheckboxTree";

class PermisosListSelect extends Component {
    constructor() {
        super();

        this.state = {
            checked: [],
            expanded: [],
            options: []
        };

        this.getOptions();
    }

    static propTypes = {
        onChange: PropTypes.func,
        checked: PropTypes.any,
        disabled: PropTypes.bool,
        disabledNodes: PropTypes.any,
    }

    IterateOptions(options, checked, disabledOptions, forceDisabled) {
        for (var i = 0; i < options.length; i++) {
            var option = options[i];
            if (disabledOptions.filter(x => x == option.value).length > 0) {
                option.disabled = true;
                checked[checked.length] = option.value;
            }
            else if (forceDisabled) {
                option.disabled = true;
            }

            var children = option.children;

            if (children && children.length) {
                var newresults = this.IterateOptions(children, checked, disabledOptions, forceDisabled);
                children = newresults.options;
                checked = newresults.checked;

                if (children.filter(x => x.disabled).length == children.length) {
                    option.disabled = true;
                    //checked[checked.length] = option.value;
                }
            }
        }
        return { options: options, checked: checked };
    }

    RemoveNotSelected(options, checked) {
        var newoptions = [];
        for (var i = 0; i < options.length; i++) {
            var option = options[i];
            if (option.children && option.children.length > 0) {
                option.children = this.RemoveNotSelected(option.children, checked);
                if (option.children.length > 0)
                    newoptions[newoptions.length] = option;
            } else {
                if (checked.filter(x => x == option.value).length > 0)
                    newoptions[newoptions.length] = option;
            }
        }
        return newoptions;
    }

    DisableOption(options, checked, disabledOptions) {
        if (this.props.disabled) {
            var newresults = this.IterateOptions(options, checked, disabledOptions, true);
            options = newresults.options;
            checked = newresults.checked;
            options = this.RemoveNotSelected(options, checked);
            return { options: options, checked: checked };
        }
        return this.IterateOptions(options, checked, disabledOptions, false);
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.options.length > 0) {
            this.setState({
                checked: nextProps.checked,
            });
        }
    }

    ResetState() {
        this.setState({
            checked: this.props.checked,
        });
    }

    DataAdapter(data, label, value, children) {
        let reply = [];
        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            let adaptedItem = {
                'label': item[label].toString(),
                'value': item[value].toString(),
            };
            if (item[children] && item[children].length > 0) {
                adaptedItem['children'] = this.DataAdapter(item[children], label, value, children);
            }
            reply.push(adaptedItem);
        }
        return reply;
    }

    getOptions = function () {
        var self = this;
        axios.get(getUrl, auth.header())
            .then((response) => {
                var options = this.DataAdapter(response.data.data, 'descripcion', 'id', 'permisos');
                this.setState({ options: options });
                if (this.props.checked)
                    setTimeout(() => this.ResetState(), 100);
            });
    };

    onChange = function (checked) {
        this.setState({ checked }, () => {
            if (this.props.onChange) {
                this.props.onChange(checked);
            }
        });
    }

    render() {
        const { options } = this.state;
        const { checked, disabled, disabledNodes } = this.props;
        return (
            <CheckboxTree
                disabled={disabled}
                options={options}
                checked={checked}
                disabledNodes={disabledNodes}
                onlyChecked={disabled}
                onChange={(checked) => this.onChange(checked)}
            />
        );
    }
};


module.exports = PermisosListSelect;
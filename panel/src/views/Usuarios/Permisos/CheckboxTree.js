import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import axios from "axios";


import api from '../../../api/';
import auth from '../../../auth/';
var getUrl = api.usuarios.permisos + "?fields=id,descripcion,permisos&padre[isnull]=1";

class LeafComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    static propTypes = {
        node: PropTypes.object,
        onCheck: PropTypes.func,
        disabled: PropTypes.bool,
        onlyChecked: PropTypes.bool,
    }

    render() {
        const { node, onCheck, disabled, onlyChecked } = this.props;
        return <li className="rct-node rct-node-leaf">
            <span className="rct-text">
                <span className="rct-collapse"><span className="rct-icon"></span></span>
                <label
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!disabled)
                            onCheck(node.value);
                    }}
                    for={"rct-PykOE0p-" + node.value}>
                    {!disabled ?
                        <input id={"rct-PykOE0p-" + node.value} type="checkbox" />
                        : null}
                    {!disabled ?
                        <span className="rct-checkbox"><span className={"rct-icon rct-icon-" + (!node.checked ? "uncheck" : (node.checked === 1 ? "check" : "half-check"))}></span></span>
                        : null}
                    <span className="rct-node-icon">
                        <span className="rct-icon rct-icon-leaf"></span>
                    </span>
                    <span className="rct-title">{node.label}</span>
                </label>
            </span>
        </li>
    }
}

class NodeComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    static propTypes = {
        node: PropTypes.object,
        onCheck: PropTypes.func,
        onExpand: PropTypes.func,
        disabled: PropTypes.bool,
        onlyChecked: PropTypes.bool,
    }

    render() {
        const { node, onCheck, onExpand, disabled, onlyChecked } = this.props;
        return <li className="rct-node rct-node-parent">
            <span className="rct-text">
                <button
                    onClick={() => onExpand(node.value)}
                    aria-label="Toggle" className="rct-collapse rct-collapse-btn" title="Toggle" type="button">
                    <span className={"rct-icon rct-icon-expand-" + (node.expanded ? "open" : "close")}></span>
                </button>
                <label
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (!disabled)
                            onCheck(node.value);
                    }}
                    for={"rct-PykOE0p-" + node.value}>
                    {!disabled ?
                        <input id={"rct-PykOE0p-" + node.value} type="checkbox" />
                        : null}
                    {!disabled ?
                        <span className="rct-checkbox"><span className={"rct-icon rct-icon-" + (!node.checked ? "uncheck" : (node.checked === 1 ? "check" : "half-check"))}></span></span>
                        : null}
                    <span className="rct-node-icon"><span className={"rct-icon rct-icon-parent-" + (node.expanded ? "open" : "close")}></span></span>
                    <span className="rct-title">{node.label}</span>
                </label>
            </span>
            {node.expanded ?
                <ol>
                    {node.children.filter(x => onlyChecked ? x.checked || x.disabled : true).map((x, i) => {
                        if (x.children && x.children.length) {
                            return <NodeComponent
                                disabled={disabled || x.disabled}
                                key={i}
                                node={x}
                                onCheck={(value) => onCheck(value)}
                                onExpand={(value) => onExpand(value)}
                                onlyChecked={onlyChecked}
                            />;
                        } else {
                            return <LeafComponent
                                disabled={disabled || x.disabled}
                                key={i}
                                node={x}
                                onCheck={(value) => onCheck(value)}
                            />;
                        }
                    })}
                </ol> : null}
        </li>;
    }

}

class CheckboxTree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
            optionMap: []
        };
    }

    static propTypes = {
        onChange: PropTypes.func,
        checked: PropTypes.any,
        disabled: PropTypes.bool,
        disabledNodes: PropTypes.any,
        onlyChecked: PropTypes.bool,
    }



    componentWillUpdate(nextProps, nextState) {
        let changed = false;
        let optionsChanged = false;

        let { options, optionMap } = this.state;
        let { disabledNodes, checked } = this.props;

        if (nextProps.options != this.props.options) {
            changed = true;
            optionsChanged = true;
            options = nextProps.options;
            optionMap = this.createOptionsMap(options);
        }

        if (options.length) {
            checked = this.getAllCheckedLeafs(options).map(x => x.value);
            if (!this.IsArrayEqual(nextProps.checked, checked) || !this.IsArrayEqual(nextProps.disabledNodes, disabledNodes) || optionsChanged) {
                changed = true;
                checked = nextProps.checked;
                if (checked && checked.length) {
                    checked.forEach(value => {
                        options = this.processCheckOption(options, optionMap, value + "");
                    });
                }
                else options = this.uncheckAll(options);
                checked = this.getAllCheckedLeafs(options).map(x => x.value);

                disabledNodes = nextProps.disabledNodes;
                if (disabledNodes && disabledNodes.length) {
                    disabledNodes.forEach(value => {
                        options = this.processDisableOption(options, optionMap, value + "");
                    });
                }
                else {
                    options = this.undisableAll(options);
                }
            }
        }

        if (changed)
            this.setState({ options, optionMap });
    }

    IsArrayEqual(ar1 = [], ar2 = []) {
        if (ar1 === null || ar1 === undefined || ar2 === null || ar2 === undefined)
            return false;
        else if (ar1.length != ar2.length)
            return false;
        else if (ar1.filter(x => ar2.map(y => y + "").indexOf(x + "") == -1).length > 0)
            return false;
        return true;
    }

    createOptionsMap(options, parent = []) {
        let optmap = [];
        options.forEach((x, i) => {
            optmap.push({
                value: x.value,
                parent: parent,
                index: i,
            });

            if (x.children && x.children.length) {
                let new_parent = Array.from(parent);
                new_parent.push(i);
                this.createOptionsMap(x.children, new_parent).forEach(x => optmap.push(x));
            }
        });
        return optmap;
    }

    iterateChildCheck(option, check = true) {
        if (option.children && option.children.length) {
            option.checked = check;
            option.children.forEach(x => {
                x = this.iterateChildCheck(x, check);
            });
        } else {
            option.checked = check;
        }
        return option;
    }

    uncheckAll(options) {
        options.forEach(x => {
            x.checked = false;
            if (x.children && x.children.length) {
                x.children = this.uncheckAll(x.children);
            }
        });
        return options;
    }

    undisableAll(options) {
        options.forEach(x => {
            x.disabled = false;
            if (x.children && x.children.length) {
                x.children = this.undisableAll(x.children);
            }
        });
        return options;
    }

    processCheckOption(options, optionMap, value) {
        const position = optionMap.find(x => x.value === value);
        let parent = options;
        position.parent.forEach(x => parent = parent[x].children); // me da el array de hermanos
        let option = parent[position.index];
        option.checked = !option.checked ? 1 : (option.checked === 1 ? false : 1);
        option = this.iterateChildCheck(option, option.checked);

        position.parent.forEach((x, i, ar) => {
            parent = options;
            position.parent.filter((y, j) => j < ar.length - i).forEach((y, j) => {
                parent = parent[y];

                if (j + 1 < ar.length - i)
                    parent = parent.children;
            })

            if (parent.children.filter(x => x.checked === 1 || x.disabled).length === parent.children.length)
                parent.checked = 1;
            else if (parent.children.filter(x => x.checked || x.disabled).length)
                parent.checked = 2;
            else
                parent.checked = false;
        })

        return options;
    }


    iterateChildDisable(option, disabled = true) {
        option.disabled = true;
        if (option.children && option.children.length) {
            option.children.forEach(x => {
                x = this.iterateChildDisable(x, true);
            });
        }
        return option;
    }

    processDisableOption(options, optionMap, value) {
        const position = optionMap.find(x => x.value === value);
        let parent = options;
        position.parent.forEach(x => parent = parent[x].children); // me da el array de hermanos
        let option = parent[position.index];
        option.disabled = true;
        option = this.iterateChildDisable(option, option.disabled);

        position.parent.forEach((x, i, ar) => {
            parent = options;
            position.parent.filter((y, j) => j < ar.length - i).forEach((y, j) => {
                parent = parent[y];
                if (j + 1 < ar.length - i) parent = parent.children;
            })

            if (parent.children.filter(x => x.disabled).length === parent.children.length)
                parent.disabled = true;
            if (parent.children.filter(x => x.checked === 1 || x.disabled).length === parent.children.length)
                parent.checked = 1;
            else if (parent.children.filter(x => x.disabled || x.checked).length)
                parent.checked = 2;
            else
                parent.disabled = false;
        })

        return options;
    }

    getAllCheckedLeafs(options) {
        let checked = [];
        options.forEach(x => {
            if (x.checked)
                if (x.children && x.children.length) {
                    this.getAllCheckedLeafs(x.children).forEach(x => checked.push(x));
                } else {
                    checked.push(x);
                }
        });
        return checked;
    }

    checkOption(value) {
        this.setState(prevState => {
            prevState.options = this.processCheckOption(prevState.options, prevState.optionMap, value);
            prevState.checked = this.getAllCheckedLeafs(prevState.options).map(x => x.value);
            return prevState;
        }, () => {
            const { onChange } = this.props;
            const { checked } = this.state;
            if (onChange) onChange(checked);
        });
    }

    expandOption(value) {
        this.setState(prevState => {
            const position = prevState.optionMap.find(x => x.value === value);
            let parent = prevState.options;
            position.parent.forEach(x => parent = parent[x].children); // me da el array de hermanos
            parent[position.index].expanded = !parent[position.index].expanded;
            return prevState;
        });
    }

    render() {
        const { options } = this.state;
        const { disabled, onlyChecked } = this.props;
        return (
            <div className="react-checkbox-tree" >
                <ol>
                    {options.filter(x => onlyChecked ? x.checked || x.disabled : true).map((x, i) => {
                        if (x.children && x.children.length)
                            return <NodeComponent
                                disabled={disabled || x.disabled}
                                key={i}
                                node={x}
                                onCheck={(value) => this.checkOption(value)}
                                onExpand={(value) => this.expandOption(value)}
                                onlyChecked={onlyChecked}
                            />;
                        else
                            return <LeafComponent
                                disabled={disabled || x.disabled}
                                key={i}
                                node={x}
                                onCheck={(value) => this.checkOption(value)}
                            />;
                    })}
                </ol>
            </div>
        );
    }
};


module.exports = CheckboxTree;
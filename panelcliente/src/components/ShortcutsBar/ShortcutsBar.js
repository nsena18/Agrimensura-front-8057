import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import { Button } from 'reactstrap';

import ShortcutButton from './ShortcutButton';
import ShortcutDelete from './ShortcutDelete';

import './Shortcuts.css';

/**
 * Barra para agregar accesos directos.  
 * Requiere estar en un componente que sea hijo de DragDropContextProvider para funcionar.
 */
class ShortcutsBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            buttons: [],
            components: []
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // Si se agregó un nuevo shortcut, la barra permanece abierta
        if (prevState.buttons.length < this.state.buttons.length) {
            this.setState({
                isOpen: true
            });
        }
    }

    onShortcutRemove = (item) => {
        this.setState(prevState => ({
            buttons: prevState.buttons.filter(btn => btn != item)
        }));
    }

    onBarToggle = (e) => {
        e.preventDefault();
        this.setState(prevState => ({
            isOpen: !prevState.isOpen
        }));
    }

    render() {
        const { connectDropTarget } = this.props;
        return connectDropTarget(
            <div className={'shortcut-bar' + (this.state.isOpen || this.props.canDrop ? ' shortcut-bar--open' : '')}>

                <Button
                    color="primary"
                    className="shortcut-bar__toggle-btn rounded-circle"
                    onClick={this.onBarToggle}
                >
                    <i className="fa fa-bookmark"></i>
                </Button>
                
                <ShortcutDelete />
                
                { this.state.buttons.map((btn, i) => 
                        <ShortcutButton
                            item={btn}
                            key={i}
                            onShortcutRemove={this.onShortcutRemove}
                        />
                ) }

                { this.state.components.map((item, i) => 
                        <item.component 
                            nav={item}
                            key={i}
                        />
                ) }
            </div>
        );
    }
}

const shortcutTarget = {
    
    drop(props, monitor, component) {
    
        const item = monitor.getItem();
        
        if (item.component) {
            component.setState(prevState => ({
                components: prevState.components.concat(item)
            }));
        } else 
        if (item.name) {
            component.setState(prevState => ({
                buttons: prevState.buttons.concat(item)
            }));
        }
    
        return item;
      }
}  

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        canDrop: monitor.canDrop(),
        didDrop: monitor.didDrop()
    };
}

export default DropTarget('navlink', shortcutTarget, collect)(ShortcutsBar);
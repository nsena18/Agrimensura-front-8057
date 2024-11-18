import React from 'react';
import { Button } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { DragSource } from 'react-dnd';

/**
 * Botón que se genera cuando se agrega un nuevo item a la barra
 * @prop item: object.
 * @prop connectDragSource
 */
const ShortcutButton = props => {
    const { item, connectDragSource } = props;
    return connectDragSource(
        <div>
            <NavLink to={item.url}>
                <Button color="primary"
                    className="shortcut-bar__shortcut-btn"
                >
                    <i className={item.icon || item.parentIcon}></i> {' '}
                    {item.name}
                </Button>
            </NavLink>
        </div>
    );
}

/**
 * spec: object. Required.  
 * It describes how the drag source reacts to the drag and drop events.
 *   
 * * **Specification Methods**:  
 * - beginDrag(props, monitor, component): required
 * - endDrag(props, monitor, component): optional
 * - canDrag(props, monitor): optional
 * - isDragging(props, monitor): optional
 */
const cardSource = {
    beginDrag(props) {
        return {
            name: props.item.name,
            icon: props.item.icon,
            url: props.item.url
        };
    },
    endDrag(props, monitor, component) {
        if (monitor.didDrop()) {
            props.onShortcutRemove(props.item);
        }
    }
};

/**
 * collect: function. Required.  
 * It should return a plain object of the props to inject into your component.
 * It receives two parameters: connect and monitor.
 */
function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource()
    };
}

export default DragSource('shortcut', cardSource, collect)(ShortcutButton);
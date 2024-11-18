import React from 'react';
import { DropTarget } from 'react-dnd';
import { Button } from 'reactstrap';

/**
 * Botón que aparece cuando se arrastra un ShortcutButton para eliminarlo
 * @prop canDrop: indica cuándo se empieza a arrastrar un ShortcutButton
 * @prop connectDropTarget
 */
const ShortcutDelete = props => {
    const { canDrop, connectDropTarget } = props;
    return connectDropTarget(
        <div>
            <Button
                color="danger"
                className={
                    'shortcut-bar__delete-btn rounded-circle'
                    + (canDrop ? ' shortcut-bar__delete-btn--open' : '')
                }
            >
                <i className="fa fa-trash"></i>
            </Button>
        </div>
    );
}

/**
 * spec: object. Required.  
 * It describes how the drop target reacts to the drag and drop events.
 *   
 * * **Specification Methods**:  
 * - drop(props, monitor, component)
 * - hover(props, monitor, component)
 * - canDrop(props, monitor)
 */
const deleteTarget = {
    
}  

/**
 * collect: function. Required.  
 * It should return a plain object of the props to inject into your component.
 * It receives two parameters: connect and monitor.
 */
function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        canDrop: monitor.canDrop(),
    };
}

export default DropTarget('shortcut', deleteTarget, collect)(ShortcutDelete);
import invariant from 'invariant';

function isValid(value, length) {
    return Array.isArray(value) && value.length === length && value.every(Number.isFinite);
}

export default function ArrayLengthOf(length) {
    return (props, propName, componentName) => {
        if (!props) return;
        if (Array.isArray(props)) {
            invariant(
                isValid(props, length),
                `Array is ${props}, but needs to be an array of ${length} numbers`
            );
        }

        const value = props;

        if (!value) return;

        invariant(isValid(value, length), `${componentName} ${propName} needs to be an array of ${length} numbers`);
    };
}
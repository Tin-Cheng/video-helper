import React from 'react';

import styles from './TextInput.module.css';

const TextInput = ({ className, type = 'text', ...rest }) => {
    return (
        <input className={`${styles.input} ${className}`} type={type} {...rest} />
    );
};

export default TextInput;

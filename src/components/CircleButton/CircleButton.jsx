import React from 'react';

import styles from './CircleButton.module.css';

const CircleButton = ({
    label,
    onClick,
}) => {
    return (
        <button className={styles.circleButton} onClick={onClick}>
            <span className={styles.buttonOverlay} />
            <span className={styles.buttonBackground1} />
            {/* <span className={styles.buttonBackground2} /> */}
            <span className={styles.buttonContent}>{label}</span>
        </button>
    );
};

export default CircleButton;
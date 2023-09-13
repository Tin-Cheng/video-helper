import React, {
    useCallback,
    useState,
} from 'react';

import addSeconds from '../../chromeActions/addSeconds';

import styles from './Jumper.module.css';

const Jumper = () => {
    const [input, setInput] = useState('85');

    const handleInputChange = useCallback((event) => {
        setInput(event.target.value);
    }, []);

    const handlePrevSkipClick = useCallback(() => {
        // chromeAgents.
        addSeconds(undefined, -parseFloat(input));
    }, [input]);

    const handleForwardSkipClick = useCallback(() => {
        addSeconds(undefined, parseFloat(input));
    }, [input]);

    return (
        <div className={styles.jumper}>
            <button
                className={styles.prevSkip}
                onClick={handlePrevSkipClick}
            >
                {'<<'}
            </button>
            <input
                className={styles.input}
                type="text"
                value={input}
                onChange={handleInputChange}
            />
            <button
                className={styles.forwardSkip}
                onClick={handleForwardSkipClick}
            >
                {'>>'}
            </button>
        </div>
    );
};

export default Jumper;

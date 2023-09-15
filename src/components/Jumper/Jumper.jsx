import React, {
    useCallback,
    useState,
} from 'react';

import addSeconds from '../../chromeActions/addSeconds';

import CircleButton from '../CircleButton';
import TextInput from '../TextInput';

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
            <CircleButton label="<<" onClick={handlePrevSkipClick} />
            <TextInput
                className={styles.input}
                type="text"
                value={input}
                onChange={handleInputChange}
            />
            <CircleButton label=">>" onClick={handleForwardSkipClick} />
        </div>
    );
};

export default Jumper;

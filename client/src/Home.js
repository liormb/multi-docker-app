import React, { useState, useEffect} from 'react';
import axios from 'axios';

function Home() {
    const [index, setIndex] = useState('');
    const [values, setValues] = useState({});
    const [indexes, setIndexes] = useState([]);

    const handleSubmit = event => {
        event.preventDefault();
        axios.post('/api/values', { index })
            .then(() => setIndex(''));
    };

    useEffect(() => {
        const fetchValues = async () => {
            const { data: values } = await axios('/api/values/current');
            setValues(values);
        };
        const fetchIndexes = async () => {
            const { data: indexes } = await axios('/api/values/all');
            setIndexes(indexes);
        };
        fetchValues();
        fetchIndexes();
    }, []);

    return (
        <div className="App-body">
            <form onSubmit={handleSubmit}>
                <label htmlFor="">Enter your index:</label>
                <input type="text" value={index} onChange={e => setIndex(e.target.value)} />
                <button type="submit">Submit</button>
            </form>

            <h3>Calculated Indexes:</h3>
            {indexes
                .map(({ number }) => number)
                .sort((a ,b) => a - b)
                .join(', ')
            }

            <h3>Calculated Values:</h3>
            {Object.keys(values).map(key => (
                <div key={key}>Fibonacci of {key} is equal to {values[key]}</div>
            ))}
        </div>
    );
}

export default Home;

import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

const NewPoll = () => {
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(['', '', '', '']);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation: Check if at least two options are filled
        const filledOptions = options.filter(option => option.trim() !== '');
        if (filledOptions.length < 2) {
            setErrors({ options: 'Please fill in at least two options.' });
            return;
        }

        axios.post("http://localhost:8007/api/poll", { question, options })
            .then((response) => {
                console.log("API response:", response);
                setQuestion("");
                setOptions(['', '', '', '']);
                navigate('/');
            })
            .catch((err) => {
                console.error("API error:", err.response.data);

                if (err.response.status === 400 && err.response.data.error) {
                    // Handle the specific error related to non-unique question
                    setErrors({ question: err.response.data.error });
                } else if (err.response.data.err.errors) {
                    // Handle other validation errors
                    setErrors(err.response.data.err.errors);
                } else {
                    // Handle other errors
                    setErrors({ general: 'Failed to submit the poll. Please try again.' });
                }
            });
    }

    return (
        <>
            <Link to="/">Home</Link>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Question</label>
                    <input
                        type="text"
                        className="form-control"
                        onChange={(e) => setQuestion(e.target.value)}
                        value={question}
                    />
                    {errors.question ? <p>{errors.question}</p> : null}
                </div>
                <div>
                    <label htmlFor="options">Options</label>
                    {options.map((option, index) => (
                        <input
                            key={index}
                            type="text"
                            className="form-control"
                            onChange={(e) => {
                                const newOptions = [...options];
                                newOptions[index] = e.target.value;
                                setOptions(newOptions);
                            }}
                            value={option}
                        />
                    ))}
                    {errors.options ? <p>{errors.options}</p> : null}
                </div>
                {errors.general ? <p>{errors.general}</p> : null}
                <button type='submit'>SUBMIT</button>
            </form>
        </>
    );
};

export default NewPoll;

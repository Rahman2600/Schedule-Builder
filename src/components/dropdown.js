import React from 'react';

export default function Dropdown(props) {
    return ( 
        <select value={props.selected} onChange={props.onChange}> 
            {
                props.options.map((option) => {
                    return (
                            <option key={option} value={option}> 
                                {option} 
                            </option>
                    );
                }) 
            }
        </select>
    );
}
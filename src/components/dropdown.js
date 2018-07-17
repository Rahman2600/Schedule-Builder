import React, { Component } from 'react';

export default function Dropdown(props) {
    return ( 
        <select multiple={props.multiple} value={props.selected} onChange={props.onChange}> 
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
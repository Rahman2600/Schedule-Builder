import React from 'react'

function CheckList(props) {
    return props.list.map((element) => {
        return (
        <div key={element.value}>
            <input 
                type="checkbox" 
                id={element.value}
                key={element.value + "i"} 
                value={element.value} 
                checked={element.checked}
                onChange={() => props.onChange(element.value)}
            />
            <label htmlFor={element.value} key={element.value + "l"} > {element.value} </label>
        </div>
        );
    })
}

export default CheckList;
import React from 'react'

function CheckList(props) {
    return (
        <ul className="list-group">
            {props.list.map((element) => {
                return (
                    <li className="list-group-item" key={element.value + "l"}>
                        <div className="custom-control custom-checkbox">
                            <label htmlFor={element.value}  > {element.value} </label>
                            <input 
                                type="checkbox" 
                                id={element.value}
                                key={element.value + "i"} 
                                value={element.value} 
                                checked={element.checked}
                                onChange={() => props.onChange(element.value)}
                            />
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}

export default CheckList;
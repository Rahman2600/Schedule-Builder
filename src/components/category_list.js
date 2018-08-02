import React from 'react';

export default function CategoryList(props) {
    return (
        <ul className="list-group">
            {
                props.sectionNames.map((sectionName) => {
                    return <li 
                                key={sectionName}
                                className="list-group-item"
                            > {sectionName} </li>
                })
            }
        </ul>
    );
}
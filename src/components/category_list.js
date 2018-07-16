import React from 'react';

export default function CategoryList(props) {
    return (
        <ul>
            {
                props.sectionNames.map((sectionName) => {
                    return <li key={sectionName} > {sectionName} </li>
                })
            }
        </ul>
    );
}
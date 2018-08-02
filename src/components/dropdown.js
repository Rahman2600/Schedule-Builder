import React, { Component } from "react";

export default function Dropdown(props) {
  return (
    <select
      value={props.selected}
      onChange={props.onChange}
      className="form-control mb-2"
    >
      {props.options.map(option => {
        return (
          <option key={option} value={option}>
            {option}
          </option>
        );
      })}
    </select>
  );
}

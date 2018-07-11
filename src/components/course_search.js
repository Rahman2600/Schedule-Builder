import React, { Component } from "react";

class CourseSearch extends Component {
  constructor(props) {
    super(props);

    this.state = { term: "" };
    this.onInputChange = this.onInputChange.bind(this);
    this.onClickAdd = this.onClickAdd.bind(this);
  }

  render() {
    return (
      <div>
        <input
          value={this.state.term}
          onChange={this.onInputChange}
        />
        <button
          type="button"
          onClick={this.onClickAdd}>
          Add
        </button>
      </div>
    );
  }

  onClickAdd() {
    this.props.onAddCourse(this.state.term);
    this.setState({ term: "" });
  }

  onInputChange(event) {
    this.setState({ term: event.target.value });
  }
}

export default CourseSearch;

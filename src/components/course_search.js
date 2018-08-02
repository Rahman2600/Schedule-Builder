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
      <div className="input-group mb-2">
        <input
          type="text"
          className="form-control"
          value={this.state.term}
          onChange={this.onInputChange}
          placeholder="Course name"
        />
        <div className="input-group-append">
          <button
            type="button"
            className="btn btn-primary"
            onClick={this.onClickAdd}
          >
            Add
          </button>
        </div>
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

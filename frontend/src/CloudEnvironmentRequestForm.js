import React, { Component } from 'react';

class CloudEnvironmentRequestForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      environmentType: '',
      instanceType: '',
      numberOfNodes: 1,
      requestStatus: null,
    };
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    // You can perform validation and submit the request to your backend API here
    // For simplicity, we'll just update the requestStatus state for demonstration purposes
    this.setState({ requestStatus: 'Request submitted successfully!' });
  }

  render() {
    return (
      <div>
        <h2>Cloud Environment Request Form</h2>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label>Environment Type:</label>
            <input
              type="text"
              name="environmentType"
              value={this.state.environmentType}
              onChange={this.handleInputChange}
            />
          </div>
          <div>
            <label>Instance Type:</label>
            <input
              type="text"
              name="instanceType"
              value={this.state.instanceType}
              onChange={this.handleInputChange}
            />
          </div>
          <div>
            <label>Number of Nodes:</label>
            <input
              type="number"
              name="numberOfNodes"
              value={this.state.numberOfNodes}
              onChange={this.handleInputChange}
            />
          </div>
          <div>
            <button type="submit">Submit Request</button>
          </div>
        </form>
        {this.state.requestStatus && (
          <div>
            <p>{this.state.requestStatus}</p>
          </div>
        )}
      </div>
    );
  }
}

export default CloudEnvironmentRequestForm;

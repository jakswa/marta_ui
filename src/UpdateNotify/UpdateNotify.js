import React, { Component } from 'react';
import Button from 'material-ui/Button';

class UpdateNotify extends Component {
  refresh() {
    window.location.reload();
  }

  render() {
    return (
      <Button
        variant="raised"
        color="secondary"
        className="update-notify"
        onClick={this.refresh.bind(this)}
      >Refresh to Update</Button>
    );
  }
}

export default UpdateNotify;

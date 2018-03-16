import React, { Component } from 'react';
import Button from 'material-ui/Button';

class UpdateNotify extends Component {
  render() {
    return (
      <Button
        variant="raised"
        color="secondary"
        className="update-notify"
      >Refresh to Update</Button>
    );
  }
}

export default UpdateNotify;

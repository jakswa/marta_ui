import React, { Component } from 'react';
import Button from '@material-ui/core/Button';

class UpdateNotify extends Component {
  refresh() {
    window.location.reload();
  }

  render() {
    return (
      <Button
        variant="raised"
        color="secondary" // not working? adding to className :(
        className="update-notify MuiFab-secondary"
        onClick={this.refresh.bind(this)}
      >Refresh to Update</Button>
    );
  }
}

export default UpdateNotify;

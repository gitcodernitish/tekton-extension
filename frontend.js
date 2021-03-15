const React = window.React;
class Extension extends React.Component {
    state = {
      message: 'Loading ...'
    };
    componentDidMount() {
    };
    render() {
      const { message } = this.state;
      return React.createElement("h1", null, message);
    }
  }
  export default Extension;

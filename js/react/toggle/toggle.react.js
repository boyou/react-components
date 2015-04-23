var Toggle = React.createClass({
  getInitialState: function() {
    return {
      toggleAreaDisplay: "none"
    };
  },
  render: function() {
    var toggle = function(e) {
      e.preventDefault();
      var toggleArea = React.findDOMNode(this.refs.toggleArea);
      var previousDisplay = toggleArea.style.display;
      this.setState({
        toggleAreaDisplay: (previousDisplay === 'none' ? 'inline-block' : 'none')
      });
    }.bind(this);
    var toggleAreaStyle = {
      display: this.state.toggleAreaDisplay,
      position: "absolute",
      zIndex: "1",
      overflow: "auto",
      margin: "0",
      border: "0",
      padding: "0",
      backgroundColor: "white",
      borderStyle: "solid",
      borderWidth: "thin",
      width: "400px",
      height: "200px",
    };
    jQuery.extend(toggleAreaStyle, this.props.customStyle);
    return (
      <div style={{display: "inline-block", position: "relative"}}>
        <a href="#" style={{textDecoration:"none"}} onClick={toggle}> &#9660; </a>
        <div ref="toggleArea" style={toggleAreaStyle}>{this.state.toggleAreaDisplay === 'none' ? null : this.props.content}</div>
      </div>
    );
  },
});

import React, { Component, Fragment } from "react";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      i: 0,
      j: 0
    };
  }
  componentDidMount() {
    const renderEnergyLevel = () => {
      window.requestAnimationFrame(() => {
        this.setState(state => ({ i: state.i + 1 }));
      });
    };
    const renderAtom  = () => {
      this.setState(state => ({ j: state.j + 1 }));
    };
    // setInterval(renderEnergyLevel, 16);
    setInterval(renderAtom, 16);
  }
  render() {
    const { height, width } = this.props;
    const atomX = this.state.j,
          atomY = Math.sqrt(
            (
              Math.pow(width / 6, 2) * Math.pow(height / 8, 2) - // a^2 * b^2
              Math.pow(height / 8, 2) * Math.pow(atomX, 2) // b^2 * x^2
            ) / Math.pow(width / 6, 2)
          );
    console.log(atomX, atomY);
    return (
      <Fragment>
        <ellipse
          border={{ color: '#963D5A' }}
          rx={width / 6}
          ry={height / 8}
          cx={width / 2}
          cy={height / 2}
          rot={this.state.i}
          deg={{ start: 0, end: 2 * Math.PI }}
        />
        <ellipse
          border={{ color: '#963D5A' }}
          rx={width / 6}
          ry={height / 8}
          cx={width / 2}
          cy={height / 2}
          rot={this.state.i + Math.PI / 3}
          deg={{ start: 0, end: 2 * Math.PI }}
        />
        <ellipse
          border={{ color: '#963D5A' }}
          rx={width / 6}
          ry={height / 8}
          cx={width / 2}
          cy={height / 2}
          rot={this.state.i + 2 * Math.PI / 3}
          deg={{ start: 0, end: 2 * Math.PI }}
        />
        <arc
          r={50}
          cx={width / 2}
          cy={height / 2}
          fill="#963D5A"
          deg={{ start: 0, end: 2 * Math.PI }}
        />
        <arc
          r={8}
          cx={atomX + (width / 2)}
          cy={atomY + (height / 2)}
          fill="#963D5A"
          deg={{ start: 0, end: 2 * Math.PI }}
        />
      </Fragment>
    );
  }
}

export default App;

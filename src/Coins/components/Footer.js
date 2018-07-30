import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default class Footer extends Component {
  static propTypes = {
    coins: PropTypes.array.isRequired,
    options: PropTypes.string
  };
  componentWillMount() {
    this.options = {
      firstMenu: "down",
      secondMenu: "top"
    };
    if (this.props.options) {
      try {
        this.options = { ...this.options, ...JSON.parse(this.props.options) };
      } catch (e) {
        /* eslint-disable no-console */
        console.error("[data-options] in footer haven't written correctly.");
        /* eslint-enable no-console */
      }
    }
  }

  render() {
    const { coins } = this.props;
    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-md-6">
            <Link to="/">Home</Link>
          </div>
          <div className="col-lg-2 col-md-6">
            <h3 className="h5 mb-2 text-light">Top by Price</h3>
            <nav className="nav flex-column">
              {coins
                .sort((a, b) => b.price - a.price)
                .slice(0, 4)
                .map(coin => (
                  <Link
                    key={coin.short}
                    className="nav-link text-light"
                    to={`/${coin.short}`}
                  >
                    {coin.long}
                  </Link>
                ))}
            </nav>
          </div>
          <div className="col-lg-2 col-md-6">
            <h3 className="h5 mb-2 text-light">Top by Supply</h3>
            <nav className="nav flex-column">
              {coins
                .sort((a, b) => b.supply - a.supply)
                .slice(0, 4)
                .map(coin => (
                  <Link
                    key={coin.short}
                    className="nav-link text-light"
                    to={`/${coin.short}`}
                  >
                    {coin.long}
                  </Link>
                ))}
            </nav>
          </div>
          <div className="col-lg-2 col-md-6">
            <h3 className="h5 mb-2 text-light">Top by 24h.</h3>
            <nav className="nav flex-column">
              {coins
                .sort((a, b) => b.cap24hrChange - a.cap24hrChange)
                .slice(0, 4)
                .map(coin => (
                  <Link
                    key={coin.short}
                    className="nav-link text-light"
                    to={`/${coin.short}`}
                  >
                    {coin.long}
                  </Link>
                ))}
            </nav>
          </div>
        </div>
      </div>
    );
  }
}

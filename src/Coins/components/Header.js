import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";

import { shortenLargeNumber } from "../utils/money";

import "../styles/Header.scss";

class Header extends PureComponent {
  static propTypes = {
    global: PropTypes.object,
    darkMode: PropTypes.bool.isRequired,
    options: PropTypes.string
  };

  componentWillMount() {
    this.options = {};
    if (this.props.options) {
      try {
        this.options = { ...this.options, ...JSON.parse(this.props.options) };
      } catch (e) {
        /* eslint-disable no-console */
        console.error("[data-options] in header haven't written correctly.");
        /* eslint-enable no-console */
      }
    }
  }

  render() {
    return (
      <Fragment>
        {this.props.global ? (
          <nav
            className={
              this.props.darkMode
                ? "navbar navbar-dark bg-dark"
                : "navbar navbar-light bg-light border-bottom"
            }
          >
            <div className="container justify-content-start">
              {/* <div className="col-md-2 col-sm-4 col-6 navbar-text d-flex flex-column">
                <span className="title">BTC Price</span>
                <span className="btc-price">
                  ${shortenLargeNumber(this.props.global.btcPrice, 1)}
                </span>
              </div> */}
              <div className="col-md-2 col-sm-4 col-6 navbar-text d-flex flex-column">
                <span className="title">Total Cap.</span>
                <span className="btc-price">
                  ${shortenLargeNumber(
                    this.props.global.total_market_cap_usd,
                    2
                  )}
                </span>
              </div>
              <div className="col-md-2 col-sm-4 col-6 navbar-text d-flex flex-column">
                <span className="title">Total Volume</span>
                <span className="btc-price">
                  ${shortenLargeNumber(this.props.global.total_24h_volume_usd)}
                </span>
              </div>
              <div className="col-md-2 col-sm-4 col-6 navbar-text d-flex flex-column">
                <span className="title">Act. Currencies</span>
                <span className="btc-price">
                  {shortenLargeNumber(this.props.global.active_currencies)}
                </span>
              </div>
              <div className="col-md-2 col-sm-4 col-6 navbar-text d-flex flex-column">
                <span className="title">Act. Assets</span>
                <span className="btc-price">
                  {shortenLargeNumber(this.props.global.active_assets)}
                </span>
              </div>
              <div className="col-md-2 col-sm-4 col-6 navbar-text d-flex flex-column">
                <span className="title">Act. Markets</span>
                <span className="btc-price">
                  {shortenLargeNumber(this.props.global.active_markets)}
                </span>
              </div>
              <div className="col-md-2 col-sm-4 col-6 navbar-text d-flex flex-column">
                <span className="title">BTC Market Cap.</span>
                <span className="btc-price">
                  {this.props.global.bitcoin_percentage_of_market_cap} %
                </span>
              </div>
            </div>
          </nav>
        ) : (
          "Loading ..."
        )}
      </Fragment>
    );
  }
}

export default Header;

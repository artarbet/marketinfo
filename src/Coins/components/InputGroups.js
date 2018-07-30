import React, { PureComponent } from "react";
import PropTypes from "prop-types";

class InputGroup extends PureComponent {
  static propTypes = {
    darkMode: PropTypes.bool.isRequired,
    rates: PropTypes.object.isRequired,
    currentCurrency: PropTypes.string,
    searchCoins: PropTypes.func,
    toggleDarkTheme: PropTypes.func,
    changeCurrency: PropTypes.func
  };

  state = {
    showCurrencies: false
  };

  toggleDiplayCurrencies() {
    this.setState({
      showCurrencies: !this.state.showCurrencies
    });
  }

  render() {
    return (
      <form className="row inputs-controlers">
        <div className="col-12 mb-3">
          <div className="form-row align-items-center">
            <div className="col-lg-8 col-md-7 col-sm-12">
              <label className="sr-only" htmlFor="searchCurrencies">
                Search Cryptocoins
              </label>
              <input
                type="search"
                className="form-control"
                id="searchCurrencies"
                placeholder="Search Cryptocoins"
                onChange={ev => this.props.searchCoins(ev)}
              />
            </div>

{/*            <div className="col my-1">
              <button
                type="button"
                onClick={() => this.toggleDiplayCurrencies()}
                className={
                  this.state.showCurrencies
                    ? "btn btn-outline-primary btn-block active"
                    : "btn btn-outline-primary btn-block"
                }
              >
                {this.state.showCurrencies ? "Hide" : "Change"} Currency
              </button>
            </div>

            <div className="col my-1">
              <div className="custom-control custom-checkbox mr-sm-2">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="darkTheme"
                  checked={this.props.darkMode}
                  onChange={ev => this.props.toggleDarkTheme(ev)}
                />
                <label className="custom-control-label" htmlFor="darkTheme">
                  Night Mode
                </label>
              </div>
            </div>*/}
          </div>
        </div>
        {this.state.showCurrencies && (
          <div className="col-12">
            <div className="row">
              {this.props.rates
                .filter(currency => currency !== this.props.currentCurrency)
                .sort()
                .map(currency => (
                  <div
                    className="col-xl-1 col-md-2 col-sm-3 col-xs-12 mb-1 no-gutters"
                    key={currency}
                  >
                    <button
                      type="button"
                      onClick={() => this.props.changeCurrency(currency)}
                      className="btn btn-block btn-outline-secondary"
                    >
                      {currency}
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </form>
    );
  }
}

export default InputGroup;

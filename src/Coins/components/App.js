import React, { Component, Fragment } from "react";
import { createPortal } from "react-dom";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

import axios from "../utils/axios";
import Money from "../utils/money";
import socket from "../utils/socket.io";
import Header from "./Header";
import InputGroup from "../components/InputGroups";
import CoinBlock from "../components/CoinBlock";

import "../styles/App.scss";

const TITLE = () => ({ __html: process.env.TITLE });

class App extends Component {
  state = {
    global: null,
    front: null,
    darkMode: localStorage.getItem("darkMode") == 1,
    currentCurrency:
      (!!localStorage.getItem("curr") && localStorage.getItem("curr")) || "USD"
  };

  searchCoins(ev) {
    if (ev.target.value.length) {
      this.setState({
        showCoins: this.state.front.filter(coin =>
          new RegExp(ev.target.value, "gi").test(coin.long)
        )
      });
    } else {
      this.setState({
        showCoins: this.state.front.slice(0, 30)
      });
    }
  }

  updateShowenCoins() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      this.setState({
        showCoins: this.state.front.slice(0, this.state.showCoins.length + 30)
      });
    }
  }

  toggleDarkTheme(ev) {
    this.setState({
      darkMode: ev.target.checked
    });
    localStorage.setItem("darkMode", Number(ev.target.checked));
  }

  changeCurrency(currentCurrency) {
    this.setState({
      currentCurrency
    });
    localStorage.setItem("curr", currentCurrency);
  }

  componentWillMount() {
    this.mountHeaderClass = document.querySelector("[coins-header]");
    window.Promise.all([
      axios("https://api.coinmarketcap.com/v1/global/").then(
        ({ data }) => data
      ),
      axios("front").then(({ data }) => data),
      Money.fetch()
    ]).then(([global, front]) => {
      this.setState({
        global,
        front,
        showCoins: front.slice(0, 30)
      });
      socket.open();
      window.addEventListener("scroll", () => this.updateShowenCoins());
    });
  }

  componentWillUnmount() {
    socket.close();
    window.removeEventListener("scroll", () => {});
  }

  render() {
    return (
      <ReactCSSTransitionGroup
        transitionName="fade"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}
      >
        {this.state.front && this.state.global ? (
          <Fragment key={"loaded"}>
            {this.mountHeaderClass &&
              createPortal(
                <Header
                  darkMode={this.state.darkMode}
                  global={this.state.global}
                  options={this.mountHeaderClass.dataset.options}
                />,
                this.mountHeaderClass
              )}
            {process.env.TITLE && (
              <h1
                className="h3 text-center"
                dangerouslySetInnerHTML={TITLE()}
              />
            )}
            <InputGroup
              rates={Object.keys(Money.rates)}
              darkMode={this.state.darkMode}
              currentCurrency={this.state.currentCurrency}
              toggleDarkTheme={ev => this.toggleDarkTheme(ev)}
              searchCoins={ev => this.searchCoins(ev)}
              changeCurrency={curr => this.changeCurrency(curr)}
            />
            <div
              className={
                this.state.darkMode
                  ? "table-responsive bg-secondary"
                  : "table-responsive bg-light"
              }
            >
              <table
                className={
                  this.state.darkMode
                    ? "table table-bordered table-hover table-dark"
                    : "table table-bordered table-hover table-light"
                }
              >
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Marketcap</th>
                    <th scope="col">Price</th>
                    <th scope="col">24hour VWAP</th>
                    <th scope="col">Supply</th>
                    <th scope="col">24h V.</th>
                    <th scope="col">24h. %</th>
                    <th scope="col">Trade</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.showCoins.map(coin => (
                    <CoinBlock
                      currentCurrency={this.state.currentCurrency}
                      key={coin.short}
                      coin={coin}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            {/* <div className="text-center my-4">
              <button
                className="btn btn-primary"
                disabled={!this.state.front.length}
                onClick={() => this.updateShowenCoins()}
              >
                Load More Coins
              </button>
            </div> */}
          </Fragment>
        ) : (
          <div
            key={"loading"}
            className="loading d-flex justify-content-center align-items-center bg-dark"
          >
            <svg
              width="105"
              height="105"
              viewBox="0 0 105 105"
              xmlns="http://www.w3.org/2000/svg"
              fill="#fff"
            >
              <circle cx="12.5" cy="12.5" r="12.5">
                <animate
                  attributeName="fill-opacity"
                  begin="0s"
                  dur="1s"
                  values="1;.2;1"
                  calcMode="linear"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="12.5" cy="52.5" r="12.5" fillOpacity=".5">
                <animate
                  attributeName="fill-opacity"
                  begin="100ms"
                  dur="1s"
                  values="1;.2;1"
                  calcMode="linear"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="52.5" cy="12.5" r="12.5">
                <animate
                  attributeName="fill-opacity"
                  begin="300ms"
                  dur="1s"
                  values="1;.2;1"
                  calcMode="linear"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="52.5" cy="52.5" r="12.5">
                <animate
                  attributeName="fill-opacity"
                  begin="600ms"
                  dur="1s"
                  values="1;.2;1"
                  calcMode="linear"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="92.5" cy="12.5" r="12.5">
                <animate
                  attributeName="fill-opacity"
                  begin="800ms"
                  dur="1s"
                  values="1;.2;1"
                  calcMode="linear"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="92.5" cy="52.5" r="12.5">
                <animate
                  attributeName="fill-opacity"
                  begin="400ms"
                  dur="1s"
                  values="1;.2;1"
                  calcMode="linear"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="12.5" cy="92.5" r="12.5">
                <animate
                  attributeName="fill-opacity"
                  begin="700ms"
                  dur="1s"
                  values="1;.2;1"
                  calcMode="linear"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="52.5" cy="92.5" r="12.5">
                <animate
                  attributeName="fill-opacity"
                  begin="500ms"
                  dur="1s"
                  values="1;.2;1"
                  calcMode="linear"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="92.5" cy="92.5" r="12.5">
                <animate
                  attributeName="fill-opacity"
                  begin="200ms"
                  dur="1s"
                  values="1;.2;1"
                  calcMode="linear"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
          </div>
        )}
      </ReactCSSTransitionGroup>
    );
  }
}

export default App;

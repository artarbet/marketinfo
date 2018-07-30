import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";

import axios from "../utils/axios";
import { formatMoney, shortenLargeNumber } from "../utils/money";
import ReactHighstock from "react-highcharts/ReactHighstock";
import { subscribe, unsubscribe } from "../utils/socket.io";
import throttle from "lodash/throttle";

const changellyRefId = process.env.changellyRefId;

class CoinBlock extends PureComponent {
  static propTypes = {
    coin: PropTypes.object.isRequired,
    currentCurrency: PropTypes.string
  };

  state = {
    history: null,
    historyLoading: false,
    showDetailsActive: false,
    coin: this.props.coin
  };

  componentWillUnmount() {
    this.timeout && clearTimeout(this.timeout);
    unsubscribe(this.state.coin.short);
  }

  componentDidMount() {
    subscribe(
      this.state.coin.short,
      throttle(({ message: { coin, msg } }) => {
        if (coin === this.state.coin.short && !this.state.showDetailsActive) {
          this.setState(
            {
              coin: {
                ...this.state.coin,
                ...msg,
                class: this.state.coin.price >= 1 * msg.price ? "down" : "up",
                priceClass:
                  this.state.coin.price >= 1 * msg.price
                    ? "text-danger"
                    : "text-success",
                vhclass:
                  this.state.coin.vwapData >= msg.vwapData
                    ? "text-danger"
                    : "text-success"
              }
            },
            () => {
              this.timeout = setTimeout(() => {
                this.setState({ coin: { ...this.state.coin, class: null } });
                clearTimeout(this.timeout);
              }, 500);
            }
          );
        }
      }, 3000)
    );
  }

  getCurrentCurrencyValue(usd, precision) {
    return formatMoney(usd, precision, this.props.currentCurrency);
  }

  showMoreDetails(ev) {
    if (ev.target.tagName == "A") return;

    if (!this.state.history) {
      this.setState({ historyLoading: true });
      return axios(`history/${this.props.coin.short}`).then(({ data }) => {
        this.setState({
          history: data,
          showDetailsActive: true,
          historyLoading: false
        });
      });
    } else {
      this.setState({ showDetailsActive: !this.state.showDetailsActive });
    }
  }

  createSerieTitle(serie) {
    return serie.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase());
  }

  render() {
    const { historyLoading, showDetailsActive, history, coin } = this.state;
    const getCurrentCurrencyValue = this.getCurrentCurrencyValue.bind(this);

    const config = coin &&
      history && {
        credits: { enabled: false },
        legend: { enabled: true, verticalAlign: "top" },
        rangeSelector: {
          allButtonsEnabled: true,
          buttons: [
            {
              type: "day",
              count: 1,
              text: "1d"
            },
            {
              type: "week",
              count: 1,
              text: "1w"
            },
            {
              type: "month",
              count: 1,
              text: "1m"
            },
            {
              type: "month",
              count: 3,
              text: "3m"
            },
            {
              type: "month",
              count: 6,
              text: "6m"
            },
            {
              type: "year",
              count: 1,
              text: "1y"
            }
          ],
          selected: 2
        },
        xAxis: {
          minRange: 3600 * 1000 * 24
        },
        yAxis: {
          labels: {
            formatter: function() {
              return getCurrentCurrencyValue(
                this.value
                // (!this.isFirst && !this.isLast && 6) || 0
              );
            }
          }
        },
        // title: {
        //   text: `${coin.long} History`
        // },
        series: Object.keys(history).map(setkey => ({
          name: this.createSerieTitle(setkey),
          data: history[setkey],
          type: "area",
          tooltip: {
            pointFormatter() {
              return `${this.series.name}: ${getCurrentCurrencyValue(
                this.y,
                setkey == "price" ? 6 : 0
              )}`;
            }
          }
        })),
        time: {
          getTimezoneOffset(timestamp) {
            return new Date(timestamp).getTimezoneOffset();
          }
        }
      };
    return (
      <Fragment>
        <tr
          className={
            historyLoading ? `loading bg-gray ${coin.class}` : coin.class
          }
          onClick={ev => this.showMoreDetails(ev)}
        >
          <td>{coin.long}</td>
          <td>{this.getCurrentCurrencyValue(coin.mktcap, 0)}</td>
          <td className={coin.priceClass}>
            {this.getCurrentCurrencyValue(coin.price)}
          </td>
          <td className={coin.vhclass}>
            {this.getCurrentCurrencyValue(coin.vwapData)}
          </td>
          <td>{shortenLargeNumber(coin.supply)}</td>
          <td>{this.getCurrentCurrencyValue(coin.volume, 0)}</td>
          <td
            className={coin.cap24hrChange < 0 ? "text-danger" : "text-success"}
          >
            {coin.cap24hrChange} %
          </td>
          <td>
            <a
              href={`https://changelly.com/exchange/usd/${coin.short.toLowerCase()}/1?ref_id=${changellyRefId}`}
              target="_blank"
              rel="noopener nofollow"
              className="text-success"
            >
              Buy/Sell
            </a>
          </td>
        </tr>
        {history &&
          showDetailsActive && (
            <tr className={showDetailsActive ? "charts active" : "charts"}>
              <td colSpan="8" className="p-0">
                <ReactHighstock config={config} />
              </td>
            </tr>
          )}
      </Fragment>
    );
  }
}

export default CoinBlock;

import money from "money";
import axios from "./axios";
import accounting from "./accounting";

money.fetch = () => {
  return axios("exchange_rates").then(({ data }) => {
    money.base = data.base;
    money.settings.from = data.base;
    money.rates = data.rates;
    money.symbols = data.symbols;
    return data.rates;
  });
};

const shortenLargeNumber = (num, digits = 3) => {
  let units = ["k", "M", "G", "T", "P", "E", "Z", "Y"],
    decimal;
  for (let i = units.length - 1; i >= 0; i--) {
    decimal = Math.pow(1000, i + 1);
    if (num <= -decimal || num >= decimal) {
      return accounting.toFixed(num / decimal, digits) + units[i];
    }
  }
  return num;
};

const formatMoney = (usd, precision = 3, currency) =>
  accounting.formatMoney(
    money(usd).to(currency),
    (money.symbols[currency] && {
      format: "%s %v",
      precision,
      symbol: money.symbols[currency]
    }) ||
      currency,
    precision
  );

export { shortenLargeNumber, formatMoney };
export const formatNumber = accounting.formatNumber;
export const formatColumn = accounting.formatColumn;

export default money;

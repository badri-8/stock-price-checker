'use strict';
const express = require('express');
const router = express.Router();
const axios = require('axios');
const crypto = require('crypto');

// In-memory store
const stocks = {};

function hashIP(ip) {
  return crypto.createHash('sha256').update(ip).digest('hex');
}

async function getPrice(stock) {
  const url = `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`;
  const res = await axios.get(url);
  return res.data.latestPrice;
}

router.get('/stock-prices', async (req, res) => {
  let { stock, like } = req.query;
  const ipHash = hashIP(req.ip);
  const list = Array.isArray(stock) ? stock : [stock];

  async function handle(symbol) {
    symbol = symbol.toUpperCase();

    if (!stocks[symbol]) {
      stocks[symbol] = { likes: 0, ips: [] };
    }

    if (like === 'true' && !stocks[symbol].ips.includes(ipHash)) {
      stocks[symbol].likes++;
      stocks[symbol].ips.push(ipHash);
    }

    const price = await getPrice(symbol);

    return {
      stock: symbol,
      price,
      likes: stocks[symbol].likes
    };
  }

  const results = await Promise.all(list.map(handle));

  if (results.length === 2) {
    return res.json({
      stockData: [
        {
          stock: results[0].stock,
          price: results[0].price,
          rel_likes: results[0].likes - results[1].likes
        },
        {
          stock: results[1].stock,
          price: results[1].price,
          rel_likes: results[1].likes - results[0].likes
        }
      ]
    });
  }

  res.json({ stockData: results[0] });
});

module.exports = router;

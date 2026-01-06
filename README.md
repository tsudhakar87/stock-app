# stock price dashboard

A simple real-time stock price dashboard showing current prices for 20 popular companies

Deployed at https://stock-app-seven-virid.vercel.app/

## features
- real-time stock prices from finnhub api
- automatic updates every 30 seconds
- manual refresh button
- responsive table with price change indicators
- charts displaying data from past 30 days

## tech stack
- react + typescript
- vite
- tailwind css
- finnhub api + alpha vantage api
- chart.js

## setup

1. clone and install:
```bash
npm install
```

2. create `.env` file:
```
VITE_FINNHUB_API_KEY=your_finnhub_api_key_here
VITE_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key_here
```

3. get free api key from [alphavantage.co](https://alphavantage.co)

4. run development server:
```bash
npm run dev
```

5. build for production:
```bash
npm run build
```

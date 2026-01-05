# stock price dashboard

A simple real-time stock price dashboard showing current prices for 20 popular companies

## features
- real-time stock prices from finnhub api
- automatic updates every 30 seconds
- manual refresh button
- responsive table with price change indicators

## tech stack
- react + typescript
- vite
- tailwind css
- finnhub api

## setup

1. clone and install:
```bash
npm install
```

2. create `.env` file:
```
VITE_FINNHUB_API_KEY=your_api_key_here
```

3. get free api key from [finnhub.io](https://finnhub.io)

4. run development server:
```bash
npm run dev
```

5. build for production:
```bash
npm run build
```

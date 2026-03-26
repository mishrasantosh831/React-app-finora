const API_KEY = import.meta.env.VITE_ALPHAVANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query?';

if(!API_KEY) {
  throw new Error('Missing API key. Please set the VITE_ALPHAVANTAGE_API_KEY environment variable.')
}

async function fetchJSON(queryParam){
    const url = `${BASE_URL}${new URLSearchParams({
        ...queryParam,
        apikey: API_KEY,
    })}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

export async function getDailyPerformance(ticker) {
    const json = await fetchJSON({
        function: 'TIME_SERIES_DAILY',
        symbol: ticker,
    });
    const timeSeries = json['Time Series (Daily)'];
    if(!timeSeries) return null;
    const [latestDate, previousDate] = Object.keys(timeSeries);

    if(!latestDate || !previousDate) return null;

    const latestClose = parseFloat(timeSeries[latestDate]['4. close']);
    const previousClose = parseFloat(timeSeries[previousDate]['4. close']);

    const performance = ((latestClose / previousClose - 1) * 100).toFixed(2);
    return performance;
}
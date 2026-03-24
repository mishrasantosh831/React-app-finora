import { useState } from "react";
import { getDailyPerformance } from '../services/alphaVantageService';

export default function StockList(userId) {
    const [symbols, setSymbols] = useState("");
    const [error, setError] = useState("");
    const [performances, setPerformances] = useState("");

    async function handleAddStock(e) {
        e.preventDefault();
        setError("");
        setPerformances("");
        try {
            const performance = await getDailyPerformance(symbols.toUpperCase());
            if(!performance) {
                setError("Invalid stock ticker. Please try again.");
                return;
            }
            setPerformances(performance);
        } catch (err) {
            setError("Failed to fetch stock performance. Please try again later.");
        }
    return (
        <div>
            <form onSubmit={handleAddStock}>
                <input type="text" value={symbols} onChange={e=>setSymbols(e.target.value)} placeholder="Eg. AAPL" />
                <button type="submit">Add Stock</button>
                {error && <p style={{color: 'red'}}>{error}</p>}
                {performances && <p style={{color: performance > 0 ? "green" : "red"}}>Daily Performance: {performances}%</p>}
            </form>
        </div>
    )
    }
}
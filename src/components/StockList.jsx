import { useEffect, useState } from "react";
import { getDailyPerformance } from '../services/alphaVantageService';
import { createClient } from "@supabase/supabase-js";
import { AddStock, FetchWatchList, RemoveStock } from "../services/supaBaseWatchListService";
import { useSession } from "@clerk/react";

export default function StockList({ userId }) {
    const { session } = useSession();
    const [symbol, setSymbol] = useState("");
    const [error, setError] = useState("");
    const [stocks, setStocks] = useState([]);
    
    const supabase = createClient(import.meta.env.VITE_SUPERBASE_URL, import.meta.env.VITE_SUPERBASE_ANON_KEY,{
        accessToken: () => session ? session.getToken({template:"supabase"}) : null
    });

    async function handleFetchStocks() {
        try {
            const data = await FetchWatchList(supabase, userId);
            setStocks(data);
        } catch (err) {
            console.error("Failed to fetch watch list:", err);
        }
    }

    async function handleAddStock(e) {
        e.preventDefault();
        setError("");
        await AddStock(supabase, symbol.toUpperCase(), userId);
        setSymbol("");
        await handleFetchStocks();

    }

    async function loadPerformance(symbol) {
        const updated = await Promise.all(
            stocks.map(async (stock) => ({
                ...stock,
                perf: await getDailyPerformance(stock.symbol)
            }))
        );
        setStocks(updated);
    }

    useEffect(() => {
        if (userId) {
            handleFetchStocks();
        }
    }, [userId]);
    useEffect(() => {
        if (stocks.length > 0) {
            loadPerformance();
        }
    }, [stocks.length]);

    async function handleRemoveStock(id) {
        try {
            await RemoveStock(supabase, id);
            await handleFetchStocks();
        } catch (err) {
            console.error("Failed to remove stock from watch list:", err);
        }
    }
        return (
        <div>
            <form onSubmit={handleAddStock} className="stock-form">
                <h3>Check US Stock Performance</h3>
                <input type="text" value={symbol} onChange={e=>setSymbol(e.target.value)} placeholder="Eg. AAPL,AMZN,IBM etc..." />
                <button type="submit">Check Stock</button>
                {error && <p style={{color: 'red'}}>{error}</p>}
                {/* {performances && <p style={{color: performance > 0 ? "green" : "red"}}>{performances}%</p>} */}
                
            </form>
            <h3>Your Watch List</h3>
            <ul className="stock-list">
                    {stocks && stocks.map(stock => (
                        <li key={stock.id}>
                            <span>{stock.symbol}</span>
                            <span style={{color: stock.perf > 0 ? "green" : "red"}}>{stock.perf ? `${stock.perf}%` : "..."}</span>
                            <button onClick={() => handleRemoveStock(stock.id)}>X</button>
                        </li>
                    ))}
                </ul>
        </div>
    )
}
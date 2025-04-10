"use client";

import { useEffect, useState } from "react";
import backendApi from "@/utils/api";

export default function CurrencyList() {
    const [currencies, setCurrencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        async function fetchCurrencies() {
            try {
                console.log("Fetching currencies...");
                setLogs((prevLogs) => [...prevLogs, "Fetching currencies..."]);

                const response = await backendApi.get("/currency_all/");

                console.log("Currencies fetched:", response.data);
                setLogs((prevLogs) => [...prevLogs, `Currencies fetched: ${JSON.stringify(response.data)}`]);

                setCurrencies(response.data);
            } catch (error) {
                console.error("Failed to fetch currencies:", error);
                setLogs((prevLogs) => [...prevLogs, `Error: ${error.message}`]);
            } finally {
                setLoading(false);
            }
        }

        fetchCurrencies();
    }, []);

    return (
        <div className="currency-list">
            <h2>Available Currencies</h2>
            {loading ? (
                <p>Loading...</p>
            ) : currencies.length > 0 ? (
                <ul>
                    {currencies.map((currency) => (
                        <li key={currency.id}>
                            {currency.name} ({currency.code})
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No currencies available.</p>
            )}

            <h3>Console Logs</h3>
            <pre style={{ background: "#f4f4f4", padding: "10px", borderRadius: "5px", overflowX: "auto" }}>
        {logs.join("\n")}
      </pre>
        </div>
    );
}

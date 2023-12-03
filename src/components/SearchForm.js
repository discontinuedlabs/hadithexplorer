import React, { useState, useEffect } from "react";

export default function SearchForm() {
    const [searchTerm, setSearchTerm] = useState("");
    const [data, setData] = useState(null);

    useEffect(() => {
        if (searchTerm) {
            fetch(`https://corsproxy.io/?https://dorar.net/dorar_api.json?skey=${searchTerm}`)
                .then((response) => response.json())
                .then((data) => setData(data))
                .catch((error) => console.error(error));
        }
    }, [searchTerm]);

    const handleSubmit = (event) => {
        event.preventDefault();
        // Fetch data from the API here
    };

    return (
        <div>
            <form className="search-form" onSubmit={handleSubmit}>
                <input type="text" onChange={(e) => setSearchTerm(e.target.value)}></input>
                <button type="submit">Search</button>
            </form>
            {data && <div dangerouslySetInnerHTML={{ __html: data.ahadith.result }}></div>}
        </div>
    );
}

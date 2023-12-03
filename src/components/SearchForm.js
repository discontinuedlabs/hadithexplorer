import React, { useState, useEffect } from "react";

export default function SearchForm() {
    const [searchTerm, setSearchTerm] = useState("");
    const [ahadith, setAhadith] = useState([]);

    useEffect(() => {
        if (searchTerm) {
            fetch(`https://corsproxy.io/?https://dorar.net/dorar_api.json?skey=${searchTerm}`)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(data.ahadith.result, "text/html");
                    const hadithElements = Array.from(doc.querySelectorAll(".hadith"));
                    const hadithInfoElements = Array.from(doc.querySelectorAll(".hadith-info"));
                    const ahadithArray = hadithElements.map((hadith, i) => ({
                        hadith: hadith.innerHTML,
                        hadithInfo: hadithInfoElements[i]?.innerHTML || "",
                    }));
                    setAhadith(ahadithArray);
                })
                .catch((error) => console.error(error));
        }
    }, [searchTerm]);

    return (
        <div>
            <input type="text" onChange={(e) => setSearchTerm(e.target.value)}></input>
            {ahadith.length > 0 &&
                ahadith.map((item) => {
                    return (
                        <div dir="rtl" className="hadith-box">
                            <div className="hadith" dangerouslySetInnerHTML={{ __html: item.hadith }}></div>
                            <div className="hadith-info" dangerouslySetInnerHTML={{ __html: item.hadithInfo }}></div>
                        </div>
                    );
                })}
            {ahadith.length > 0 && <button onClick={() => window.open(`https://dorar.net/hadith/search?q=${searchTerm}`, "_blank")}>More</button>}
        </div>
    );
}

import { useState, useEffect } from "react";
// import { v4 as uuidv4 } from "uuid";
import HadithBox from "./HadithBox";

export default function HadithSearch(props) {
    const { language, setLanguage } = props;
    const [searchBarInput, setSearchBarInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [ahadith, setAhadith] = useState([]);

    /* This function is mainly made for PrayTimePro adhkar reference, it searches based on the q param in the link
    example: http://discontinuedlabs.github.io/hadithexplorer/?q=search-term&lang=ar */
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const query = params.get("q") || "";
        const lang = params.get("lang") || "en";
        setLanguage(lang);
        if (query) {
            setSearchBarInput(query);
            handleSearch(query);
        }
    }, []);

    async function handleSearch(term) {
        // setSearchTerm(term);
        if (term) {
            if (language === "ar") fetchAhadith(term);
            else {
                const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${language}&tl=ar&dt=t&q=${term}`;
                try {
                    const response = await fetch(url);
                    const data = await response.json();
                    const translatedText = data[0][0][0];
                    setSearchTerm(translatedText);
                    fetchAhadith(translatedText);
                } catch (error) {
                    console.error(error);
                }
            }
        }
    }

    function fetchAhadith(term) {
        fetch(
            `https://corsproxy.io/?https://dorar.net/dorar_api.json?skey=${term}`
        )
            .then((response) => response.json())
            .then((data) => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(
                    data.ahadith.result,
                    "text/html"
                );
                const hadithElements = Array.from(
                    doc.querySelectorAll(".hadith")
                );
                const hadithInfoElements = Array.from(
                    doc.querySelectorAll(".hadith-info")
                );
                const ahadithArray = hadithElements.map((hadith, i) => ({
                    hadith: hadith.innerHTML,
                    hadithInfo: hadithInfoElements[i]?.innerHTML || "",
                }));
                setAhadith(ahadithArray);
            })
            .catch((error) => console.error(error));
    }

    return (
        <div className="hadith-search">
            <form
                id="search-form"
                onSubmit={(event) => {
                    event.preventDefault();
                    handleSearch(searchBarInput);
                }}
            >
                <div className="search-bar-container">
                    <input
                        type="text"
                        name="search-bar"
                        id="search-bar"
                        onChange={(event) =>
                            setSearchBarInput(event.target.value)
                        }
                        value={searchBarInput}
                    />
                    <button
                        type="submit"
                        id="search-button"
                        name="search-button"
                    >
                        S
                    </button>
                </div>
            </form>

            {ahadith.length > 0 &&
                ahadith.map((item) => (
                    <HadithBox
                        key={item.hadithInfo} // hadithInfo is always unique because it has hadith number with more text
                        hadith={item.hadith}
                        hadithInfo={item.hadithInfo}
                        language={language}
                    />
                ))}

            {ahadith.length > 0 && (
                <button
                    className="more-button"
                    onClick={() =>
                        window.open(
                            `https://dorar.net/hadith/search?q=${searchTerm}`,
                            "_blank"
                        )
                    }
                >
                    <b>More</b>
                </button>
            )}
        </div>
    );
}

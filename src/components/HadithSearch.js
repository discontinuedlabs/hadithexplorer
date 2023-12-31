import { useState, useEffect } from "react";
import HadithBox from "./HadithBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function HadithSearch(props) {
    const { language, setLanguage, offline, addBookmark, headerRef } = props;
    const [searchBarInput, setSearchBarInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [ahadith, setAhadith] = useState([]);
    const [searchStatus, setSearchStatus] = useState("");
    const AHADITH_LIMIT = 15; // Limit of returned Hadiths from dorar.net
    const STATUS = {
        idle: "Begin by entering keywords to explore Hadiths.",
        offline: "You're offline. Check your connection.",
        nothingFound: `Couldn't find any Hadith with the keyword "${searchTerm}".`,
    };

    /* This function is mainly made for PrayTimePro adhkar reference, it searches based on the q param in the link
    example: http://discontinuedlabs.github.io/hadithexplorer/?q=search-term&lang=ar */
    // useEffect(() => {
    //     const params = new URLSearchParams(window.location.search);
    //     const query = params.get("q") || "";
    //     const lang = params.get("lang");
    //     if (query) {
    //         setSearchBarInput(query);
    //         handleSearch(query);
    //     }
    //     if (lang && headerRef.current?.availableLanguages.contains(lang)) {
    //         setLanguage(lang);
    //     }
    // }, [headerRef.current?.availableLanguages]);

    useEffect(() => {
        if (ahadith.length === 0) {
            if (offline) setSearchStatus(STATUS.offline);
            else setSearchStatus(STATUS.idle);
        }
    }, [offline, ahadith.length]);

    async function handleSearch(term) {
        if (term) {
            const ARABIC_REGEX = /[\u0600-\u06FF\u0750-\u077F]/;
            if (language === "ar" || ARABIC_REGEX.test(term)) fetchAhadith(term);
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
        fetch(`https://corsproxy.io/?https://dorar.net/dorar_api.json?skey=${term}`)
            .then((response) => response.json())
            .then((data) => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data.ahadith.result, "text/html");
                const hadithElements = Array.from(doc.querySelectorAll(".hadith"));
                const hadithInfoElements = Array.from(doc.querySelectorAll(".hadith-info"));
                const ahadithArray = hadithElements.map((hadith, i) => ({
                    hadith: hadith.innerHTML,
                    hadithInfo: hadithInfoElements[i]?.innerHTML || "",
                }));
                setAhadith(ahadithArray);
                if (ahadithArray.length === 0) setSearchStatus(STATUS.nothingFound);
            })
            .catch((error) => console.error(error));
    }

    return (
        <div
            className="hadith-search"
            style={{ marginTop: `${ahadith.length > 0 ? "5rem" : "30vh"}` }}
        >
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
                        placeholder="Search Hadiths..."
                        onChange={(event) => setSearchBarInput(event.target.value)}
                        value={searchBarInput}
                    />
                    <button type="submit" id="search-button" name="search-button">
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
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
                        addBookmark={addBookmark}
                    />
                ))}

            {ahadith.length === 0 && <p className="empty-label">{searchStatus}</p>}

            {ahadith.length === AHADITH_LIMIT && (
                <button
                    className="more-button"
                    onClick={() =>
                        window.open(`https://dorar.net/hadith/search?q=${searchTerm}`, "_blank")
                    }
                >
                    <b>More</b>
                </button>
            )}
        </div>
    );
}

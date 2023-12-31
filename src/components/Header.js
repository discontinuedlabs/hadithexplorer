import { forwardRef, useEffect, useRef, useImperativeHandle } from "react";
import { useLocalStorage } from "../utils";

function Header(props, ref) {
    const { language, setLanguage } = props;
    const [availableLanguages, setAvailableLanguages] = useLocalStorage("availableLanguages", []);
    const languageSelectRef = useRef(null);

    useEffect(() => {
        const URL = "https://hadeethenc.com/api/v1/languages";
        fetch(URL)
            .then((response) => response.json())
            .then((data) => {
                if (!availableLanguages) setAvailableLanguages([]);
                setAvailableLanguages((prevAvailableLanguages) =>
                    [...prevAvailableLanguages, ...data].filter(
                        (item) => !prevAvailableLanguages.includes(item)
                    )
                );
                languageSelectRef.current.value = language || "en";
            })
            .catch((error) => console.error(error));
    }, []);

    useImperativeHandle(
        ref,
        () => ({
            availableLanguages,
        }),
        [availableLanguages]
    );

    return (
        <header ref={ref}>
            <a href=".">
                <h2 className="title unselectable">HadithExplorer</h2>
            </a>
            <select
                ref={languageSelectRef}
                className="language-select"
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
            >
                {Array.isArray(availableLanguages) &&
                    availableLanguages.map((element) => (
                        <option value={element.code} key={element.code}>
                            {element.native}
                        </option>
                    ))}
            </select>
        </header>
    );
}

export default forwardRef(Header);

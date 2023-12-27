import { forwardRef, useEffect, useRef, useState, useImperativeHandle } from "react";

function Header(props, ref) {
    const { language, setLanguage } = props;
    const [availableLanguages, setAvailableLanguages] = useState([]);
    const languageSelectRef = useRef(null);

    useEffect(() => {
        const URL = "https://hadeethenc.com/api/v1/languages";
        fetch(URL)
            .then((response) => response.json())
            .then((data) => {
                data.forEach((element) => {
                    const newOption = document.createElement("option");
                    newOption.value = element.code;
                    newOption.innerText = element.native;
                    languageSelectRef.current.add(newOption);
                    setAvailableLanguages((prevAvailableLanguages) => [
                        ...prevAvailableLanguages,
                        element.code,
                    ]);
                });
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
            ></select>
        </header>
    );
}

export default forwardRef(Header);

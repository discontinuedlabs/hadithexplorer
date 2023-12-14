import React from "react";

export default function HadithBox(props) {
    const { language, hadith, hadithInfo, autoTranslate, handleSaveClick } =
        props;
    const hadithRef = React.useRef(null);
    const hadithInfoRef = React.useRef(null);
    const [translatedHadith, setTranslatedHadith] = React.useState("");
    const [translatedHadithInfo, setTranslatedHadithInfo] = React.useState("");

    React.useEffect(() => {
        if (hadithRef.current && autoTranslate && language !== "ar") {
            const text = hadithRef.current.textContent;
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=${language}&dt=t&q=${text}`;
            fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    const translatedText = data[0][0][0];
                    setTranslatedHadith(translatedText);
                })
                .catch((error) => console.error(error));
        }
    }, [autoTranslate, language]);

    return (
        <div className="hadith-box">
            <div className="hadithContainer" dir="rtl">
                <b>
                    <div
                        className="hadith"
                        ref={hadithRef}
                        dangerouslySetInnerHTML={{ __html: hadith }} // dorar.net api returns results as html elements
                    ></div>
                </b>
                <div
                    className="hadith-info"
                    ref={hadithInfoRef}
                    dangerouslySetInnerHTML={{ __html: hadithInfo }} // dorar.net api returns results as html elements
                ></div>
            </div>

            {autoTranslate && language !== "ar" && (
                <div className="translation-container">
                    <b id="translatedHadith">{translatedHadith}</b>
                    <p id="translatedHadithInfo">{translatedHadithInfo}</p>
                </div>
            )}

            <div className="user-note">
                <input type="text" name="note-input" className="note-input" />
                <button onClick={handleSaveClick} className="note-save">
                    S
                </button>
            </div>
        </div>
    );
}

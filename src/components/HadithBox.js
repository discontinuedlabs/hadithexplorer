import { useState, useEffect, useRef } from "react";

export default function HadithBox(props) {
    const { language, hadith, hadithInfo, handleSaveClick } = props;
    const hadithRef = useRef(null);
    const hadithInfoRef = useRef(null);
    const [translatedHadith, setTranslatedHadith] = useState("");
    const [translatedHadithInfo, setTranslatedHadithInfo] = useState("");

    // const [translatedHadithInfoNarrator, setTranslatedHadithInfoNarrator] =
    //     useState("");
    // const [translatedHadithInfoCompiler, setTranslatedHadithInfoCompiler] =
    //     useState("");
    // const [translatedHadithInfoSource, setTranslatedHadithInfoSource] =
    //     useState("");
    // const [translatedHadithInfoNumber, setTranslatedHadithInfoNumber] =
    //     useState("");
    // const [translatedHadithInfoRuling, setTranslatedHadithInfoRuling] =
    //     useState("");

    useEffect(() => {
        if (hadithRef.current && language !== "ar") {
            const text = hadithRef.current.textContent;
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=${language}&dt=t&q=${text}`;
            fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    // translated text gets devided into multiple arrays based on its size
                    setTranslatedHadith("");
                    for (let i = 0; i < data[0].length; i++) {
                        setTranslatedHadith(
                            (prevTranslatedHadith) =>
                                prevTranslatedHadith + data[0][i][0]
                        );
                    }
                })
                .catch((error) => console.error(error));
        }
    }, [language]);

    useEffect(() => {
        if (hadithInfoRef.current && language !== "ar") {
            const text = hadithInfoRef.current.textContent;
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=${language}&dt=t&q=${text}`;
            fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data[0][0][0]);
                    // translated text gets devided into multiple arrays based on its size
                    setTranslatedHadithInfo("");
                    for (let i = 0; i < data[0].length; i++) {
                        setTranslatedHadithInfo(
                            (prevTranslatedHadithInfo) =>
                                prevTranslatedHadithInfo + data[0][i][0]
                        );
                    }
                })
                .catch((error) => console.error(error));
        }
    }, [language]);

    const hadithInfoArray = hadithInfo.split('<span class="info-subtitle">');
    const hadithInfoElements = hadithInfoArray.map((info, index) => (
        <div
            key={index}
            dangerouslySetInnerHTML={{
                __html: `<span class="info-subtitle">${info}`,
            }}
        ></div>
    ));

    return (
        <div className="hadith-box">
            <div className="hadithContainer" dir="rtl">
                <b>
                    <div
                        className="hadith"
                        ref={hadithRef}
                        // dorar.net api returns results as html elements
                        dangerouslySetInnerHTML={{ __html: hadith.slice(4) }} // Remove the list numbers
                    ></div>
                </b>
                {/* <div
                    className="hadith-info"
                    ref={hadithInfoRef}
                    dangerouslySetInnerHTML={{ __html: hadithInfo }} // dorar.net api returns results as html elements
                ></div> */}
                <div className="hadith-info" ref={hadithInfoRef}>
                    {hadithInfoElements}
                </div>
            </div>

            {language !== "ar" && (
                <div className="translation-container">
                    <p className="translated-hadith">
                        <b>{translatedHadith}</b>
                    </p>
                    <p className="translated-hadith-info">
                        {translatedHadithInfo}
                    </p>
                </div>
            )}

            {/* {language !== "ar" && (
                <div className="translation-container">
                    <p className="translated-hadith-info-narrator">
                        {translatedHadithInfoNarrator}
                    </p>
                    <p className="translated-hadith-info-compiler">
                        {translatedHadithInfoCompiler}
                    </p>
                    <p className="translated-hadith-info-source">
                        {translatedHadithInfoSource}
                    </p>
                    <p className="translated-hadith-info-number">
                        {translatedHadithInfoNumber}
                    </p>
                    <p className="translated-hadith-info-ruling">
                        {translatedHadithInfoRuling}
                    </p>
                </div>
            )} */}

            <div className="user-note hidden">
                <input type="text" name="note-input" className="note-input" />
                <button onClick={handleSaveClick} className="note-save">
                    S
                </button>
            </div>
        </div>
    );
}

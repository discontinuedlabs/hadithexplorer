import { useState, useEffect, useRef } from "react";

export default function HadithBox(props) {
    const { language, hadithInfo, handleSaveClick } = props;
    const hadithRef = useRef(null);
    const [hadith, setHadith] = useState({
        content: "",
        narrator: "",
        compiler: "",
        source: "",
        number: "",
        ruling: "",
    });
    const [translatedHadith, setTranslatedHadith] = useState({
        content: "",
        narrator: "",
        compiler: "",
        source: "",
        number: "",
        ruling: "",
    });

    // Distribute hadith and hadithInfo into hadith state object
    useEffect(() => {
        let splitHadithInfo = hadithInfo
            .replace(/<span class="info-subtitle">(.*?)<\/span>/g, "|")
            .replace(/\n|<span>|<\/span>/g, "")
            .split("|")
            .filter((value) => value.trim() !== "");
        setHadith({
            content: props.hadith,
            narrator: splitHadithInfo[0],
            compiler: splitHadithInfo[1],
            source: splitHadithInfo[2],
            number: splitHadithInfo[3],
            ruling: splitHadithInfo[4],
        });
    }, [props.hadith, hadithInfo]);

    useEffect(() => {
        if (hadithRef.current && language !== "ar") {
            let splitHadithInfo = hadithInfo
                .replace(/<span class="info-subtitle">(.*?)<\/span>/g, "|")
                .replace(/\n|<span>|<\/span>/g, "")
                .split("|")
                .filter((value) => value.trim() !== "");

            const combinedText = [
                hadithRef.current.textContent,
                ...splitHadithInfo,
            ].join("$||"); // Translate API sometimes removed "|" or "||"

            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=${language}&dt=t&q=${combinedText}`;
            fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    // translated text gets devided into multiple arrays based on its size
                    let translatedText = "";
                    for (let i = 0; i < data[0].length; i++) {
                        translatedText += data[0][i][0];
                    }

                    // is this correct??? after this line
                    const splitTranslatedHadith = translatedText.split("$||"); // Translate API sometimes removed "|" or "||"
                    const keys = Object.keys(translatedHadith);
                    for (let i = 0; i < keys.length; i++) {
                        translatedHadith[keys[i]] = splitTranslatedHadith[i];
                    }
                    console.log(translatedHadith);
                    setTranslatedHadith(translatedHadith);
                    // is this correct??? before this line
                })
                .catch((error) => console.error(error));
        }
    }, [language, hadith]);

    return (
        <div className="hadith-box">
            <div className="hadithContainer" dir="rtl">
                <b>
                    <div
                        className="hadith"
                        ref={hadithRef}
                        // dorar.net api returns results as html elements
                        dangerouslySetInnerHTML={{
                            __html: hadith.content.slice(4), // Remove the list numbers
                        }}
                    ></div>
                </b>

                <div className="hadith-info">
                    <p className="hadith-narrator">الراوي: {hadith.narrator}</p>
                    <p className="hadith-compiler">المحدث: {hadith.compiler}</p>
                    <p className="hadith-source">المصدر: {hadith.source}</p>
                    <p className="hadith-number">
                        الصفحة أو الرقم: {hadith.number}
                    </p>
                    <p className="hadith-ruling">
                        خلاصة حكم المحدث: {hadith.ruling}
                    </p>
                </div>
            </div>

            {language !== "ar" && (
                <div className="translation-container">
                    <b>
                        <div className="translated-hadith">
                            {translatedHadith.content || ""}
                        </div>
                    </b>
                    <div className="translated-hadith-info">
                        <p className="translated-hadith-narrator">
                            Narrator: {translatedHadith.narrator || ""}
                        </p>
                        <p className="translated-hadith-compiler">
                            Compiler: {translatedHadith.compiler || ""}
                        </p>
                        <p className="translated-hadith-source">
                            Source: {translatedHadith.source || ""}
                        </p>
                        <p className="translated-hadith-number">
                            Page or number: {translatedHadith.number || ""}
                        </p>
                        <p className="translated-hadith-ruling">
                            Summary of the Hadith's ruling:{" "}
                            {translatedHadith.ruling || ""}
                        </p>
                    </div>
                </div>
            )}

            <div className="user-note hidden">
                <input type="text" name="note-input" className="note-input" />
                <button onClick={handleSaveClick} className="note-save">
                    S
                </button>
            </div>
        </div>
    );
}

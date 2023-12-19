import { useState, useEffect, useRef } from "react";

export default function HadithBox(props) {
    const { language, hadithInfo } = props;
    const hadithRef = useRef(null);
    const noteTextareaRef = useRef(null);
    const userNoteRef = useRef(null);
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
    const [hadithStyle, setHadithStyle] = useState({
        withDiacritics: "",
        withoutDiacritics: "",
        diacritized: true,
    });
    const [translationState, setTranslationState] = useState("");

    useEffect(() => {
        setHadithStyle({
            withDiacritics: props.hadith,
            withoutDiacritics: props.hadith
                .normalize("NFD")
                .replace(/[\u064B-\u0652\u0670]/g, ""), // u0652 instead of u0655 to preserve Hamza in Alif
            diacritized: true, // Always show the original diacritized style on fetch
        });
    }, [props.hadith]);

    // Distribute hadith and hadithInfo into hadith state object
    useEffect(() => {
        let splitHadithInfo = hadithInfo
            .replace(/<span class="info-subtitle">(.*?)<\/span>/g, "|") // Remove the span elements because they are fixed in hadith-info div
            .replace(/\n|<span>|<\/span>/g, "") // Ruling part has its own extra span tag
            .split("|") // Split them into an array
            .filter((value) => value.trim() !== ""); // Remove the extra empty value in the array
        setHadith({
            content: hadithStyle.diacritized
                ? hadithStyle.withDiacritics
                : hadithStyle.withoutDiacritics, // These are stringified html elements
            narrator: splitHadithInfo[0],
            compiler: splitHadithInfo[1],
            source: splitHadithInfo[2],
            number: splitHadithInfo[3],
            ruling: splitHadithInfo[4],
        });
    }, [hadithStyle, hadithInfo]);

    useEffect(() => {
        if (hadithRef.current && language !== "ar") {
            setTranslationState("Translating...");

            const combinedText = [
                hadithRef.current.textContent, // Don't use hadith.content or hadithStyle values because they are stringified html elements
                hadith.narrator,
                hadith.compiler,
                hadith.source,
                hadith.number,
                hadith.ruling,
            ].join("|||||"); // Translate API sometimes removes the single or doubled vertical line

            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=${language}&dt=t&q=${combinedText}`;
            fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    setTranslationState(null);
                    // translated text gets devided into multiple arrays based on its size
                    let translatedText = "";
                    for (let i = 0; i < data[0].length; i++) {
                        translatedText += data[0][i][0];
                    }

                    // Distribute hadith and hadithInfo into TranslatedHadith state object
                    const splitTranslatedHadith = translatedText.split("|||||");
                    setTranslatedHadith({
                        content: splitTranslatedHadith[0],
                        narrator: splitTranslatedHadith[1],
                        compiler: splitTranslatedHadith[2],
                        source: splitTranslatedHadith[3],
                        number: splitTranslatedHadith[4],
                        ruling: splitTranslatedHadith[5],
                    });
                })
                .catch((error) => {
                    setTranslationState("Failed to translate element.");
                    console.error(error);
                });
        }
    }, [language, hadith]);

    function adjustTextareaHeight(event) {
        event.target.style.height = "auto";
        event.target.style.height = event.target.scrollHeight + "px";
    }

    function handleBookmark() {
        userNoteRef.current.classList.toggle("hidden");
    }

    function handleCopy(event) {
        const type1 = "text/plain";
        const blob1 = new Blob([hadithRef.current.textContent], {
            type: type1,
        });
        const item1 = new ClipboardItem({ [type1]: blob1 });

        const type2 = "text/html";
        const blob2 = new Blob(
            ["<p>" + hadithRef.current.textContent + "</p>"],
            { type: type2 }
        );
        const item2 = new ClipboardItem({ [type2]: blob2 });

        navigator.clipboard.write([item1, item2]);
    }

    function handleDiacritics() {
        setHadithStyle((prevHadithStyle) => ({
            ...prevHadithStyle,
            diacritized: !prevHadithStyle.diacritized,
        }));
    }

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
                    {<p>{translationState}</p> || (
                        <>
                            <b>
                                <div className="translated-hadith">
                                    {translatedHadith.content}
                                </div>
                            </b>
                            <div className="translated-hadith-info">
                                <p className="translated-hadith-narrator">
                                    Narrator: {translatedHadith.narrator}
                                </p>
                                <p className="translated-hadith-compiler">
                                    Compiler: {translatedHadith.compiler}
                                </p>
                                <p className="translated-hadith-source">
                                    Source: {translatedHadith.source}
                                </p>
                                <p className="translated-hadith-number">
                                    Page or number: {translatedHadith.number}
                                </p>
                                <p className="translated-hadith-ruling">
                                    Summary of the Hadith's ruling:{" "}
                                    {translatedHadith.ruling}
                                </p>
                            </div>
                        </>
                    )}
                </div>
            )}

            <div className="user-note hidden" ref={userNoteRef}>
                <textarea
                    placeholder="Type your note here"
                    rows={1}
                    name="note-textarea"
                    className="note-textarea"
                    ref={noteTextareaRef}
                    onChange={adjustTextareaHeight}
                />
                <button className="note-save">S</button>
            </div>

            <div className="options-container">
                <button className="option" onClick={handleCopy}>
                    C
                </button>
                <button className="option" onClick={handleBookmark}>
                    B
                </button>
                <button className="option" onClick={handleDiacritics}>
                    D
                </button>
            </div>
        </div>
    );
}

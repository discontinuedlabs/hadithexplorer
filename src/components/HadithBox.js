import { useState, useEffect, useRef } from "react";
import HadithByKeyword from "./HadithByKeyword";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFeather, faCopy, faCheck, faBookmark } from "@fortawesome/free-solid-svg-icons";

const status = {
    translating: "Translating...",
    success: null,
    failureInStructure: "Failed to identify the translated components: ",
    failureInFetch: "Fialed to translate the Hadith.",
};

export default function HadithBox(props) {
    const { language, hadithInfo } = props;
    const hadithRef = useRef(null);
    const contentTypeRef = useRef(null);
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
    const [translationStatus, setTranslationStatus] = useState("");
    const [userNoteHidden, setUserNoteHidden] = useState(true);

    useEffect(() => {
        // Fix punctuations first
        const cleanedHadith = props.hadith
            .replace(/\s\./g, ".")
            .replace(/\s\./g, ".") // Doubled to replace instances where two dots are together with a space in between. Couldn't resolve the issue with the expression replace(/\.\s\./g, ".")
            .replace(/,/g, "،")
            .replace(/\s،/g, "،")
            .replace(/\s:/g, ":")
            .replace(/\s؛/g, "؛")
            .replace(/\s!/g, "! ")
            .replace(/\(\s/g, "(")
            .replace(/\s\)/g, ")")
            .replace(/{\s/g, "{")
            .replace(/\s}/g, "}")
            .replace(/\[\s/g, "[")
            .replace(/\s\]/g, "]");
        setHadithStyle({
            withDiacritics: cleanedHadith,
            withoutDiacritics: cleanedHadith.normalize("NFD").replace(/[\u064B-\u0652\u0670]/g, ""), // u0652 instead of u0655 to preserve Hamza in Alif
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
        if (
            hadithRef.current &&
            language !== "ar" &&
            !translatedHadith.content // This will ensure it doesnt get translated repetitively whenever handleDiacritics is called
        ) {
            setTranslationStatus(status.translating);

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
                    // translated text gets devided into multiple arrays based on its size
                    let translatedText = "";
                    for (let i = 0; i < data[0].length; i++) {
                        translatedText += data[0][i][0];
                    }

                    const fiexedMutations = translatedText.replace(/\| /g, "|"); // Sometimes, Translate API adds unnecessary spaces between the vertical lines
                    const splitTranslatedHadith = fiexedMutations.split("|||||");

                    // splitTranslatedHadith must always be 6
                    setTranslationStatus(
                        splitTranslatedHadith.length === 6
                            ? null
                            : status.failureInStructure + splitTranslatedHadith
                    );

                    // Distribute hadith and hadithInfo into TranslatedHadith state object
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
                    setTranslationStatus(status.failureInFetch);
                    console.error(error);
                });
        }
    }, [language, hadith]);

    function adjustTextareaHeight(event) {
        event.target.style.height = "auto";
        event.target.style.height = event.target.scrollHeight + "px";
    }

    function handleBookmark() {
        setUserNoteHidden((prevUserNoteHidden) => !prevUserNoteHidden);
    }

    function handleCopy() {
        const type = "text/plain";
        const blob = new Blob([contentTypeRef.current.textContent], {
            type: type,
        });
        const item = new ClipboardItem({ [type]: blob });

        navigator.clipboard.write([item]);
    }

    function handleDiacritics() {
        setHadithStyle((prevHadithStyle) => ({
            ...prevHadithStyle,
            diacritized: !prevHadithStyle.diacritized,
        }));
    }

    function handleNoteSave() {
        return;
    }

    return (
        <div className="hadith-box" style={{ fontSize: "1rem" }}>
            <HadithByKeyword
                hadithRef={hadithRef}
                ref={contentTypeRef}
                hadith={hadith}
                language={language}
                translationStatus={translationStatus}
                translatedHadith={translatedHadith}
            />

            <div className={`user-note ${userNoteHidden && "hidden"}`} ref={userNoteRef}>
                <textarea
                    placeholder="Type your note here"
                    rows={1}
                    name="note-textarea"
                    className="note-textarea"
                    ref={noteTextareaRef}
                    onChange={adjustTextareaHeight}
                />
                <button className="note-save" onClick={handleNoteSave}>
                    <FontAwesomeIcon icon={faCheck} />
                </button>
            </div>

            <div className="options-container">
                <button className="option" onClick={handleCopy}>
                    <FontAwesomeIcon icon={faCopy} />
                </button>
                <button
                    className={`option ${!userNoteHidden && "pressed"}`}
                    onClick={handleBookmark}
                >
                    <FontAwesomeIcon icon={faBookmark} />
                </button>
                <button
                    className={`option ${hadithStyle.diacritized && "pressed"}`}
                    onClick={() => handleDiacritics()}
                >
                    <FontAwesomeIcon icon={faFeather} />
                </button>
            </div>
        </div>
    );
}

import { useEffect, useState, useRef } from "react";

const status = {
    translating: "Translating...",
    success: null,
    failureInStructure: "Failed to identify the translated components: ",
    failureInFetch: "Fialed to translate the Hadith.",
};

export default function HadithByKeyword(props) {
    const { language, hadithInfo } = props;
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
    const [hadithStyle, setHadithStyle] = useState({
        withDiacritics: "",
        withoutDiacritics: "",
        diacritized: true,
    });
    const [translationStatus, setTranslationStatus] = useState("");

    useEffect(() => {
        // Fix punctuations first
        const cleanedHadith = props.hadith
            .replace(/ ،/g, "،")
            .replace(/\. \./g, ".")
            .replace(/ \./g, ".")
            .replace(/ :/g, ":")
            .replace(/ ؛/g, "؛")
            .replace(/\( /g, "(")
            .replace(/ \)/g, ")")
            .replace(/{ /g, "{")
            .replace(/ }/g, "}")
            .replace(/\[ /g, "[")
            .replace(/ \]/g, "]");
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

    function handleDiacritics() {
        setHadithStyle((prevHadithStyle) => ({
            ...prevHadithStyle,
            diacritized: !prevHadithStyle.diacritized,
        }));
    }

    return (
        <div className="hadith-by-keyword content-type">
            <div className="hadith-container" dir="rtl">
                <b>
                    <div
                        className="hadith"
                        ref={hadithRef}
                        // dorar.net api returns results as stringified html elements
                        dangerouslySetInnerHTML={{
                            __html: hadith.content.slice(4), // Remove the list numbers
                        }}
                    ></div>
                </b>

                <div className="hadith-info">
                    <p className="hadith-narrator">الراوي: {hadith.narrator}</p>
                    <p className="hadith-compiler">المحدث: {hadith.compiler}</p>
                    <p className="hadith-source">المصدر: {hadith.source}</p>
                    <p className="hadith-number">الصفحة أو الرقم: {hadith.number}</p>
                    <p className="hadith-ruling">خلاصة حكم المحدث: {hadith.ruling}</p>
                </div>
            </div>

            {language !== "ar" && (
                <div className="translation-container">
                    {(translationStatus && <p>{translationStatus}</p>) || (
                        <>
                            <b>
                                <div className="translated-hadith">{translatedHadith.content}</div>
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
                                    Summary of the Hadith's ruling: {translatedHadith.ruling}
                                </p>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

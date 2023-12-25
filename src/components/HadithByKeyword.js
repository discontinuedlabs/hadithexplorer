import { forwardRef } from "react";

function HadithByKeyword(props, ref) {
    const { hadithRef, hadith, language, translationStatus, translatedHadith } = props;

    return (
        <div className="hadith-by-keyword content-type" ref={ref}>
            <div className="hadith-container" dir="rtl">
                <b>
                    <div
                        className="hadith"
                        ref={hadithRef}
                        // dorar.net api returns results as stringified html elements
                        dangerouslySetInnerHTML={{
                            __html: hadith.content.slice(4) || (
                                <div className="hadith-skeleton"></div>
                            ), // Remove the list numbers
                        }}
                    ></div>
                </b>

                <div className="hadith-info">
                    <p className="hadith-narrator">
                        <span className="static-text">الراوي:</span> {hadith.narrator}
                    </p>
                    <p className="hadith-compiler">
                        <span className="static-text">المحدث:</span> {hadith.compiler}
                    </p>
                    <p className="hadith-source">
                        <span className="static-text">المصدر:</span> {hadith.source}
                    </p>
                    <p className="hadith-number">
                        <span className="static-text">الصفحة أو الرقم:</span> {hadith.number}
                    </p>
                    <p className="hadith-ruling">
                        <span className="static-text">خلاصة حكم المحدث:</span> {hadith.ruling}
                    </p>
                </div>
            </div>

            {language !== "ar" && (
                <div className="translation-container">
                    {(translationStatus && (
                        <p className="translation-status">{translationStatus}</p>
                    )) || (
                        <>
                            <b>
                                <div className="translated-hadith">{translatedHadith.content}</div>
                            </b>
                            <div className="translated-hadith-info">
                                <p className="translated-hadith-narrator">
                                    <span className="static-text">Narrator:</span>{" "}
                                    {translatedHadith.narrator}
                                </p>
                                <p className="translated-hadith-compiler">
                                    <span className="static-text">Compiler:</span>{" "}
                                    {translatedHadith.compiler}
                                </p>
                                <p className="translated-hadith-source">
                                    <span className="static-text">Source:</span>{" "}
                                    {translatedHadith.source}
                                </p>
                                <p className="translated-hadith-number">
                                    <span className="static-text">Page or number:</span>{" "}
                                    {translatedHadith.number}
                                </p>

                                <p className="translated-hadith-ruling">
                                    <span className="static-text">
                                        Summary of the Hadith's ruling:
                                    </span>{" "}
                                    {translatedHadith.ruling}
                                </p>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default forwardRef(HadithByKeyword);

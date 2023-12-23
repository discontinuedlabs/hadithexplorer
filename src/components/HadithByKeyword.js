import { useEffect, useState, useRef } from "react";

export default function HadithByKeyword(props) {
    const { hadithRef, hadith, language, translationStatus, translatedHadith } = props;

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

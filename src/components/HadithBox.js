import React from "react";

export default function HadithBox(props) {
    return (
        <div dir="rtl" className="hadith-box">
            <div className="hadithContainer">
                <div
                    dir="rtl" // always rtl
                    className="hadith"
                    dangerouslySetInnerHTML={{ __html: props.hadith }} // dorar.net api returns results as html elements
                ></div>
                <div
                    className="hadith-info"
                    dangerouslySetInnerHTML={{ __html: props.hadithInfo }} // dorar.net api returns results as html elements
                ></div>
            </div>

            {props.autoTranslate && <p id="translatedHadith">translated text</p>}

            <div className="user-note">
                <input type="text" />
                <button>Save</button>
            </div>
        </div>
    );
}

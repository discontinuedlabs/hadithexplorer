import { useState, useEffect, useRef } from "react";
import HadithByKeyword from "./HadithByKeyword";

export default function HadithBox(props) {
    const contentTypeRef = useRef(null);
    const noteTextareaRef = useRef(null);
    const userNoteRef = useRef(null);

    function adjustTextareaHeight(event) {
        event.target.style.height = "auto";
        event.target.style.height = event.target.scrollHeight + "px";
    }

    function handleBookmark() {
        userNoteRef.current.classList.toggle("hidden");
    }

    function handleCopy() {
        console.log(contentTypeRef);
        const type = "text/plain";
        const blob = new Blob([contentTypeRef.current.textContent], {
            type: type,
        });
        const item = new ClipboardItem({ [type]: blob });

        navigator.clipboard.write([item]);
    }

    return (
        <div className="hadith-box">
            <div ref={contentTypeRef}>
                <HadithByKeyword {...props} />
            </div>

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
                <button
                    className="option"
                    onClick={() => contentTypeRef.current.handleDiacritics()}
                >
                    D
                </button>
            </div>
        </div>
    );
}

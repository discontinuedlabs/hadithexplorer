import { useState, useEffect, useRef } from "react";
import HadithByKeyword from "./HadithByKeyword";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFeather, faCopy, faCheck, faBookmark } from "@fortawesome/free-solid-svg-icons";

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
            <HadithByKeyword {...props} ref={contentTypeRef} />

            <div className="user-note hidden" ref={userNoteRef}>
                <textarea
                    placeholder="Type your note here"
                    rows={1}
                    name="note-textarea"
                    className="note-textarea"
                    ref={noteTextareaRef}
                    onChange={adjustTextareaHeight}
                />
                <button className="note-save">
                    <FontAwesomeIcon icon={faCheck} />
                </button>
            </div>

            <div className="options-container">
                <button className="option" onClick={handleCopy}>
                    <FontAwesomeIcon icon={faCopy} />
                </button>
                <button className="option" onClick={handleBookmark}>
                    <FontAwesomeIcon icon={faBookmark} />
                </button>
                <button
                    className={`option ${
                        contentTypeRef.current?.hadithStyle.diacritized ? "pressed" : ""
                    }`}
                    onClick={() => contentTypeRef.current?.handleDiacritics()}
                >
                    <FontAwesomeIcon icon={faFeather} />
                </button>
            </div>
        </div>
    );
}

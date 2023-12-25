import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faCheck, faTrash, faPalette } from "@fortawesome/free-solid-svg-icons";

export default function Bookmark(props) {
    const { contentObject, updateBookmarkValues, setBookmarks, bookmarks } = props;
    const [content, setContent] = useState("");
    const [userNote, setUserNote] = useState("");
    const [noteColor, setNoteColor] = useState("");
    const userNoteRef = useRef(null);
    const bookmarkRef = useRef(null);

    useEffect(() => {
        setContent(contentObject.content.replace(/class="search-keys"/g, "")); // Remove the styling of keywords
        setUserNote(contentObject.userNote);
        setNoteColor(contentObject.noteColor);

        setTimeout(() => {
            userNoteRef.current.style.height = userNoteRef.current.scrollHeight + "px";
        }, 1);
    }, [contentObject]);

    function handleTextareaChange(event) {
        const newText = event.target.value;
        setUserNote(newText);
        updateBookmarkValues(contentObject.id, { userNote: newText });
        event.target.style.height = event.target.scrollHeight + "px";
    }

    function handleColor() {
        return;
    }

    function handleDelete() {
        setBookmarks(bookmarks.filter((bookmark) => bookmark.id !== contentObject.id));
    }

    function handleCopy() {
        const type = "text/plain";
        const blob = new Blob([bookmarkRef.current.outerText], {
            type: type,
        });
        const item = new ClipboardItem({ [type]: blob });

        navigator.clipboard.write([item]);
    }

    return (
        <div className="bookmark" ref={bookmarkRef}>
            <div
                dangerouslySetInnerHTML={{
                    __html: content,
                }}
            ></div>

            <textarea
                ref={userNoteRef}
                value={userNote}
                placeholder="Type your note here"
                rows={1}
                name="note-textarea"
                className="note-textarea"
                onChange={handleTextareaChange}
            />

            <div className="options-container">
                <button className="option" onClick={handleCopy}>
                    <FontAwesomeIcon icon={faCopy} />
                </button>
                <button className="option" onClick={handleColor}>
                    <FontAwesomeIcon icon={faPalette} />
                </button>
                <button className="option">
                    <FontAwesomeIcon icon={faTrash} onClick={handleDelete} />
                </button>
            </div>
        </div>
    );
}

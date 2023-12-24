export default function Header(props) {
    const { language, setLanguage } = props;
    return (
        <header>
            <a href=".">
                <h2 className="title unselectable">HadithExplorer</h2>
            </a>
            <select
                className="language-select"
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
            >
                <option value="en">English</option>
                <option value="ar">عربي</option>
            </select>
        </header>
    );
}

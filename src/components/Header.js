export default function Header(props) {
    const { language, setLanguage } = props;
    return (
        <header>
            <a href=".">
                <h2>
                    {/* <img
                        src={
                            process.env.PUBLIC_URL +
                            "/images/favicons/android-chrome-512x512.png"
                        }
                        alt="Hadith Explorer logo"
                        width="50px"
                    /> */}
                    HadithExplorer
                </h2>
            </a>
            <select
                name="language-select"
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
            >
                <option value="en">English</option>
                <option value="ar">عربي</option>
            </select>
        </header>
    );
}

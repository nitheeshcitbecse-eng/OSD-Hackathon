import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

function Navbar(){

    const {darkMode, toggleTheme} = useContext(ThemeContext);

    return(
        <nav className="navbar">

            <h2>AI Guardian</h2>

            <div>
                <button onClick={toggleTheme}>
                    {darkMode ? "☀️ Light" : "🌙 Dark"}
                </button>
            </div>

        </nav>
    )
}

export default Navbar;
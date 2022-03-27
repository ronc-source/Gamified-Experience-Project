//Navbar component for the website - Uses bootstrap styling

function Navbar() {
    return (
        <nav className = "navbar navbar-expand-lg navbar-light bg-dark">
            <div className = "container-fluid">
                <a className = "navbar-brand text-light" href = "/home">
                    Facial Emotion Recognition
                </a>

                <ul className = "navbar-nav">
                    <li className = "nav-item">
                        <a className = "nav-link text-light" href = "/home">
                            Home
                        </a>
                    </li>

                    <li className = "nav-item">
                        <a className = "nav-link text-light" href = "/service">
                            Service
                        </a>
                    </li>

                    <li className = "nav-item">
                        <a className = "nav-link text-light" href = "/history">
                            History
                        </a>
                    </li>
                </ul>

            </div>
        </nav>
    );
}

export default Navbar;
export function About() {
    return (
        <section className="about">
            <h1>About Page</h1>
            <p>
                This project is a collaborative effort between Ran and Or-Ran, aimed at recreating
                and enhancing the core functionality of Google's Gmail and Keep applications. Our
                goal is to build a comprehensive web application that demonstrates advanced
                front-end development skills while providing users with an intuitive and powerful
                productivity platform.
            </p>
            <p>
                The Mail application replicates Gmail's essential features, including inbox
                management, email composition, folder organization, and email viewing. Meanwhile,
                the Note application mirrors Google Keep's functionality, allowing users to create,
                edit, organize, and manage notes with ease.
            </p>
            <p>
                Through this project, we've explored modern web development practices,
                component-based architecture, and user experience design. We've strived to create an
                application that not only functions well but also provides a smooth and enjoyable
                user experience that matches the quality of the applications that inspired it.
            </p>
            <div className="cards">
                <div className="about-card">
                    <img className="about-img" src="./assets/img/orran.png" alt="Profile" />

                    <h2 className="about-name">Or-Ran Bachar</h2>

                    <p className="about-description">
                        Chief keeper of sticky notes, breaker of layouts, professional bug creator,
                        occasional bug fixer, and architect of DOM chaos that makes Prettier drink
                        coffee.
                    </p>
                </div>

                <div className="about-card">
                    <img className="about-img" src="./assets/img/ran.jpeg" alt="Profile" />

                    <h2 className="about-name">Ran Hirschorn</h2>

                    <p className="about-description">
                        They said "build a Gmail clone for practice" -
                        I said "how hard could it be?" (Narrator: It was hard.) 
                        HI, I'm Ran Hirschoorn, now a humbled developer who respects email developers way more than before. 
                        Send sympathy... or bug reports.
                    </p>
                </div>
            </div>
        </section>
    )
}

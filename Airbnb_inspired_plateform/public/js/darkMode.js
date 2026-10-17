
//    WANDERLUST DARK MODE
document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("themeToggle");
    if (!themeToggle) return;
    const themeIcon = themeToggle.querySelector("i");
    const savedTheme = localStorage.getItem("wanderlust-theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        document.documentElement.classList.add("dark-mode");
        themeIcon.classList.remove("fa-moon");
        themeIcon.classList.add("fa-sun");
        themeToggle.setAttribute(
            "aria-label",
            "Switch to light mode"
        );
    }


    themeToggle.addEventListener("click", () => {
        const isDark =
            document.body.classList.toggle("dark-mode");
        document.documentElement.classList.toggle(
            "dark-mode",
            isDark
        );

        if (isDark) {
            localStorage.setItem(
                "wanderlust-theme",
                "dark"
            );

            themeIcon.classList.remove("fa-moon");
            themeIcon.classList.add("fa-sun");
            themeToggle.setAttribute(
                "title",
                "Switch to light mode"
            );

        } else {

            localStorage.setItem(
                "wanderlust-theme",
                "light"
            );

            themeIcon.classList.remove("fa-sun");
            themeIcon.classList.add("fa-moon");

            themeToggle.setAttribute(
                "title",
                "Switch to dark mode"
            );

        }

    });

});
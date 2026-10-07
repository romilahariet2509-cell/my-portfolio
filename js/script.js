const themeButton = document.getElementById("theme-toggle");

// Check saved theme when the page loads
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");

    if (themeButton) {
        themeButton.textContent = "Light Mode";
    }
}

// Change theme when button is clicked
if (themeButton) {

    themeButton.addEventListener("click", function () {

        const currentTheme =
            document.documentElement.getAttribute("data-theme");

        if (currentTheme === "dark") {

            document.documentElement.removeAttribute("data-theme");
            localStorage.setItem("theme", "light");
            themeButton.textContent = "Dark Mode";

        } else {

            document.documentElement.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
            themeButton.textContent = "Light Mode";

        }

    });

}
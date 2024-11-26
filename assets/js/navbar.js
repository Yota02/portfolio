document.getElementById("toggle-btn").addEventListener("click", function() {
    const navbar = document.getElementById("navbar");
    const arrow = document.getElementById("arrow");
    const content = document.querySelector(".portfolio-container");
    const toggleBtn = document.getElementById("toggle-btn");

    if (navbar.style.right === "-200px" || navbar.style.right === "") {
        navbar.style.right = "0";
        content.classList.add("open");
        arrow.style.transform = "rotate(180deg)";
        toggleBtn.classList.add("open");
    } else {
        navbar.style.right = "-200px";
        content.classList.remove("open");
        arrow.style.transform = "rotate(0deg)";
        toggleBtn.classList.remove("open");
    }
});
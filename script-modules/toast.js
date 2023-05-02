let timer1, timer2, startTime, remainingTime1, remainingTime2;

function updateProgressBarWidth(progress, width) {
    progress.querySelector(":before").style.width = `${width}%`;
}


export function handleVisibilityChange() {
    const progress = document.querySelector(".progress");

    if (document.hidden) {
        // Calculate the remaining time for the timers
        remainingTime1 = Math.max(0, 5000 - (Date.now() - startTime));
        remainingTime2 = Math.max(0, 5300 - (Date.now() - startTime));

        // Clear the existing timeouts
        clearTimeout(timer1);
        clearTimeout(timer2);

        // Calculate the progress bar width and update it
        const width = (1 - remainingTime1 / 5000) * 100;
        updateProgressBarWidth(progress, width);
    } else {
        // Set new timeouts with the remaining time
        timer1 = setTimeout(() => {
            const toast = document.querySelector(".toast");
            toast.classList.remove("active");
            toast.style.display = "none"; // Hide the toast
        }, remainingTime1);

        timer2 = setTimeout(() => {
            progress.classList.remove("active");
            toast.style.display = "none"; // Hide the toast
        }, remainingTime2);

        // Resume the progress bar animation
        progress.animate(
            [
                { width: `${(1 - remainingTime1 / 5000) * 100}%` },
                { width: "100%" },
            ],
            {
                duration: remainingTime1,
                fill: "forwards",
                easing: "linear",
            }
        );
    }
}



export function showToast(isGood, headingText, messageText) {
    const toast = document.querySelector(".toast");
    const closeIcon = document.querySelector(".close");
    const progress = document.querySelector(".progress");
    const heading = document.querySelector(".toast .text-1");
    const message = document.querySelector(".toast .text-2");
    const check = document.querySelector(".toast .check");

    // Update the heading and message text
    heading.textContent = headingText;
    message.textContent = messageText;

    // Set the colors based on isGood
    const mainColor = isGood ? "#4070f4" : "#f44336";
    toast.style.borderColor = mainColor;
    check.style.backgroundColor = mainColor;
    toast.classList.toggle("is-good", isGood);
    toast.classList.toggle("is-bad", !isGood);

    // Update the Font Awesome icon class based on isGood
    const iconClass = isGood ? "fas fa-solid fa-check" : "fas fa-solid fa-times";
    check.className = `icon check ${iconClass}`;

    // Display the toast
    toast.style.display = "block";
    toast.classList.add("active");
    progress.classList.add("active");

    startTime = Date.now();
    timer1 = setTimeout(() => {
        toast.classList.remove("active");
    }, 5000);

    timer2 = setTimeout(() => {
        progress.classList.remove("active");
    }, 5300);
    progress.animate(
        [
            { width: "0%" },
            { width: "100%" },
        ],
        {
            duration: 5000,
            fill: "forwards",
            easing: "linear",
        }
    );
    closeIcon.addEventListener("click", () => {
        toast.classList.remove("active");
        setTimeout(() => {
            progress.classList.remove("active");
            toast.style.display = "none"; // Hide the toast
        }, 300);
        clearTimeout(timer1);
        clearTimeout(timer2);
    });
}

//some new changes
const phrases = ["Hi, I am Jatin Rawat", "Welcome to my website"];
const typewriter = document.querySelector("#typewriter");
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#main-nav");
const contactForm = document.querySelector(".contact-form");
const formStatus = document.querySelector(".form-status");
const successDialog = document.querySelector("#success-dialog");
const closeDialog = document.querySelector(".dialog-close");

let phraseIndex = 0;
let characterIndex = 0;
let deleting = false;

function animateGreeting() {
  const phrase = phrases[phraseIndex];
  typewriter.textContent = phrase.slice(0, characterIndex);

  if (!deleting && characterIndex < phrase.length) {
    characterIndex += 1;
    window.setTimeout(animateGreeting, 92);
    return;
  }

  if (!deleting) {
    deleting = true;
    window.setTimeout(animateGreeting, 1350);
    return;
  }

  if (characterIndex > 0) {
    characterIndex -= 1;
    window.setTimeout(animateGreeting, 48);
    return;
  }

  deleting = false;
  phraseIndex = (phraseIndex + 1) % phrases.length;
  window.setTimeout(animateGreeting, 350);
}

animateGreeting();

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  mainNav.classList.toggle("open", !isOpen);
});

mainNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    mainNav.classList.remove("open");
  }
});

// If an icon CDN misses an asset, keep the skill card's name visible and useful.
document.querySelectorAll(".skill-card img, .float-chip img").forEach((icon) => {
  icon.addEventListener("error", () => { icon.hidden = true; });
});

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitButton = contactForm.querySelector("[type='submit']");
  const originalButtonText = submitButton.innerHTML;
  submitButton.disabled = true;
  submitButton.innerHTML = 'Sending <span aria-hidden="true">…</span>';
  formStatus.hidden = true;
  formStatus.textContent = "";

  try {
    const response = await fetch(contactForm.action, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(contactForm).entries())),
    });
    const result = await response.json();
    if (!response.ok || result.success === false || result.success === "false") {
      throw new Error(result.message || "The message could not be sent.");
    }

    contactForm.reset();
    successDialog.showModal();
  } catch (error) {
    formStatus.textContent = "Sorry, your message could not be sent. Please try again or email jatinsinghrawat759@gmail.com directly.";
    formStatus.hidden = false;
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = originalButtonText;
  }
});

closeDialog.addEventListener("click", () => successDialog.close());
successDialog.addEventListener("click", (event) => {
  if (event.target === successDialog) successDialog.close();
});

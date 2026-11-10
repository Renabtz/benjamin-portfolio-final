/* ==========================================================================
   contact.js | form validation (runs only on contact.html)

   Rules required by the assignment:
     1. No field may be empty
     2. The email must have a valid format
     3. The phone number must contain digits only

   Design:
     Each field has a small validator function that returns an error
     message ("" means the value is fine). The same functions are used
     while typing, when leaving a field, and when submitting.
   ========================================================================== */

"use strict";

/* ---------- VALIDATORS ---------- */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;   // something@domain.tld
const DIGITS_ONLY = /^\d+$/;                              // only characters 0 to 9

const validators = {
  name(value) {
    if (value === "") return "Please enter your name.";
    if (value.length < 2) return "Name must be at least 2 characters.";
    return "";
  },
  email(value) {
    if (value === "") return "Please enter your email address.";
    if (!EMAIL_PATTERN.test(value)) return "Enter a valid email address, like name@example.com.";
    return "";
  },
  phone(value) {
    if (value === "") return "Please enter your phone number.";
    if (!DIGITS_ONLY.test(value)) return "Phone number must contain digits only (no spaces, dashes or + sign).";
    if (value.length < 7 || value.length > 15) return "Phone number must be between 7 and 15 digits.";
    return "";
  },
  message(value) {
    if (value === "") return "Please write a message.";
    if (value.length < 10) return "Message must be at least 10 characters.";
    return "";
  }
};

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("contact-form");
  const successBox = document.getElementById("form-success");
  const successText = document.getElementById("success-text");
  const summary = document.getElementById("form-summary");
  const submitBtn = document.getElementById("submit-btn");
  const submitText = document.getElementById("submit-text");
  const counter = document.getElementById("count-message");

  const fieldNames = Object.keys(validators);              // ["name","email","phone","message"]
  const touched = {};                                      // which fields the user has visited

  /* Show or clear the error for one field. Returns true when the field is valid. */
  function checkField(name) {
    const input = document.getElementById(name);
    const wrapper = document.getElementById("field-" + name);
    const errorEl = document.getElementById("error-" + name);
    const message = validators[name](input.value.trim());

    errorEl.textContent = message;
    wrapper.classList.toggle("field--invalid", message !== "");
    wrapper.classList.toggle("field--valid", message === "");
    input.setAttribute("aria-invalid", message !== "" ? "true" : "false");
    return message === "";
  }

  /* Live validation: check when the user leaves a field, then on every keystroke */
  fieldNames.forEach((name) => {
    const input = document.getElementById(name);
    input.addEventListener("blur", () => { touched[name] = true; checkField(name); });
    input.addEventListener("input", () => { if (touched[name]) checkField(name); });
  });

  /* Character counter for the message box */
  const messageBox = document.getElementById("message");
  messageBox.addEventListener("input", () => {
    counter.textContent = messageBox.value.length + " / " + messageBox.maxLength;
  });

  /* ---------- SUBMIT ---------- */
  form.addEventListener("submit", (e) => {
    e.preventDefault();                                   // we handle the submit ourselves
    summary.textContent = "";

    // Validate EVERY field (not just the first error) so the user sees everything at once
    let firstInvalid = null;
    fieldNames.forEach((name) => {
      touched[name] = true;
      if (!checkField(name) && firstInvalid === null) firstInvalid = name;
    });

    if (firstInvalid !== null) {
      summary.textContent = "Please fix the highlighted fields and try again.";
      document.getElementById(firstInvalid).focus();      // jump to the first problem
      return;
    }

    // Spam trap: bots fill the hidden "website" field. Pretend success, do nothing.
    const isBot = document.getElementById("website").value !== "";

    // Simulate sending (this is a demo form, nothing leaves the browser)
    submitBtn.disabled = true;
    submitText.textContent = "Sending...";

    setTimeout(() => {
      const firstName = document.getElementById("name").value.trim().split(" ")[0];
      successText.textContent = isBot
        ? "Thank you for reaching out."
        : "Thank you, " + firstName + "! Your message has been received. This is a demo form, so for a reply please email me directly.";   // textContent: safe from HTML injection

      form.hidden = true;
      successBox.hidden = false;
      successBox.focus();                                  // move focus for screen readers
      submitBtn.disabled = false;
      submitText.textContent = "Send message";
    }, 900);
  });

  /* "Send another message" resets everything */
  document.getElementById("send-another").addEventListener("click", () => {
    form.reset();
    fieldNames.forEach((name) => {
      touched[name] = false;
      document.getElementById("error-" + name).textContent = "";
      const wrapper = document.getElementById("field-" + name);
      wrapper.classList.remove("field--invalid", "field--valid");
      document.getElementById(name).removeAttribute("aria-invalid");
    });
    counter.textContent = "0 / " + messageBox.maxLength;
    successBox.hidden = true;
    form.hidden = false;
    document.getElementById("name").focus();
  });
});

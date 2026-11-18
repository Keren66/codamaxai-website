// CodaMax | www.codamaxai.com
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  // Footer year
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Header border on scroll
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile navigation
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("main-nav");
  function setNav(open) {
    if (!toggle || !nav) return;
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setNav(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setNav(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setNav(false);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 760) setNav(false);
    });
  }

  // Reveal on scroll
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 80 + "ms";
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  // Malaysia local time (GMT+8)
  var clock = document.getElementById("hq-time");
  if (clock) {
    var fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kuala_Lumpur", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
    });
    var tick = function () { clock.textContent = fmt.format(new Date()) + " MYT"; };
    tick();
    setInterval(tick, 1000);
  }

  // Contact form: simulated send for demo purposes. Nothing leaves the browser.
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");
  var body = document.getElementById("form-body");
  var success = document.getElementById("form-success");
  var successTitle = document.getElementById("success-title");
  var successText = document.getElementById("success-text");
  var resetBtn = document.getElementById("form-reset");
  var sendBtn = form && form.querySelector(".btn-send");
  var sendLabel = sendBtn && sendBtn.querySelector(".btn-label");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var SEND_MS = reduceMotion ? 300 : 1800;

  if (form && body && success && sendBtn) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (form.classList.contains("is-sending")) return;

      var name = form.elements.name;
      var email = form.elements.email;
      var ok = true;
      [name, email].forEach(function (input) {
        var valid = input.value.trim() !== "" && input.checkValidity();
        input.setAttribute("aria-invalid", String(!valid));
        if (!valid) ok = false;
      });
      if (!ok) {
        status.textContent = "Please add your name and a valid work email.";
        status.classList.add("error");
        return;
      }
      status.classList.remove("error");
      status.textContent = "";

      // 1) Sending state
      form.classList.add("is-sending");
      form.setAttribute("aria-busy", "true");
      sendLabel.textContent = "Sending…";

      // 2) Success state
      window.setTimeout(function () {
        var first = name.value.trim().split(/\s+/)[0];
        successText.textContent = "Thanks, " + first + ". Our team will get back to you at " +
          email.value.trim() + " shortly.";
        form.classList.remove("is-sending");
        form.removeAttribute("aria-busy");
        form.classList.add("is-sent");
        body.setAttribute("inert", "");
        body.setAttribute("aria-hidden", "true");
        success.hidden = false;
        successTitle.focus({ preventScroll: true });
      }, SEND_MS);
    });

    resetBtn.addEventListener("click", function () {
      form.reset();
      form.querySelectorAll('[aria-invalid]').forEach(function (el) { el.removeAttribute("aria-invalid"); });
      form.classList.remove("is-sent");
      body.removeAttribute("inert");
      body.removeAttribute("aria-hidden");
      success.hidden = true;
      sendLabel.textContent = "Send enquiry";
      status.textContent = "";
      form.elements.name.focus();
    });
  }
})();

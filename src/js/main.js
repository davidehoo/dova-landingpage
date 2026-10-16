const box = document.querySelector("#nav-toggle");
const nav = document.querySelector("#site-nav");

if (box && nav) {
  const close = () => {
    box.checked = false;
  };

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", close);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });

  document.addEventListener("click", (event) => {
    if (!box.checked) return;
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (nav.contains(target) || target === box) return;
    const label = document.querySelector("label[for='nav-toggle']");
    if (label && label.contains(target)) return;
    close();
  });
}

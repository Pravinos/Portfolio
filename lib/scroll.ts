export const NAV_SCROLL_OFFSET = 80;

export function scrollToSection(
  sectionId: string,
  behavior: ScrollBehavior = "smooth",
) {
  const element = document.getElementById(sectionId);
  if (!element) return;

  const top =
    element.getBoundingClientRect().top +
    window.scrollY -
    NAV_SCROLL_OFFSET;

  window.scrollTo({ top, behavior });
}

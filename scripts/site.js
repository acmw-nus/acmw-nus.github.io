import { aboutPage } from "../content/about.js";
import { eventsPage } from "../content/events-page.js";
import { homePage } from "../content/home.js";
import { joinPage } from "../content/join-page.js";
import { site } from "../content/site.js";
import { teamPage } from "../content/team-page.js";

const pages = {
  home: homePage,
  about: aboutPage,
  events: eventsPage,
  team: teamPage,
  join: joinPage,
};

const page = document.body.dataset.page || "home";
const pageData = pages[page];
const main = document.querySelector("[data-page-content]");
const isHomePage = page === "home";

updateDocumentMetadata(pageData);

if (main) {
  main.innerHTML = `
    ${renderHeader()}
    <main class="site-main">
      <div class="container">
        ${renderPage(page)}
      </div>
    </main>
    ${renderFooter()}
  `;

  if (page === "join" && typeof main.querySelectorAll === "function") {
    initializeJoinTabs(main);
  }
}

function renderHeader() {
  const brand = renderBrand();
  const navLinks = toArray(site.navigation)
    .map(renderNavLink)
    .filter(Boolean)
    .join("");

  if (!brand && !navLinks) {
    return "";
  }

  return `
    <header class="site-header">
      <div class="container site-header__inner">
        ${brand}
        ${navLinks ? `<nav class="site-nav" aria-label="Primary">${navLinks}</nav>` : ""}
      </div>
    </header>
  `;
}

function renderBrand() {
  const chapter = site.chapter || {};
  const logo = value(chapter.logo);
  const name = value(chapter.name);
  const location = value(chapter.location);
  const shortName = value(chapter.shortName);
  const brandSuffix = value(chapter.brandSuffix);

  if (!logo && !name && !location) {
    return "";
  }

  return `
    <a class="brand" href="${attr(getPageHref("home"))}" aria-label="${attr(`Go to ${shortName || name || "home"} home page`)}">
      ${logo ? `<img class="brand__logo" src="${attr(getAssetHref(logo))}" alt="${attr(chapter.logoAlt || `${shortName || name} logo`)}">` : ""}
      ${name || location
        ? `<div class="brand__copy">
            ${location ? `<p class="brand__eyebrow">${html(location)}</p>` : ""}
            ${name ? `<p class="brand__title">${html(name)}${brandSuffix ? ` <span>${html(brandSuffix)}</span>` : ""}</p>` : ""}
          </div>`
        : ""}
    </a>
  `;
}

function renderNavLink(item) {
  const label = value(item?.label);
  const href = getLinkHref(item);

  if (!label || !href) {
    return "";
  }

  const current = item.page === page;
  return `<a href="${attr(href)}" ${current ? 'aria-current="page"' : ""}>${html(label)}</a>`;
}

function renderFooter() {
  const chapter = site.chapter || {};
  const shortName = value(chapter.shortName);
  const location = value(chapter.location);
  const links = toArray(site.socialLinks)
    .map(renderFooterLink)
    .filter(Boolean)
    .join("");
  const chapterDetails = shortName || location
    ? `<div>
        ${shortName ? `<strong>${html(shortName)}</strong>` : ""}
        ${location ? `<div>${html(location)}</div>` : ""}
      </div>`
    : "";

  if (!chapterDetails && !links) {
    return "";
  }

  return `
    <footer class="footer">
      <div class="container footer__inner">
        ${chapterDetails}
        ${links ? `<div class="footer__links">${links}</div>` : ""}
      </div>
    </footer>
  `;
}

function renderFooterLink(item) {
  const label = value(item?.label);
  const href = value(item?.href);

  if (!label || !href) {
    return "";
  }

  const external = isExternalHref(href);
  return `<a href="${attr(href)}" ${external ? 'target="_blank" rel="noreferrer"' : ""}>${html(label)}</a>`;
}

function renderPage(currentPage) {
  if (currentPage === "home") {
    return renderHomePage(homePage);
  }

  if (currentPage === "about") {
    return renderAboutPage(aboutPage);
  }

  if (currentPage === "events") {
    return renderEventsPage(eventsPage);
  }

  if (currentPage === "team") {
    return renderTeamPage(teamPage);
  }

  if (currentPage === "join") {
    return renderJoinPage(joinPage);
  }

  return renderNotFoundPage();
}

function renderHomePage(data) {
  const hero = data.hero || {};
  const heroActions = renderActionRow(hero.actions, "hero__actions");
  const heroImage = value(hero.image || site.chapter?.logo);
  const eventsPreview = data.eventsPreview || {};
  const eventLimit = Number.isFinite(eventsPreview.limit) ? eventsPreview.limit : 2;
  const visibleEvents = toArray(eventsPage.events).slice(0, eventLimit);

  return `
    ${value(hero.heading) || value(hero.intro) || heroActions || heroImage
        ? `<section class="hero">
          <div class="hero__inner${heroImage ? "" : " hero__inner--text-only"}">
            <div>
              ${value(hero.heading) ? `<h1>${html(hero.heading)}</h1>` : ""}
              ${value(hero.intro) ? `<p>${html(hero.intro)}</p>` : ""}
              ${heroActions}
            </div>
            ${heroImage
              ? `<aside class="hero__panel">
                  <img src="${attr(getAssetHref(heroImage))}" alt="${attr(hero.imageAlt || site.chapter?.logoAlt || "")}">
                </aside>`
              : ""}
          </div>
        </section>`
      : ""}

    ${renderEventSection({
      heading: eventsPreview.heading,
      intro: eventsPreview.intro,
      events: visibleEvents,
      emptyState: eventsPreview.emptyState,
    })}
  `;
}

function renderAboutPage(data) {
  const missionCards = [data.missionAlignment, data.chapterIdentity];
  const contextCards = [
    { title: data.context?.fitTitle, text: data.context?.fitText },
    { title: data.context?.whyTitle, text: data.context?.whyText },
  ];
  const pillars = toArray(data.pillars?.items);

  return `
    ${renderPageHeading(data)}

    ${renderCardSection({
      cards: missionCards,
      gridClass: "grid--two",
    })}

    ${renderAffiliationSection({
      heading: data.context?.title,
      intro: data.context?.intro,
      cards: contextCards,
      gridClass: "grid--two",
      logo: data.context?.logo,
      logoAlt: data.context?.logoAlt,
    })}

    ${renderPillarSection({
      heading: data.pillars?.title,
      intro: data.pillars?.intro,
      items: pillars,
    })}
  `;
}

function renderEventsPage(data) {
  return `
    ${renderPageHeading(data)}
    ${renderEventSection({
      events: data.events,
      emptyState: data.emptyState,
    })}
  `;
}

function renderTeamPage(data) {
  const members = toArray(data.members);

  return `
    ${renderPageHeading(data)}

    ${members.length || value(data.emptyState)
      ? `<section class="section">
          ${members.length
            ? `<div class="grid grid--two">${members.map(renderMember).filter(Boolean).join("")}</div>`
            : renderUtilityNote(data.emptyState)}
        </section>`
      : ""}

    ${renderCallout(data.callout)}
  `;
}

function renderJoinPage(data) {
  const tabs = toArray(data.tabs);

  if (tabs.length) {
    return `
      ${renderPageHeading(data)}
      ${renderJoinTabs(tabs)}
    `;
  }

  const application = data.application || {};
  const formAction = getJoinFormAction(data);
  const applicationPanel = value(application.title) || value(application.text) || formAction
    ? `<div class="section__cta section__cta--stacked">
        ${value(application.title) || value(application.text)
          ? `<div>
              ${value(application.title) ? `<h3>${html(application.title)}</h3>` : ""}
              ${value(application.text) ? `<p>${html(application.text)}</p>` : ""}
            </div>`
          : ""}
        ${formAction}
      </div>`
    : "";
  const faq = data.faq || {};

  return `
    ${renderPageHeading(data)}

    ${renderCardSection({
      cards: data.audienceCards,
      gridClass: "grid--three",
    })}

    ${value(application.heading) || value(application.intro) || applicationPanel
      ? `<section class="section">
          ${renderSectionHeader(application.heading, application.intro)}
          ${applicationPanel}
        </section>`
      : ""}

    ${renderCardSection({
      heading: faq.heading,
      intro: faq.intro,
      cards: faq.items,
      gridClass: "grid--two",
      cardRenderer: renderFaqCard,
    })}
  `;
}

function renderJoinTabs(tabs) {
  const visibleTabs = tabs
    .map((tab, index) => ({ ...tab, tabId: getStableId(tab.id || tab.label || `tab-${index + 1}`) }))
    .filter((tab) => value(tab.label) || value(tab.heading) || value(tab.intro));

  if (!visibleTabs.length) {
    return "";
  }

  const tabButtons = visibleTabs
    .map((tab, index) => `
      <button
        class="join-tabs__button"
        type="button"
        role="tab"
        id="join-tab-${attr(tab.tabId)}"
        aria-controls="join-panel-${attr(tab.tabId)}"
        aria-selected="${index === 0 ? "true" : "false"}"
        tabindex="${index === 0 ? "0" : "-1"}"
        data-join-tab="${attr(tab.tabId)}"
      >
        ${html(tab.label || tab.heading)}
      </button>
    `)
    .join("");

  return `
    <section class="section join-tabs" data-join-tabs>
      <div class="join-tabs__list" role="tablist" aria-label="Join options">
        ${tabButtons}
      </div>
      ${visibleTabs.map(renderJoinTabPanel).join("")}
    </section>
  `;
}

function renderJoinTabPanel(tab, index) {
  const heading = value(tab.heading);
  const intro = value(tab.intro);
  const cards = toArray(tab.cards).map(renderCard).filter(Boolean);
  const gridClass = cards.length === 1 ? "grid--one" : "grid--two";
  const application = renderJoinApplication(tab.application);
  const faq = renderJoinFaq(tab.faq);

  if (!heading && !intro && !cards.length && !application && !faq) {
    return "";
  }

  return `
    <article
      class="join-tabs__panel"
      id="join-panel-${attr(tab.tabId)}"
      role="tabpanel"
      aria-labelledby="join-tab-${attr(tab.tabId)}"
      ${index === 0 ? "" : "hidden"}
    >
      ${renderSectionHeader(heading, intro)}
      ${cards.length ? `<div class="grid ${attr(gridClass)}">${cards.join("")}</div>` : ""}
      ${application}
      ${faq}
    </article>
  `;
}

function renderJoinApplication(application) {
  if (!application) {
    return "";
  }

  const formAction = getJoinFormAction({ application });
  const applicationPanel = value(application.title) || value(application.text) || formAction
    ? `<div class="section__cta section__cta--stacked">
        ${value(application.title) || value(application.text)
          ? `<div>
              ${value(application.title) ? `<h3>${html(application.title)}</h3>` : ""}
              ${value(application.text) ? `<p>${html(application.text)}</p>` : ""}
            </div>`
          : ""}
        ${formAction}
      </div>`
    : "";

  if (!value(application.heading) && !value(application.intro) && !applicationPanel) {
    return "";
  }

  return `
    <div class="join-tabs__block">
      ${renderSectionHeader(application.heading, application.intro)}
      ${applicationPanel}
    </div>
  `;
}

function renderJoinFaq(faq) {
  if (!faq) {
    return "";
  }

  const items = toArray(faq.items).map(renderFaqCard).filter(Boolean);

  if (!value(faq.heading) && !value(faq.intro) && !items.length) {
    return "";
  }

  return `
    <div class="join-tabs__block">
      ${renderSectionHeader(faq.heading, faq.intro)}
      ${items.length ? `<div class="grid grid--two">${items.join("")}</div>` : ""}
    </div>
  `;
}

function renderPageHeading(data) {
  const title = value(data.title);
  const heading = value(data.heading);
  const intro = value(data.intro);

  if (!title && !heading && !intro) {
    return "";
  }

  return `
    <section class="page-heading">
      ${title ? `<p class="eyebrow">${html(title)}</p>` : ""}
      ${heading ? `<h1>${html(heading)}</h1>` : ""}
      ${intro ? `<p>${html(intro)}</p>` : ""}
    </section>
  `;
}

function renderSectionHeader(heading, intro) {
  if (!value(heading) && !value(intro)) {
    return "";
  }

  return `
    <div class="section__header">
      <div>
        ${value(heading) ? `<h2>${html(heading)}</h2>` : ""}
        ${value(intro) ? `<p>${html(intro)}</p>` : ""}
      </div>
    </div>
  `;
}

function renderCardSection({ heading, intro, cards, gridClass, cardRenderer = renderCard }) {
  const visibleCards = toArray(cards).map(cardRenderer).filter(Boolean);

  if (!value(heading) && !value(intro) && !visibleCards.length) {
    return "";
  }

  return `
    <section class="section">
      ${renderSectionHeader(heading, intro)}
      ${visibleCards.length ? `<div class="grid ${attr(gridClass || "grid--two")}">${visibleCards.join("")}</div>` : ""}
    </section>
  `;
}

function renderAffiliationSection({ heading, intro, cards, gridClass, logo, logoAlt }) {
  const visibleCards = toArray(cards).map(renderCard).filter(Boolean);
  const headingText = value(heading);
  const introText = value(intro);
  const logoPath = value(logo);

  if (!headingText && !introText && !visibleCards.length && !logoPath) {
    return "";
  }

  return `
    <section class="section section--affiliation">
      ${headingText ? renderSectionHeader(headingText, "") : ""}
      ${introText || logoPath
        ? `<div class="affiliation">
            ${introText ? `<p>${html(introText)}</p>` : ""}
            ${logoPath
              ? `<div class="affiliation-logo">
                  <img src="${attr(getAssetHref(logoPath))}" alt="${attr(logoAlt)}">
                </div>`
              : ""}
          </div>`
        : ""}
      ${visibleCards.length ? `<div class="grid ${attr(gridClass || "grid--two")}">${visibleCards.join("")}</div>` : ""}
    </section>
  `;
}

function renderPillarSection({ heading, intro, items }) {
  return renderCardSection({
    heading,
    intro,
    cards: items,
    gridClass: "grid--three",
    cardRenderer: renderPillar,
  });
}

function renderEventSection({ heading, intro, events, emptyState }) {
  const visibleEvents = toArray(events).map(renderEvent).filter(Boolean);
  const hasHeader = value(heading) || value(intro);

  if (!hasHeader && !visibleEvents.length && !value(emptyState)) {
    return "";
  }

  return `
    <section class="section">
      ${renderSectionHeader(heading, intro)}
      ${visibleEvents.length
        ? `<div class="event-list">${visibleEvents.join("")}</div>`
        : renderUtilityNote(emptyState)}
    </section>
  `;
}

function renderCallout(callout) {
  if (!callout) {
    return "";
  }

  const actions = renderActionRow(callout.actions, "section__actions");
  const heading = value(callout.heading);
  const text = value(callout.text);

  if (!heading && !text && !actions) {
    return "";
  }

  return `
    <section class="section section--plain">
      <div class="section__cta">
        ${heading || text
          ? `<div>
              ${heading ? `<h2>${html(heading)}</h2>` : ""}
              ${text ? `<p>${html(text)}</p>` : ""}
            </div>`
          : ""}
        ${actions}
      </div>
    </section>
  `;
}

function renderCard(item) {
  const title = value(item?.title);
  const textContent = value(item?.text);

  if (!title && !textContent) {
    return "";
  }

  return `<article class="card">${title ? `<h3>${html(title)}</h3>` : ""}${textContent ? `<p>${html(textContent)}</p>` : ""}</article>`;
}

function renderFaqCard(item) {
  const question = value(item?.question);
  const answer = value(item?.answer);

  if (!question && !answer) {
    return "";
  }

  return `<article class="card card--soft">${question ? `<h3>${html(question)}</h3>` : ""}${answer ? `<p>${html(answer)}</p>` : ""}</article>`;
}

function renderPillar(item) {
  const title = value(item?.title);
  const textContent = value(item?.text);

  if (!title && !textContent) {
    return "";
  }

  return `<article class="card card--soft">${title ? `<div class="card__meta">${html(title)}</div>` : ""}${textContent ? `<p>${html(textContent)}</p>` : ""}</article>`;
}

function renderMember(member) {
  const name = value(member?.name);
  const role = value(member?.role);
  const initials = value(member?.initials);
  const summary = value(member?.summary);

  if (!name && !role && !initials && !summary) {
    return "";
  }

  return `
    <article class="card card--soft">
      ${name || role || initials
        ? `<div class="profile">
            ${initials ? `<div class="profile__avatar">${html(initials)}</div>` : ""}
            <div>
              ${name ? `<p class="profile__name">${html(name)}</p>` : ""}
              ${role ? `<p class="profile__role">${html(role)}</p>` : ""}
            </div>
          </div>`
        : ""}
      ${summary ? `<p class="profile__summary">${html(summary)}</p>` : ""}
    </article>
  `;
}

function renderEvent(event) {
  const date = value(event?.date);
  const title = value(event?.title);
  const summary = value(event?.summary);
  const tags = toArray(event?.tags).map((tag) => value(tag)).filter(Boolean);

  if (!date && !title && !summary && !tags.length) {
    return "";
  }

  return `
    <article class="event">
      ${date ? `<div class="event__date"><span>${html(site.labels?.eventDate)}</span>${html(date)}</div>` : ""}
      <div class="event__body">
        ${title ? `<h3>${html(title)}</h3>` : ""}
        ${summary ? `<p>${html(summary)}</p>` : ""}
        ${tags.length ? `<div class="tag-row">${tags.map((tag) => `<span class="tag">${html(tag)}</span>`).join("")}</div>` : ""}
      </div>
    </article>
  `;
}

function renderActionRow(actions, className) {
  const buttons = toArray(actions).map(renderButton).filter(Boolean);

  if (!buttons.length) {
    return "";
  }

  return `<div class="${attr(className)}">${buttons.join("")}</div>`;
}

function renderButton(action) {
  const label = value(action?.label);
  const href = getLinkHref(action);

  if (!label || !href) {
    return "";
  }

  const variant = action.variant === "primary" ? "primary" : "secondary";
  const external = isExternalHref(href);
  return `<a class="button button--${variant}" href="${attr(href)}" ${external ? 'target="_blank" rel="noreferrer"' : ""}>${html(label)}</a>`;
}

function getJoinFormAction(data) {
  const application = data.application || {};
  const url = value(application.formUrl || data.formUrl);
  const label = value(application.formButtonLabel || data.formButtonLabel);

  if (!url || !label) {
    return "";
  }

  return renderButton({
    label,
    href: url,
    variant: application.formButtonVariant || "primary",
  });
}

function renderUtilityNote(message) {
  return value(message) ? `<div class="utility-note">${html(message)}</div>` : "";
}

function initializeJoinTabs(container) {
  container.querySelectorAll("[data-join-tabs]").forEach((tabsRoot) => {
    const tabs = Array.from(tabsRoot.querySelectorAll("[data-join-tab]"));
    const panels = Array.from(tabsRoot.querySelectorAll("[role='tabpanel']"));

    const activateTab = (activeTab) => {
      const activeId = activeTab.dataset.joinTab;

      tabs.forEach((tab) => {
        const selected = tab === activeTab;
        tab.setAttribute("aria-selected", selected ? "true" : "false");
        tab.setAttribute("tabindex", selected ? "0" : "-1");
      });

      panels.forEach((panel) => {
        panel.hidden = panel.id !== `join-panel-${activeId}`;
      });
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activateTab(tab));
      tab.addEventListener("keydown", (event) => {
        const nextKey = event.key === "ArrowRight" || event.key === "ArrowDown";
        const previousKey = event.key === "ArrowLeft" || event.key === "ArrowUp";

        if (!nextKey && !previousKey) {
          return;
        }

        event.preventDefault();
        const offset = nextKey ? 1 : -1;
        const nextTab = tabs[(index + offset + tabs.length) % tabs.length];
        nextTab.focus();
        activateTab(nextTab);
      });
    });
  });
}

function renderNotFoundPage() {
  return `
    <section class="section">
      ${renderUtilityNote(site.notFound?.message)}
    </section>
  `;
}

function updateDocumentMetadata(data) {
  const title = value(data?.title || site.chapter?.name);
  const description = value(data?.description || site.description);
  const favicon = value(site.chapter?.favicon || site.chapter?.logo);

  if (title) {
    document.title = title;
  }

  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute("content", description);
  }

  if (favicon) {
    let faviconLink = document.querySelector('link[rel="icon"]');
    if (!faviconLink) {
      faviconLink = document.createElement("link");
      faviconLink.rel = "icon";
      document.head.appendChild(faviconLink);
    }
    faviconLink.href = getAssetHref(favicon);
  }
}

function getLinkHref(link) {
  if (link?.page) {
    return getPageHref(link.page);
  }

  return value(link?.href);
}

function getPageHref(targetPage) {
  if (targetPage === "home") {
    return isHomePage ? "index.html" : "../index.html";
  }

  return isHomePage ? `pages/${targetPage}.html` : `${targetPage}.html`;
}

function getAssetHref(assetPath) {
  if (!assetPath || /^(https?:|mailto:|tel:)/i.test(assetPath)) {
    return assetPath;
  }

  return isHomePage ? assetPath : `../${assetPath}`;
}

function isExternalHref(href) {
  return /^https?:\/\//i.test(href);
}

function getStableId(item) {
  return value(item)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "tab";
}

function toArray(items) {
  return Array.isArray(items) ? items.filter(Boolean) : [];
}

function value(item) {
  return typeof item === "string" ? item.trim() : item ?? "";
}

function html(item) {
  return String(value(item)).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char]));
}

function attr(item) {
  return html(item);
}

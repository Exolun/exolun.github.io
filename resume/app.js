function createTagList(items) {
  const list = document.createElement("ul");
  list.className = "tag-list";

  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });

  return list;
}

function renderBasics(basics) {
  document.getElementById("hero-location").textContent = basics.location;
  document.getElementById("hero-name").textContent = basics.name;
  document.getElementById("hero-headline").textContent = basics.headline;
  document.getElementById("hero-summary").textContent = basics.summary;
  document.getElementById("hero-role").textContent = basics.label;

  const focus = document.getElementById("hero-focus");
  basics.focus.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    focus.appendChild(li);
  });

  const links = document.getElementById("hero-links");
  basics.links.forEach((item) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = item.href;
    a.textContent = item.label;

    const isExternalLink = /^https?:\/\//i.test(item.href);
    if (isExternalLink) {
      a.target = "_blank";
      a.rel = "noreferrer";
    }

    li.appendChild(a);
    links.appendChild(li);
  });
}

function renderProfile(points) {
  const container = document.getElementById("profile-points");
  const list = document.createElement("ul");

  points.forEach((point) => {
    const li = document.createElement("li");
    li.textContent = point;
    list.appendChild(li);
  });

  container.appendChild(list);
}

function renderExperience(entries) {
  const container = document.getElementById("experience-list");

  entries.forEach((entry) => {
    const article = document.createElement("article");
    article.className = "timeline-entry";

    const aside = document.createElement("div");
    aside.className = "entry-dates";
    aside.textContent = `${entry.start} - ${entry.end}`;

    const main = document.createElement("div");

    const role = document.createElement("h3");
    role.className = "entry-role";
    role.textContent = entry.role;

    const company = document.createElement("p");
    company.className = "entry-company";
    company.textContent = entry.company;

    const location = document.createElement("p");
    location.className = "entry-location";
    location.textContent = entry.location;

    const bullets = document.createElement("ul");
    bullets.className = "entry-bullets";

    entry.bullets.forEach((bullet) => {
      const li = document.createElement("li");
      li.textContent = bullet;
      bullets.appendChild(li);
    });

    main.appendChild(role);
    main.appendChild(company);
    main.appendChild(location);
    main.appendChild(bullets);

    article.appendChild(aside);
    article.appendChild(main);
    container.appendChild(article);
  });
}

function renderProjects(entries) {
  const container = document.getElementById("project-list");

  entries.forEach((entry) => {
    const article = document.createElement("article");
    article.className = "stack-entry";

    const head = document.createElement("div");
    head.className = "stack-head";

    const title = document.createElement("h3");
    title.className = "stack-title";
    title.textContent = entry.name;

    const meta = document.createElement("div");
    meta.className = "stack-meta";
    meta.textContent = entry.period;

    const subtitle = document.createElement("p");
    subtitle.className = "stack-subtitle";
    subtitle.textContent = entry.subtitle;

    const description = document.createElement("p");
    description.textContent = entry.description;

    head.appendChild(title);
    head.appendChild(meta);
    article.appendChild(head);
    article.appendChild(subtitle);
    article.appendChild(description);

    container.appendChild(article);
  });
}

function renderSkills(groups) {
  const container = document.getElementById("skill-groups");

  groups.forEach((group) => {
    const section = document.createElement("section");
    section.className = "skill-group";

    const heading = document.createElement("h3");
    heading.textContent = group.group;

    section.appendChild(heading);
    section.appendChild(createTagList(group.items));
    container.appendChild(section);
  });
}

function renderEducation(entries) {
  const container = document.getElementById("education-list");

  entries.forEach((entry) => {
    const article = document.createElement("article");
    article.className = "stack-entry";

    const head = document.createElement("div");
    head.className = "stack-head";

    const title = document.createElement("h3");
    title.className = "stack-title";
    title.textContent = entry.institution;

    const meta = document.createElement("div");
    meta.className = "stack-meta";
    meta.textContent = entry.period;

    const subtitle = document.createElement("p");
    subtitle.className = "stack-subtitle";
    subtitle.textContent = entry.credential;

    head.appendChild(title);
    head.appendChild(meta);
    article.appendChild(head);
    article.appendChild(subtitle);

    if (entry.description) {
      const description = document.createElement("p");
      description.textContent = entry.description;
      article.appendChild(description);
    }

    container.appendChild(article);
  });
}

function renderResume(data) {
  renderBasics(data.basics);
  renderProfile(data.profile);
  renderExperience(data.experience);
  renderProjects(data.projects);
  renderSkills(data.skills);
  renderEducation(data.education);
}

renderResume(window.resumeData);

const items = [
  {
    repo: "javascript",
    title: "Javascript NPM Package/Library",
    tech: ["Javascript", "Library", "Package", "NPM"],
  },
  {
    repo: "rust",
    title: "Rust Package/Library",
    tech: ["Rust", "Library", "Package", "Crate"],
  },
  {
    repo: "express-vercel",
    title: "Express + Vercel",
    tech: ["Javascript", "API", "Express", "Vercel", "Backend", "Server"],
    url: "https://express-vercel-frames.vercel.app/",
  },
  {
    repo: "express",
    title: "Express",
    tech: ["Javascript", "API", "Express", "Backend", "Server"],
  },
  {
    repo: "js-tw",
    title: "Javascript + Tailwind",
    tech: ["Javascript", "Tailwind", "HTML", "CSS", "Frontend", "Vanilla"],
    url: "https://pr4j3sh.github.io/js-tw/",
  },
  {
    repo: "react-tw",
    title: "React + Tailwind",
    tech: ["React", "Tailwind", "React Router", "Frontend"],
    url: "https://react-tw-frames.vercel.app/",
  },
  {
    repo: "react-firebase",
    title: "React + Firebase",
    tech: [
      "React",
      "Firebase",
      "Tailwind",
      "React Router",
      "Redux Toolkit",
      "Frontend",
    ],
    url: "https://react-firebase-frames.vercel.app/",
  },
];

const templates = document.getElementById("templates");

const html = items
  .map((item) => {
    const tags = item.tech
      .map((tag) => {
        return `<code>${tag}</code>`;
      })
      .join("");
    const url = item.url
      ? `<a class="link" href="${item.url}" target="_blank">template</a><span>/</span>`
      : "";
    return `<article>
<span class="tag">${item.repo}</span>
<h6>${item.title}</h6>
<article class="btns">${tags}</article>
<pre><code>npm create @pr4j3sh/frames@latest ${item.repo} myapp</code></pre>
<article class="btns">
${url}
<a class="link" href="https://github.com/pr4j3sh/${item.repo}/" target="_blank">github</a>
</article>
</article>`;
  })
  .join("");

templates.innerHTML = html;

const items = [
  {
    repo: "js-tw",
    title: "Vanilla Javascript + Tailwind CSS",
    tech: ["Javascript", "Tailwind", "HTML"],
    url: "https://pr4j3sh.github.io/js-tw/",
  },
  {
    repo: "react-tw",
    title: "React + Tailwind CSS",
    tech: ["React", "Tailwind", "React Router"],
    url: "https://react-tw-frames.vercel.app/",
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
    return `<article>
<span class="tag">${item.repo}</span>
<h6>${item.title}</h6>
<article class="btns">${tags}</article>
<pre><code>npm create @pr4j3sh/frames@latest ${item.repo} myapp</code></pre>
<article class="btns">
<a class="link" href="${item.url}" target="_blank">template</a>
<span>/</span>
<a class="link" href="https://github.com/pr4j3sh/${item.repo}/" target="_blank">github</a>
</article>
</article>`;
  })
  .join("");

templates.innerHTML = html;

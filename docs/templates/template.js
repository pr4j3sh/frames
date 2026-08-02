import data from "./data.js";

const templates = document.getElementById("templates");

const items = data.sort((a, b) => a.title.localeCompare(b.title));

const html = items
  .map((item) => {
    const tags = item.tech
      .map((tag) => {
        return `<code>${tag}</code>`;
      })
      .join("");
    const demo = item.demo
      ? `<a class="link" href="${item.demo}" target="_blank">demo</a><span>/</span>`
      : "";
    return `<article>
<span class="tag">${item.repo}</span>
<h6>${item.title}</h6>
<article class="btns">${tags}</article>
<pre><code>npm create @pr4j3sh/frames@latest ${item.repo} myapp</code></pre>
<article class="btns">
${demo}
<a class="link" href="${item.source}" target="_blank">github</a>
</article>
</article>`;
  })
  .join("");

templates.innerHTML = html;

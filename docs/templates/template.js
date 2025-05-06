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

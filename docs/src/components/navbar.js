import { SITE } from "../lib/consts";

const component = `<nav>
<a href="/${SITE.REPO}/" class="font-semibold">${SITE.REPO}</a>
        <ul class="btns">
            <a href="/frames/request/">
              <button class="secondary small">Request a template</button>
            </a>
            <button class="icon" id="theme-toggle" aria-label="Theme"></button>
        </ul>
      </nav>`;

const navbar = document.getElementById("navbar");

navbar.innerHTML = component;

import { SITE } from "../lib/consts";

const component = `<nav>
<a href="/${SITE.REPO}/" class="font-semibold">${SITE.REPO}</a>
        <ul class="btns">
            <button class="secondary small">Request a template</button>
            <button class="icon" id="theme-toggle" aria-label="Theme"></button>
        </ul>
      </nav>`;

const navbar = document.getElementById("navbar");

navbar.innerHTML = component;

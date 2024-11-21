import { AUTHOR } from "../lib/consts";

const component = `<footer>
        <p>
<a href="${AUTHOR.URL}" target="_blank">${AUTHOR.USERNAME}</a>
        </p>
      </footer>`;

const footer = document.getElementById("footer");

footer.innerHTML = component;

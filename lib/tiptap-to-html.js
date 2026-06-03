/**
 * Converts TipTap / ProseMirror JSON to an HTML string.
 * Zero DOM dependencies — safe to call in any server context.
 */

function esc(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function applyMarks(text, marks = []) {
  let out = esc(text);
  for (const mark of [...marks].reverse()) {
    switch (mark.type) {
      case "bold":        out = `<strong>${out}</strong>`; break;
      case "italic":      out = `<em>${out}</em>`; break;
      case "underline":   out = `<u>${out}</u>`; break;
      case "strike":      out = `<s>${out}</s>`; break;
      case "code":        out = `<code>${out}</code>`; break;
      case "link": {
        const href   = esc(mark.attrs?.href || "#");
        const target = mark.attrs?.target ? ` target="${esc(mark.attrs.target)}"` : "";
        out = `<a href="${href}"${target} rel="noopener noreferrer">${out}</a>`;
        break;
      }
      case "textStyle":
        if (mark.attrs?.color) out = `<span style="color:${esc(mark.attrs.color)}">${out}</span>`;
        break;
      case "highlight":
        if (mark.attrs?.color && mark.attrs.color !== "transparent")
          out = `<mark style="background-color:${esc(mark.attrs.color)}">${out}</mark>`;
        break;
    }
  }
  return out;
}

function children(node) {
  return (node.content || []).map(renderNode).join("");
}

function alignStyle(attrs) {
  const a = attrs?.textAlign;
  return a && a !== "left" ? ` style="text-align:${a}"` : "";
}

function renderNode(node) {
  if (!node) return "";

  switch (node.type) {
    case "doc":
      return children(node);

    case "text":
      return applyMarks(node.text || "", node.marks);

    case "hardBreak":
      return "<br />";

    case "paragraph": {
      const inner = children(node);
      return `<p${alignStyle(node.attrs)}>${inner || "<br>"}</p>`;
    }

    case "heading": {
      const lvl = node.attrs?.level ?? 2;
      const id  = (node.content || [])
        .filter((n) => n.type === "text")
        .map((n) => n.text || "")
        .join("")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      return `<h${lvl} id="${id}"${alignStyle(node.attrs)}>${children(node)}</h${lvl}>`;
    }

    case "blockquote":
      return `<blockquote>${children(node)}</blockquote>`;

    case "horizontalRule":
      return "<hr />";

    case "bulletList":
      return `<ul>${children(node)}</ul>`;

    case "orderedList":
      return `<ol start="${node.attrs?.start ?? 1}">${children(node)}</ol>`;

    case "listItem":
      return `<li>${children(node)}</li>`;

    case "taskList":
      return `<ul data-type="taskList">${children(node)}</ul>`;

    case "taskItem": {
      const checked = node.attrs?.checked;
      return `<li data-type="taskItem" data-checked="${checked ? "true" : "false"}">` +
        `<label><input type="checkbox"${checked ? " checked" : ""} disabled /></label>` +
        `<div>${children(node)}</div></li>`;
    }

    case "codeBlock": {
      const lang = esc(node.attrs?.language || "");
      const code = (node.content || [])
        .filter((n) => n.type === "text")
        .map((n) => esc(n.text || ""))
        .join("");
      return `<pre><code${lang ? ` class="language-${lang}"` : ""}>${code}</code></pre>`;
    }

    case "image": {
      const src   = esc(node.attrs?.src || "");
      const alt   = esc(node.attrs?.alt || "");
      const title = node.attrs?.title ? ` title="${esc(node.attrs.title)}"` : "";
      return `<img src="${src}" alt="${alt}"${title} loading="lazy" />`;
    }

    case "youtube": {
      const src    = esc(node.attrs?.src || "");
      const width  = node.attrs?.width  || 640;
      const height = node.attrs?.height || 360;
      return (
        `<div data-youtube-video>` +
        `<iframe src="${src}" width="${width}" height="${height}" frameborder="0" ` +
        `allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture">` +
        `</iframe></div>`
      );
    }

    case "table":
      return `<table>${children(node)}</table>`;

    case "tableRow":
      return `<tr>${children(node)}</tr>`;

    case "tableHeader": {
      const span = node.attrs?.colspan > 1 ? ` colspan="${node.attrs.colspan}"` : "";
      return `<th${span}>${children(node)}</th>`;
    }

    case "tableCell": {
      const span = node.attrs?.colspan > 1 ? ` colspan="${node.attrs.colspan}"` : "";
      return `<td${span}>${children(node)}</td>`;
    }

    default:
      return children(node);
  }
}

/**
 * @param {object} doc — TipTap JSON document ({type:"doc", content:[...]})
 * @returns {string} HTML string
 */
export function tiptapToHtml(doc) {
  if (!doc || doc.type !== "doc") return "";
  return renderNode(doc);
}

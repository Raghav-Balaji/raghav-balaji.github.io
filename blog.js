function backToList() {
  document.getElementById("blog-content").style.display = "none";
  document.getElementById("blogs").style.display = "block";
}

async function loadBlog(filename) {
  const blogList = document.getElementById('blogs');
  const blogSection = document.getElementById('blog-content');
  const blogBody = document.getElementById('blog-body');
  const blogTitle = document.getElementById('blog-title');

  try {
    const res = await fetch(filename);
    if (!res.ok) throw new Error("Could not load blog");

    const text = await res.text();
    const html = markdownToHTML(text);

    const firstLine = text.split('\n')[0];
    blogTitle.textContent = firstLine.startsWith('# ') ? firstLine.slice(2) : 'Blog';

    blogBody.innerHTML = html;
    blogList.style.display = 'none';
    blogSection.style.display = 'block';
  } catch (err) {
    blogTitle.textContent = "Error";
    blogBody.innerHTML = `<p style="color:red;">Failed to load blog: ${err.message}</p>`;
  }
}

function markdownToHTML(md) {
  return md
    .replace(/^# (.*$)/gim, '<h2>$1</h2>')
    .replace(/^## (.*$)/gim, '<h3>$1</h3>')
    .replace(/^### (.*$)/gim, '<h4>$1</h4>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/`([^`]+)`/gim, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank">$1</a>')
    .replace(/^[-+*] (.*)$/gim, '<li>$1</li>')
    .replace(/<\/li>\s*<li>/gim, '</li><li>')
    .replace(/\n{2,}/g, '</p><p>')
    .replace(/^\s*(?!<\/?)(?!<li>|<h|<p|<strong|<em|<code|<a)(.*)$/gm, '<p>$1</p>');
}

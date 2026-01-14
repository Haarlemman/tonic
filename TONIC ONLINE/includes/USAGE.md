Purpose
-------
Small, portable universal header/footer for pages in this site. Two usage options are provided: server-side PHP includes, or client-side HTML includes via JavaScript. Both use a single `assets/shared.css` and `js/shared.js` file.

Files added
- `includes/header.html` — HTML fragment for header (client include)
- `includes/footer.html` — HTML fragment for footer (client include)
- `includes/header.php` — PHP include version of header
- `includes/footer.php` — PHP include version of footer
- `assets/shared.css` — shared styles for header/footer
- `js/shared.js` — client-side include loader and nav helpers

Client-side (no PHP required)
1. Add the CSS in the page <head>:

```html
<link rel="stylesheet" href="/TONIC ONLINE/assets/shared.css">
```

2. Add this near the end of `<body>` (before other page scripts):

```html
<div data-include="/TONIC ONLINE/includes/header.html"></div>
<!-- page content -->
<div data-include="/TONIC ONLINE/includes/footer.html"></div>
<script src="/TONIC ONLINE/js/shared.js"></script>
```

Server-side (PHP include)
1. Ensure pages are served as PHP (rename `.html` to `.php` or configure server).
2. Place includes near the top/bottom of your page:

```php
<?php include __DIR__ . '/includes/header.php'; ?>
<!-- page content -->
<?php include __DIR__ . '/includes/footer.php'; ?>
```

Notes & conventions
- Mobile menu: markup relies on `#menu-toggle + #main-nav` ordering. Keep the checkbox immediately before the `#main-nav` element.
- Navigation links in includes are simple examples — update the anchors to match your structure.
- If you choose PHP includes, you may remove the client `data-include` usage and `js/shared.js` include to avoid duplicate content.

If you'd like, I can:
- Convert a handful of existing pages (index.html, intro.html, folio.html) to use the include system and update links.
- Add a small PHP wrapper that sets a site base path variable so includes work from nested folders.

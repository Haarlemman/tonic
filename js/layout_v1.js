/**
 * layout.js
 * Centralized layout management for TONIC ONLINE.
 * Injects Tailwind Config, Fonts, Header, and Footer.
 */

(function () {
    // 1. Inject Fonts & Icons
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400;1,600&family=Montserrat:wght@200;300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap';
    document.head.appendChild(fontLink);

    // Lucide Icons (Check if already present)
    if (!document.querySelector('script[src*="lucide"]')) {
        const iconScript = document.createElement('script');
        iconScript.src = 'https://unpkg.com/lucide@latest';
        document.head.appendChild(iconScript);
    }

    // 2. Configure Tailwind (if present)
    // We assume the tailwind script is loaded in the HTML or we inject it.
    // To be safe, let's inject it if missing, but usually it's better in <head>.
    // Here we define the config object regardless.
    window.tailwind = window.tailwind || {};
    window.tailwind.config = {
        theme: {
            extend: {
                fontFamily: {
                    serif: ['"Cormorant Garamond"', 'serif'],
                    playfair: ['"Playfair Display"', 'serif'],
                    sans: ['"Montserrat"', 'sans-serif'],
                },
                colors: {
                    cream: '#F9F7F2',
                    stone: {
                        50: '#fafaf9',
                        100: '#f5f5f4',
                        800: '#292524',
                        900: '#1c1917',
                    },
                    tonicBlue: '#1e3aca',
                    tonicYellow: '#fbbf24',
                    tonicRed: '#DC2626',
                    tonicDarkRed: '#991B1B',
                    tonicBlack: '#000000',
                }
            }
        }
    };

    // 3. Define HTML Templates
    const TEMPLATES = {
        minimal: `
        <header class="w-full py-3 px-4 md:px-8 flex justify-between items-center bg-white border-b border-black sticky top-0 z-[9999]">
            <!-- Minimal Logo -->
            <a href="/index.html" class="flex flex-col group">
                <span class="font-playfair font-bold text-2xl tracking-tighter text-black group-hover:opacity-70 transition-opacity">
                    DAVID ENKER
                </span>
                <span class="font-sans text-[10px] font-medium tracking-[0.2em] text-stone-500 uppercase group-hover:text-stone-800 transition-colors">
                    Creative Thinker
                </span>
            </a>

            <nav class="relative">
                <div class="md:hidden group relative">
                     <button id="mobile-menu-btn" class="p-2 text-black hover:bg-stone-100 transition-colors focus:outline-none"><i data-lucide="menu" class="w-6 h-6"></i></button>
                    <div id="mobile-menu" class="absolute right-0 mt-2 w-56 bg-white border border-stone-200 py-2 hidden shadow-2xl z-[10000]">
                        <a href="https://www.tonicforthebones.com/tftb/" class="block px-6 py-3 text-xs font-bold uppercase tracking-widest text-stone-900 hover:bg-stone-50">The Book</a>
                        <a href="/folio/" class="block px-6 py-3 text-xs font-bold uppercase tracking-widest text-stone-900 hover:bg-stone-50">The Merch</a>
                        <a href="/intro/index.html" class="block px-6 py-3 text-xs font-bold uppercase tracking-widest text-stone-900 hover:bg-stone-50">The Tonic</a>
                    </div>
                </div>
                <ul class="hidden md:flex space-x-10 items-center font-sans text-xs font-bold tracking-[0.15em] uppercase text-stone-400">
                    <li class="relative dropdown group h-full cursor-pointer py-2">
                        <span class="hover:text-black transition-colors flex items-center gap-1">Menu <i data-lucide="chevron-down" class="w-3 h-3 opacity-50"></i></span>
                        <div class="dropdown-menu absolute right-0 top-full mt-0 w-64 bg-white border border-stone-100 py-4 hidden group-hover:block z-[10000] shadow-xl">
                            <a href="https://www.tonicforthebones.com/tftb/" class="block px-8 py-3 text-stone-600 hover:text-black hover:bg-stone-50 transition-colors">The Book</a>
                            <a href="/folio/" class="block px-8 py-3 text-stone-600 hover:text-black hover:bg-stone-50 transition-colors">The Merch</a>
                            <a href="/intro/index.html" class="block px-8 py-3 text-stone-600 hover:text-black hover:bg-stone-50 transition-colors">The Tonic</a>
                        </div>
                    </li>
                </ul>
            </nav>
        </header>`,
        yellow: `
        <header class="w-full py-2 px-3 md:px-12 flex justify-between items-center bg-tonicYellow sticky top-0 z-50 border-b-2 border-black" style="font-family: sans-serif;">
            <div class="flex flex-col md:flex-row md:items-center gap-0 md:gap-3">
                <a href="/index.html" class="bg-black text-white px-3 py-1 text-xl md:text-2xl font-bold tracking-tight uppercase border-2 border-black hover:bg-white hover:text-black transition-colors self-start md:self-auto z-10 relative" style="font-family: serif;">David Enker</a>
                <span class="bg-white text-black px-2 py-1 text-[10px] font-bold uppercase tracking-widest border-2 border-t-0 md:border-t-2 border-black block self-start md:self-auto -mt-[2px] md:mt-0 relative z-0">A remedy for the soul</span>
            </div>
            <nav class="relative">
                <div class="md:hidden group relative">
                     <button id="mobile-menu-btn" class="p-1 bg-tonicRed text-white border border-black hover:bg-tonicDarkRed transition-colors focus:outline-none"><i data-lucide="menu" class="w-5 h-5"></i></button>
                    <div id="mobile-menu" class="absolute right-0 mt-1 w-48 bg-white border border-black py-0 hidden shadow-xl z-50">
                        <a href="https://www.tonicforthebones.com/tftb/" class="block px-4 py-3 text-sm text-stone-900 hover:bg-tonicRed hover:text-white border-b border-black">The Book</a>
                        <a href="/folio/" class="block px-4 py-3 text-sm text-stone-900 hover:bg-tonicYellow hover:text-black border-b border-black">The Merch</a>
                        <a href="/intro/index.html" class="block px-4 py-3 text-sm text-stone-900 hover:bg-tonicBlue hover:text-white">The Tonic</a>
                    </div>
                </div>
                <ul class="hidden md:flex space-x-8 items-center text-xs font-bold tracking-widest uppercase text-stone-600">
                    <li class="relative dropdown group h-full cursor-pointer">
                        <span class="bg-tonicRed text-white border border-black px-4 py-1 hover:bg-tonicDarkRed transition-colors flex items-center gap-2">Menu <i data-lucide="chevron-down" class="w-3 h-3"></i></span>
                        <div class="dropdown-menu absolute right-0 top-full mt-0 w-56 bg-white border border-black py-0 hidden group-hover:block z-50 shadow-xl">
                            <a href="https://www.tonicforthebones.com/tftb/" class="block px-6 py-3 text-black hover:bg-tonicRed hover:text-white transition-colors border-b border-black">The Book</a>
                            <a href="/folio/" class="block px-6 py-3 text-black hover:bg-tonicYellow hover:text-black transition-colors border-b border-black">The Merch</a>
                            <a href="/intro/index.html" class="block px-6 py-3 text-black hover:bg-tonicBlue hover:text-white transition-colors">The Tonic</a>
                        </div>
                    </li>
                </ul>
            </nav>
        </header>`
    };

    const FOOTER_HTML = `
    <footer class="w-full py-6 text-center text-[10px] text-stone-400 uppercase tracking-widest border-t border-stone-100 bg-white mt-auto">
        &copy; ${new Date().getFullYear()} David Enker | Tonic for the Bones
    </footer>
    `;

    // 4. Inject into DOM
    function injectLayout() {
        const headerPlaceholder = document.getElementById('app-header');
        const footerPlaceholder = document.getElementById('app-footer');

        if (headerPlaceholder) {
            const theme = headerPlaceholder.dataset.theme || 'minimal';
            headerPlaceholder.outerHTML = TEMPLATES[theme] || TEMPLATES.minimal;
        } else {
            document.body.insertAdjacentHTML('afterbegin', TEMPLATES.minimal);
        }

        if (footerPlaceholder) footerPlaceholder.outerHTML = FOOTER_HTML;
        else document.body.insertAdjacentHTML('beforeend', FOOTER_HTML);

        // Initialize Icons
        if (window.lucide) window.lucide.createIcons();
        else {
            // Wait for script to load if lazy loaded
            setTimeout(() => window.lucide && window.lucide.createIcons(), 500);
        }

        // Setup Mobile Logic
        setupMobileMenu();
    }

    function setupMobileMenu() {
        const btn = document.getElementById('mobile-menu-btn');
        const menu = document.getElementById('mobile-menu');

        if (btn && menu) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                menu.classList.toggle('hidden');
            });

            // Close when clicking outside
            document.addEventListener('click', (e) => {
                if (!menu.contains(e.target) && !btn.contains(e.target)) {
                    menu.classList.add('hidden');
                }
            });
        }
    }

    // Run on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectLayout);
    } else {
        injectLayout();
    }

})();

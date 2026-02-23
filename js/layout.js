/**
 * layout.js
 * Centralized layout management for TONIC ONLINE.
 * Injects Tailwind Config, Fonts, Header, and Footer.
 */

(function () {
    // 1. Inject Fonts & Icons
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400;1,600&family=Montserrat:wght@200;300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Share+Tech+Mono&family=Glass+Antiqua&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,400&family=Lato:wght@300;400;700&family=Courier+Prime&family=Dancing+Script:wght@400;700&display=swap';
    document.head.appendChild(fontLink);

    if (!document.querySelector('script[src*="lucide"]')) {
        const iconScript = document.createElement('script');
        iconScript.src = 'https://unpkg.com/lucide@latest';
        document.head.appendChild(iconScript);
    }

    // 2. Configure Tailwind (if present)
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
    const HEADER_HTML = `
        <header class="sticky top-0 z-50 flex flex-col font-sans">
            <div id="header-content" class="w-full transition-all duration-500 ease-in-out max-h-40 py-1 px-3 md:px-6 flex justify-between items-center bg-tonicYellow border-b-2 border-black overflow-visible">
                <div class="flex flex-row items-center gap-2">
                    <a href="https://tonic.davidenker.com/" class="bg-black text-white px-2 py-0 text-base uppercase border-2 border-black hover:bg-white hover:text-black transition-colors z-10 relative" style="font-family: 'Share Tech Mono', monospace;">TONIC</a>
                    <span class="text-[14px] md:text-xs tracking-wide text-black" style="font-family: 'Share Tech Mono', monospace;">multi media defiance</span>
                </div>
                <nav class="relative">
                    <div class="md:hidden group relative">
                         <button id="mobile-menu-btn" class="p-0.5 bg-tonicRed text-white border border-black hover:bg-tonicDarkRed transition-colors focus:outline-none"><i data-lucide="menu" class="w-4 h-4"></i></button>
                        <div id="mobile-menu" class="absolute right-0 mt-0 w-32 bg-white border border-black py-0 hidden shadow-xl z-50">
                            <a href="/tftb/" class="block px-3 py-3 text-sm text-stone-900 hover:bg-tonicRed hover:text-white border-b border-black">BOOK</a>
                            <a href="/folio/" class="block px-3 py-3 text-sm text-stone-900 hover:bg-tonicYellow hover:text-black border-b border-black">DIGITAL EXPERIENCES</a>
                            <a href="/about/" class="block px-3 py-3 text-sm text-stone-900 hover:bg-stone-800 hover:text-white border-b border-black">ABOUT</a>
                        </div>
                    </div>
                    <ul class="hidden md:flex space-x-4 items-center text-[10px] font-bold tracking-widest uppercase text-stone-600">
                        <li class="relative dropdown group h-full cursor-pointer">
                            <span class="bg-tonicRed text-white border border-black px-2 py-0.5 hover:bg-tonicDarkRed transition-colors flex items-center gap-1">Menu <i data-lucide="chevron-down" class="w-3 h-3"></i></span>
                            <div class="dropdown-menu absolute right-0 top-full mt-0 w-32 bg-white border border-black py-0 hidden group-hover:block z-50 shadow-xl">
                                <a href="/tftb/" class="block px-3 py-2 text-black hover:bg-tonicRed hover:text-white transition-colors border-b border-black">BOOK</a>
                                <a href="/folio/" class="block px-3 py-2 text-black hover:bg-tonicYellow hover:text-black transition-colors border-b border-black">DIGITAL EXPERIENCE</a>
                                <a href="/about/" class="block px-3 py-2 text-black hover:bg-stone-800 hover:text-white transition-colors border-b border-black">ABOUT</a>
                            </div>
                        </li>
                    </ul>
                </nav>
            </div>
            </div>
            <div id="pixel-band" class="w-full h-[9px] bg-[#09826a] flex items-center overflow-hidden border-b border-black cursor-pointer" title="Click to toggle header"></div>
        </header>`;

    const FOOTER_HTML = `
    <footer class="w-full py-6 text-center text-[10px] text-tonicYellow uppercase tracking-widest border-t border-tonicYellow/20 bg-[#000814] mt-auto">
        &copy; ${new Date().getFullYear()} David Enker | Tonic for the Bones | <a href="/about/" class="text-cyan-400 hover:text-cyan-200 hover:drop-shadow-[0_0_10px_rgba(34,211,238,1)] transition-all duration-300 font-bold">about/contact</a>
    </footer>
    `;

    // 4. Inject into DOM
    function injectLayout() {
        const headerPlaceholder = document.getElementById('app-header');
        const footerPlaceholder = document.getElementById('app-footer');

        if (headerPlaceholder) {
            headerPlaceholder.outerHTML = HEADER_HTML;
        } else {
            document.body.insertAdjacentHTML('afterbegin', HEADER_HTML);
        }

        if (footerPlaceholder) footerPlaceholder.outerHTML = FOOTER_HTML;
        else document.body.insertAdjacentHTML('beforeend', FOOTER_HTML);

        // Initialize Icons
        if (window.lucide) window.lucide.createIcons();
        else {
            // Wait for script to load if lazy loaded
            setTimeout(() => window.lucide && window.lucide.createIcons(), 500);
        }

        // Setup Resize Observer for Header Height
        const headerElement = document.getElementById('header-content');

        // Restore Collapsed State
        if (headerElement && localStorage.getItem('headerCollapsed') === 'true') {
            headerElement.classList.remove('max-h-40', 'py-1', 'border-b-2', 'overflow-visible');
            headerElement.classList.add('max-h-0', 'py-0', 'border-b-0', 'overflow-hidden');
        }

        const pixelBand = document.getElementById('pixel-band');

        if (headerElement && pixelBand) {
            const updateHeaderHeight = () => {
                // Total height is content + pixel band (9px)
                const totalHeight = headerElement.offsetHeight + pixelBand.offsetHeight - 1;
                document.documentElement.style.setProperty('--global-header-height', `${totalHeight}px`);
            };

            // Initial set
            updateHeaderHeight();

            // Observe changes (animation/content change)
            const resizeObserver = new ResizeObserver(() => {
                updateHeaderHeight();
            });

            resizeObserver.observe(headerElement);

            // Also listen to transition end for safety on the collapse animation
            headerElement.addEventListener('transitionend', updateHeaderHeight);
        }

        setupMobileMenu();
        setupPixelBand();
    }

    function setupPixelBand() {
        const band = document.getElementById('pixel-band');
        if (!band) return;

        const colors = ['#1e3aca', '#fbbf24', '#DC2626', '#000000', '#F9F7F2', '#09826a']; // Blue, Yellow, Red, Black, Cream, Green

        function fillBand() {
            band.innerHTML = '';
            const width = window.innerWidth;
            const count = Math.ceil(width / 10); // 5px square + 5px gap = 10px

            for (let i = 0; i < count; i++) {
                const sq = document.createElement('div');
                sq.style.width = '5px';
                sq.style.height = '5px';
                sq.style.marginRight = '5px';
                sq.style.flexShrink = '0';
                sq.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                sq.className = 'pixel-square transition-colors duration-500'; // animate color changes
                band.appendChild(sq);
            }
        }

        fillBand();
        window.addEventListener('resize', fillBand);

        // Randomly change colors
        setInterval(() => {
            const squares = band.getElementsByClassName('pixel-square');
            // Change 10% of squares every tick for twinkling effect
            for (let i = 0; i < squares.length; i++) {
                if (Math.random() < 0.1) {
                    squares[i].style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                }
            }
        }, 200);

        // Delegated Click Listener for Header Toggle (Robustness w/ Styles)
        document.addEventListener('click', (e) => {
            if (e.target && e.target.closest('#pixel-band')) {
                console.log("Pixel Band Clicked (Delegated style-force)");
                const content = document.getElementById('header-content');
                if (content) {
                    const isCollapsed = content.style.maxHeight === '0px' || content.classList.contains('max-h-0');

                    if (!isCollapsed) {
                        // Collapse
                        content.style.transition = 'max-height 0.5s ease-out, padding 0.5s ease, border 0.5s ease';
                        content.style.overflow = 'hidden';
                        content.style.maxHeight = '0px';
                        content.style.paddingTop = '0px';
                        content.style.paddingBottom = '0px';
                        content.style.borderBottomWidth = '0px';
                        localStorage.setItem('headerCollapsed', 'true');
                        // Remove conflicting classes
                        content.classList.remove('max-h-40', 'py-1', 'border-b-2');
                    } else {
                        // Expand
                        content.style.overflow = 'hidden'; // Keep hidden during anim
                        content.style.maxHeight = '160px'; // Approx 10rem
                        content.style.paddingTop = '0.25rem'; // py-1
                        content.style.paddingBottom = '0.25rem';
                        content.style.borderBottomWidth = '2px';
                        localStorage.setItem('headerCollapsed', 'false');
                        content.classList.remove('max-h-0');
                        content.classList.add('max-h-40'); 

                        setTimeout(() => {
                            content.style.overflow = 'visible';
                        }, 500);
                    }
                }
            }
        });
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

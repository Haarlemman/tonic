// THE UNIVERSITY OF FREE WILL // GLOBAL NAVIGATION
// "You don't control the curriculum. You only control your attendance." [Source 130]

document.addEventListener("DOMContentLoaded", function() {

    // 1. DEFINE THE CURRICULUM (Links)
    // We map the Name, the Link, and the Faculty Color [Source 1, 166]
    const curriculum = [
        { name: "CAMPUS MAP", link: "index.html", color: "var(--ink)" },
        { name: "BODY",       link: "dept-body.html",  color: "var(--red)" },    // Physics [Source 49]
        { name: "MIND",       link: "dept-mind.html",  color: "var(--yellow)" }, // Logic [Source 53]
        { name: "SOUL",       link: "dept-soul.html",  color: "var(--blue)" },   // Faith [Source 139]
        { name: "MOSAIC",     link: "mosaic.html",     color: "var(--ink)" },    // The Grid
        { name: "ADMISSIONS", link: "shop/register",   color: "var(--ink)" }     // Shopify [Source 9]
    ];

    // 2. CREATE THE CONTAINER
    const navContainer = document.createElement("nav");
    navContainer.id = "university-nav";
    
    // 3. BUILD THE MENU
    let navHTML = `<div class="nav-brand">UNI. FREE WILL</div><div class="nav-links">`;

    // Get current path to check "Active" state
    const currentPath = window.location.pathname;

    curriculum.forEach(item => {
        // Check if this is the active page
        // Note: We use 'includes' to handle folder structures
        let isActive = currentPath.includes(item.link) || (item.link === 'index.html' && (currentPath === '/' || currentPath.endsWith('/')));
        
        // Define Style for this item
        // If active, background becomes the color. If not, just a border.
        let styleStr = isActive 
            ? `background-color: ${item.color}; color: white; border-color: ${item.color};` 
            : `border-color: transparent;`;

        navHTML += `
            <a href="${item.link}" class="nav-item ${isActive ? 'active' : ''}" style="${styleStr}" 
               onmouseover="this.style.borderColor='${item.color}'" 
               onmouseout="this.style.borderColor='${isActive ? item.color : 'transparent'}'">
               ${item.name}
            </a>
        `;
    });

    navHTML += `</div>`;
    navContainer.innerHTML = navHTML;

    // 4. INJECT INTO PAGE (At the very top)
    document.body.prepend(navContainer);
});
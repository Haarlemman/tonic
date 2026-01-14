// JavaScript Document
  let activePanel = null;
        const container = document.getElementById('zoomContainer');
        let scale = 1;
        let translateX = 0;
        let translateY = 0;
        let isPanning = false;
        let startX = 0;
        let startY = 0;

        function toggleInfo(panelId) {
            const panel = document.getElementById(panelId);
            const vertex = document.querySelector(`[data-info="${panelId}"]`);
            
            if (activePanel === panelId) {
                panel.style.display = 'none';
                activePanel = null;
                return;
            }
            
            if (activePanel) {
                document.getElementById(activePanel).style.display = 'none';
            }
            
            panel.style.display = 'block';
            activePanel = panelId;
        }

        function closePanel() {
            if (activePanel) {
                document.getElementById(activePanel).style.display = 'none';
                activePanel = null;
            }
        }

        // Close panels when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.vertex') && !e.target.closest('.central-eye') && !e.target.closest('.info-panel')) {
                closePanel();
            }
        });

        // Prevent context menu on right click for cleaner experience
        document.addEventListener('contextmenu', e => e.preventDefault());

        // Zoom and pan functionality
        document.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            scale = Math.min(Math.max(scale * delta, 0.5), 2);
            updateTransform();
        });

        container.addEventListener('mousedown', (e) => {
            isPanning = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
        });

        container.addEventListener('mousemove', (e) => {
            if (isPanning) {
                translateX = e.clientX - startX;
                translateY = e.clientY - startY;
                updateTransform();
            }
        });

        container.addEventListener('mouseup', () => {
            isPanning = false;
        });

        container.addEventListener('mouseleave', () => {
            isPanning = false;
        });

        // Touch support for mobile
        let touchStartScale = 1;
        let touchStartDistance = 0;

        container.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                isPanning = true;
                startX = e.touches[0].clientX - translateX;
                startY = e.touches[0].clientY - translateY;
            } else if (e.touches.length === 2) {
                isPanning = false;
                touchStartScale = scale;
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                touchStartDistance = Math.sqrt(dx * dx + dy * dy);
            }
        });

        container.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (e.touches.length === 1 && isPanning) {
                translateX = e.touches[0].clientX - startX;
                translateY = e.touches[0].clientY - startY;
                updateTransform();
            } else if (e.touches.length === 2) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                scale = Math.min(Math.max(touchStartScale * (distance / touchStartDistance), 0.5), 2);
                updateTransform();
            }
        });

        container.addEventListener('touchend', () => {
            isPanning = false;
        });

        function updateTransform() {
            container.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        }
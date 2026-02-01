// The House of Meaning Interaction Module
// namespace: MeaningHouse.Core.Interaction

(function () {
    window.MeaningHouse = window.MeaningHouse || {};
    window.MeaningHouse.Core = window.MeaningHouse.Core || {};

    let raycaster, mouse;
    let isPossibleClick = false;
    let pointerDownX = 0, pointerDownY = 0;
    let hoveredObject = null;

    const Interaction = {
        init: function () {
            raycaster = new THREE.Raycaster();
            mouse = new THREE.Vector2();

            const canvas = MeaningHouse.elements.renderer.domElement;
            canvas.addEventListener('pointerdown', this.onPointerDown);
            canvas.addEventListener('pointermove', this.onPointerMove);
            canvas.addEventListener('pointerup', this.onPointerUp);
        },

        updateMousePosition: function (event) {
            const renderer = MeaningHouse.elements.renderer;
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        },

        onPointerDown: function (event) {
            isPossibleClick = true;
            pointerDownX = event.clientX;
            pointerDownY = event.clientY;
        },

        onPointerMove: function (event) {
            const dist = Math.hypot(event.clientX - pointerDownX, event.clientY - pointerDownY);
            if (dist > 50) isPossibleClick = false;
            Interaction.updateMousePosition(event);

            const state = MeaningHouse.state.currentRoom ? 'ROOM' : 'HOUSE';
            if (state === 'HOUSE') Interaction.checkExternalHover();
            else Interaction.checkInternalHover();

            const tooltip = document.getElementById('tooltip');
            if (tooltip) {
                tooltip.style.left = event.clientX + 'px';
                tooltip.style.top = event.clientY + 'px';
            }
        },

        onPointerUp: function (event) {
            if (isPossibleClick) Interaction.performClick(event);
            isPossibleClick = false;
        },

        performClick: function (event) {
            Interaction.updateMousePosition(event);
            const camera = MeaningHouse.elements.camera;
            raycaster.setFromCamera(mouse, camera);

            const state = MeaningHouse.state.currentRoom ? 'ROOM' : 'HOUSE';

            if (state === 'HOUSE') {
                const worldGroup = MeaningHouse.elements.worldGroup;
                const intersects = raycaster.intersectObjects(worldGroup.children, true);
                if (intersects.length > 0) {
                    let target = intersects[0].object;
                    while (target && (!target.userData || !target.userData.name)) { target = target.parent; }

                    if (target && target.userData && target.userData.name) {
                        // Enter Room
                        if (window.enterRoom) window.enterRoom(target.userData.name);
                    }
                }
            } else {
                // Interior Click
                const interiorClickables = window.interiorClickables || []; // Usage specific
                const intersects = raycaster.intersectObjects(interiorClickables, true);

                if (intersects.length > 0) {
                    let target = intersects[0].object;
                    // Bubble up
                    while (target && (!target.userData || !target.userData.onClick)) {
                        target = target.parent;
                        if (!target || target === MeaningHouse.elements.interiorGroup) break;
                    }

                    if (target && target.userData) {
                        if (target.userData.onClick) target.userData.onClick(intersects[0]);
                        // Legacy Type checks
                        else if (target.userData.type === 'videoPlayButton') window.toggleVideo();
                        // ... add other legacy handlers if not migrated to onClick
                    }
                }
            }
        },

        checkExternalHover: function () {
            const camera = MeaningHouse.elements.camera;
            raycaster.setFromCamera(mouse, camera);
            const worldGroup = MeaningHouse.elements.worldGroup;
            const intersects = raycaster.intersectObjects(worldGroup.children, true);

            if (intersects.length > 0) {
                let target = intersects[0].object;
                while (target && (!target.userData || !target.userData.name)) target = target.parent;

                if (target && target.userData && target.userData.name) {
                    const name = target.userData.name;
                    if (window.roomContent && window.roomContent[name]) {
                        if (hoveredObject !== target) {
                            hoveredObject = target;
                            document.body.style.cursor = 'pointer';
                            const tooltip = document.getElementById('tooltip');
                            if (tooltip) {
                                tooltip.textContent = window.roomContent[name].title;
                                tooltip.style.opacity = 1;
                            }
                        }
                        return;
                    }
                }
            }

            if (hoveredObject) {
                hoveredObject = null;
                document.body.style.cursor = 'default';
                const tooltip = document.getElementById('tooltip');
                if (tooltip) tooltip.style.opacity = 0;
            }
        },

        checkInternalHover: function () {
            const camera = MeaningHouse.elements.camera;
            raycaster.setFromCamera(mouse, camera);
            const interiorClickables = window.interiorClickables || [];
            const intersects = raycaster.intersectObjects(interiorClickables, true);

            if (intersects.length > 0) document.body.style.cursor = 'pointer';
            else document.body.style.cursor = 'default';
        }
    };

    MeaningHouse.Core.Interaction = Interaction;

    // Global Hooks
    window.onPointerDown = Interaction.onPointerDown.bind(Interaction);
    window.onPointerMove = Interaction.onPointerMove.bind(Interaction);
    window.onPointerUp = Interaction.onPointerUp.bind(Interaction);
})();

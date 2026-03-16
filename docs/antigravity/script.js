// Header scroll effect
const header = document.getElementById('header');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile menu toggle
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (nav.classList.contains('active')) {
            icon.classList.remove('ri-menu-line');
            icon.classList.add('ri-close-line');
        } else {
            icon.classList.remove('ri-close-line');
            icon.classList.add('ri-menu-line');
        }
    });
}

/* ==========================================================================
   Dynamic Product Modal Logic
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const modalOverlay = document.getElementById('productModal');
    if (!modalOverlay) return; // Exit if not on products page

    const closeBtn = document.getElementById('closeProductModalBtn');
    
    // Modal Elements to populate
    const modalImg = document.getElementById('modalProductImage');
    const modalBrand = document.getElementById('modalProductBrand');
    const modalTitle = document.getElementById('modalProductTitle');
    const modalDesc = document.getElementById('modalProductDesc');
    const modalMetaGrid = document.getElementById('modalProductMeta');

    // Open Modal
    function openModal() {
        modalOverlay.classList.add('is-open');
        document.body.classList.add('modal-open');
    }

    // Close Modal
    function closeModal() {
        modalOverlay.classList.remove('is-open');
        document.body.classList.remove('modal-open');
    }

    // Event Listeners for Closing
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && modalOverlay.classList.contains('is-open')) {
            closeModal();
        }
    });

    // Event Delegation for "View Details" buttons
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-outline.dark-outline.btn-full');
        // Make sure it's the view details button (based on text or typical placement)
        if (btn && btn.textContent.trim().toLowerCase() === 'view details') {
            e.preventDefault();
            
            // Find parent card
            const card = btn.closest('.product-card-premium, .product-list-card-premium');
            if (!card) return;

            // Extract Data
            // Image
            const imgEl = card.querySelector('img');
            let imgSrc = imgEl ? imgEl.src : '';
            // If missing image (fallback), it might lack an actual img tag. Let's just use empty string or placeholder.
            if (!imgEl && card.querySelector('.img-fallback i')) {
                imgSrc = ''; // We can let alt text or a placeholder handle this, or remove img tag
            }
            
            // Text Content
            const brandEl = card.querySelector('.brand-name, .list-brand-name');
            const titleEl = card.querySelector('.product-name, .list-product-name');
            const descEl = card.querySelector('.product-short-desc, .list-product-desc');

            const brandText = brandEl ? brandEl.textContent.trim() : 'Unknown Brand';
            const titleText = titleEl ? titleEl.textContent.trim() : 'Product Title';
            const descText = descEl ? descEl.textContent.trim() : 'No description available.';

            // Populate Modal Top Section
            if (modalImg) {
                if (imgSrc) {
                    modalImg.src = imgSrc;
                    modalImg.style.display = 'block';
                } else {
                    modalImg.style.display = 'none'; // hide if broken image
                }
            }
            if (modalBrand) modalBrand.textContent = brandText;
            if (modalTitle) modalTitle.textContent = titleText;
            if (modalDesc) modalDesc.textContent = descText;

            // Extract Meta/B2B Data
            if (modalMetaGrid) {
                modalMetaGrid.innerHTML = ''; // clear previous
                
                // Defaults
                let supplyPrice = 'Contact Us';
                let moq = 'Negotiable';
                let exportReady = '<span class="val text-disabled">--</span>';
                let sampleAvail = '<span class="val text-disabled">--</span>';
                let origin = 'Unknown';
                let leadTime = '14-21 Days';

                // Attempt to parse meta tags from Grid View (.product-meta .meta-tag)
                const rootGridMeta = card.querySelectorAll('.meta-tag');
                rootGridMeta.forEach(tag => {
                    const text = tag.textContent.trim();
                    if (text.includes('Origin')) origin = text.replace('Origin', '').trim();
                    else if (text.includes('KR Origin')) origin = 'South Korea';
                    else if (text.includes('EU Compliant')) exportReady = '<span class="val text-success"><i class="ri-checkbox-circle-line"></i> Ready</span>';
                    else if (text.includes('MOQ')) moq = text.replace('MOQ:', '').trim();
                    else if (text.includes('Sample Ready')) sampleAvail = '<span class="val text-success"><i class="ri-truck-line"></i> In Stock</span>';
                    else if (text.includes('Negotiable')) moq = 'Negotiable';
                    else if (text.includes('Export Ready')) exportReady = '<span class="val text-success"><i class="ri-checkbox-circle-line"></i> Ready</span>';
                });

                // Attempt to parse list data from List View (.data-row)
                const listDataRows = card.querySelectorAll('.data-row');
                listDataRows.forEach(row => {
                    const labelEl = row.querySelector('.data-label');
                    const valEl = row.querySelector('.data-value');
                    if (labelEl && valEl) {
                        const label = labelEl.textContent.trim().toLowerCase();
                        const valHTML = valEl.innerHTML;
                        const valText = valEl.textContent.trim();
                        
                        if (label === 'origin' && valText !== '--') origin = valText;
                        if (label === 'moq' && valText !== '--') moq = valText;
                        if (label === 'export' && valText !== '--') exportReady = `<span class="val">${valHTML}</span>`;
                        if (label === 'sample' && valText !== '--') sampleAvail = `<span class="val">${valHTML}</span>`;
                    }
                });

                // Fallback checking for badges
                const badges = card.querySelectorAll('.badge');
                badges.forEach(badge => {
                    const bText = badge.textContent.trim();
                    if (bText === 'Export Ready') exportReady = '<span class="val text-success"><i class="ri-checkbox-circle-line"></i> Ready</span>';
                    if (bText === 'Sample Available') sampleAvail = '<span class="val text-success"><i class="ri-truck-line"></i> In Stock</span>';
                    if (bText.includes('MOQ')) moq = bText.replace('MOQ', '').trim();
                    if (bText === 'Negotiable') moq = 'Negotiable';
                });

                // Helper to generate b2b HTML item
                const createB2bItem = (label, valueHTML) => {
                    return `
                        <div class="modal-b2b-item">
                            <span class="label">${label}</span>
                            ${valueHTML.includes('<span class="val') ? valueHTML : `<span class="val">${valueHTML}</span>`}
                        </div>
                    `;
                };

                // Build grid
                modalMetaGrid.innerHTML += createB2bItem('Supply Price', supplyPrice);
                modalMetaGrid.innerHTML += createB2bItem('MOQ', moq);
                modalMetaGrid.innerHTML += createB2bItem('Export Readiness', exportReady);
                modalMetaGrid.innerHTML += createB2bItem('Sample Availability', sampleAvail);
                modalMetaGrid.innerHTML += createB2bItem('Country of Origin', origin);
                modalMetaGrid.innerHTML += createB2bItem('Lead Time', leadTime);
            }
            
            openModal();
        }
    });
});

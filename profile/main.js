document.addEventListener("DOMContentLoaded", function() {
    // Set initial background
    document.body.style.background = "url(https://tccards.tn/Assets/bg.png) center fixed";
    document.body.style.backgroundSize = "cover";
    document.body.style.backdropFilter = "blur(5px)";
    
    // Extract identifier from URL hash
    const hash = window.location.hash.substring(1);
    if (!hash) {
        showError("No profile link provided");
        return;
    }
    // Change the url to https://p.tccards.tn/@"hash" without reloading just the appearance of the url
    const newUrl = `https://p.tccards.tn/@${hash}`;
    window.history.replaceState(null, null, newUrl);
    // Determine if it's an ID or link lookup
    const isIdLookup = hash.startsWith('id_');
    const identifier = isIdLookup ? hash.split('_')[1] : hash;
    
    // Database configuration with plan types
    const databases = [
        {
            id: 'AKfycbzPzvvaPrbyqArBphqHNlNSEJEVIdKD0DZINT_c5308LXo9ELon3WK_5qpvjmZ4RyAfyQ',
            plan: 'standard'
        },
        {
            id: 'AKfycbxvZvAIxLUJ_JKrW06ImzTKYOvm5fXy7NMv4RZNXeO9j9S82HBhWhHEqNkNhklRxh7N',
            plan: 'basic'
        },
        {
            id: 'AKfycbxU8axs4Xduqc84jj_utLsi-pCxSEyw9exEO7PuNo940qQ1bJ4-NxREnUgVhdzS9plb',
            plan: 'free'
        }
    ];

    // Start searching databases
    searchDatabases(databases, identifier, isIdLookup);
});

// Enhanced database search with plan awareness
async function searchDatabases(databases, identifier, isIdLookup, index = 0) {
    if (index >= databases.length) {
        showError("Profile not found in any database");
        return;
    }

    const db = databases[index];
    
    try {
        const param = isIdLookup ? 'id' : 'link';
        const url = `https://script.google.com/macros/s/${db.id}/exec?${param}=${encodeURIComponent(identifier)}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Debug log
        console.log('Received data:', data);
        
        // If data has status error, try next database
        if (data && data.status === "error") {
            searchDatabases(databases, identifier, isIdLookup, index + 1);
            return;
        }
        
        // If we have valid data, handle it
        if (data && typeof data === 'object') {
            try {
                handleProfileData(data, db.plan);
                return;
            } catch (err) {
                console.error('Error in handleProfileData:', err);
                searchDatabases(databases, identifier, isIdLookup, index + 1);
            }
        } else {
            searchDatabases(databases, identifier, isIdLookup, index + 1);
        }
    } catch (error) {
        console.error("Database search error:", error);
        searchDatabases(databases, identifier, isIdLookup, index + 1);
    }
}

// Enhanced profile handler with plan awareness
function handleProfileData(data, planType) {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.display = 'none';
    }
    // Open the data array received data.data to access the profile data
    data = data.data || data;

    if (!data || typeof data !== 'object') {
        showError("Invalid profile data received");
        return;
    }

    if (data.status === "error") {
        showError(data?.message || "Profile data could not be loaded");
        return;
    }
    
    if (!data.Name) {
        showError("Invalid profile data: Name is required");
        return;
    }
    
    if (data?.Status && data.Status !== "Active") {
        showError("This profile is currently inactive");
        return;
    }

    try {
        // Apply plan-specific features
        const container = document.querySelector(".card-container");
        container.style.display = 'block';
        
        // Safe data access with fallbacks
        const profileData = {
            name: data.Name || 'User',
            tagline: data.Tagline || '',
            profilePic: data['Profile Picture URL'] || 'https://tccards.tn/Assets/default.png',
            bgImage: data['Background Image URL'] || '',
            formType: data['Form Type'] || '',
            socialLinks: data['Social Links'] || '',
            email: data.Email || '',
            phone: data.Phone || '',
            address: data.Address || ''
        };

        // Apply background style if available
        if (data['Selected Style']) {
            const selectedStyle = data['Selected Style'];
            
            if (selectedStyle.startsWith('linear-gradient')) {
            document.body.style.background = `${selectedStyle}`;
            } else {
            const styles = {
                minimal: { background: '#18181b' },
                black: { background: '#09090b' },
                navy: { background: '#020617' },
                forest: { background: '#022c22' },
                wine: { background: '#450a0a' },
              
                // Lighter color themes
                clouds: { background: '#0ea5e9' },
                Pink: { background: '#9b0055' },
                SkyBlue: { background: '#2563eb' },
                paleRed: { background: '#f00f4d' },
              
                // Professional Gradients
                corporateGradient: { background: 'linear-gradient(145deg, rgb(9, 9, 11), rgb(24, 24, 27), rgb(9, 9, 11))' },
                oceanGradient: { background: 'linear-gradient(145deg, rgb(2, 6, 23), rgb(15, 23, 42), rgb(2, 6, 23))' },
                forestGradient: { background: 'linear-gradient(145deg, rgb(2, 44, 34), rgb(6, 78, 59), rgb(2, 44, 34))' },
                burgundyGradient: { background: 'linear-gradient(145deg, rgb(69, 10, 10), rgb(127, 29, 29), rgb(69, 10, 10))' },
                default: "url(https://tccards.tn/Assets/bg.png) center fixed"
            };

            document.body.style.background = styles[data['Selected Style']]?.background || styles.default;
            document.body.style.backgroundSize = "cover";
            }
        }
        const styles = {
            corporateGradient: "linear-gradient(145deg, rgb(9, 9, 11), rgb(24, 24, 27), rgb(9, 9, 11))",
            oceanGradient: "linear-gradient(145deg, rgb(2, 6, 23), rgb(15, 23, 42), rgb(2, 6, 23))",
            minimal: { background: '#18181b' },
            black: { background: '#09090b' },
            navy: { background: '#020617' },
            forest: { background: '#022c22' },
            wine: { background: '#450a0a' },
          
            // Lighter color themes
            clouds: { background: '#0ea5e9' },
            Pink: { background: '#9b0055' },
            SkyBlue: { background: '#2563eb' },
            paleRed: { background: '#f00f4d' },
          
            // Professional Gradients
            corporateGradient: { background: 'linear-gradient(145deg, rgb(9, 9, 11), rgb(24, 24, 27), rgb(9, 9, 11))' },
            oceanGradient: { background: 'linear-gradient(145deg, rgb(2, 6, 23), rgb(15, 23, 42), rgb(2, 6, 23))' },
            forestGradient: { background: 'linear-gradient(145deg, rgb(2, 44, 34), rgb(6, 78, 59), rgb(2, 44, 34))' },
            burgundyGradient: { background: 'linear-gradient(145deg, rgb(69, 10, 10), rgb(127, 29, 29), rgb(69, 10, 10))' },
            default: "url(https://tccards.tn/Assets/bg.png) center fixed"
        };
        // Render the profile card
        container.innerHTML = `
            <div class="profile-container">
                ${planType === 'standard' && profileData.bgImage ? 
                    `<div class="profile-banner" style="background-image: url('${escapeHtml(profileData.bgImage)}')"></div>` : ''}
                
                <img src="${escapeHtml(profileData.profilePic)}" class="profile-picture" alt="${escapeHtml(profileData.name)}'s profile">
                
                <h2>${escapeHtml(profileData.name)}</h2>
                ${profileData.tagline ? `<p>${escapeHtml(profileData.tagline)}</p>` : ''}
                
                ${planType === 'standard' && profileData.formType ? 
                    `<div class="plan-badge">${escapeHtml(profileData.formType)} Plan</div>` : ''}
                
                ${renderSocialLinks(profileData.socialLinks)}
                
                ${(profileData.email || profileData.phone || profileData.address) ? 
                    `<button class="contact-btn" onclick="showContactDetails(${escapeHtml(JSON.stringify({
                        name: profileData.name,
                        profilepic: profileData.profilePic,
                        email: profileData.email,
                        phone: profileData.phone,
                        address: profileData.address,
                        style: styles[data['Selected Style']]?.background || styles.default
                    }))})">Get in Touch</button>` : ''}
                
                <footer>
                    <p>&copy; ${new Date().getFullYear()} Total Connect</p>
                </footer>
                
            </div>
        `;
        
        // Show success notification
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: "Profile Loaded",
                icon: "success",
                timer: 1000,
                showConfirmButton: false,
                position: 'bottom',
                toast: true,
                width: '300px',
                background: "#1a1a1a",
                color: "white",
            });
        }
    } catch (error) {
        console.error("Profile rendering error:", error);
        showError("Error displaying profile");
    }
}

function renderSocialLinks(links) {
    if (!links || typeof links !== 'string') return '';

    // Map of domains to their corresponding Font Awesome icons
    const platformIcons = {
        'facebook.com': 'fab fa-facebook',
        'twitter.com': 'fab fa-twitter',
        'instagram.com': 'fab fa-instagram',
        'linkedin.com': 'fab fa-linkedin',
        'youtube.com': 'fab fa-youtube',
        'tiktok.com': 'fab fa-tiktok',
        'pinterest.com': 'fab fa-pinterest',
        'snapchat.com': 'fab fa-snapchat',
        'reddit.com': 'fab fa-reddit',
        'discord.com': 'fab fa-discord',
        'twitch.tv': 'fab fa-twitch',
        'github.com': 'fab fa-github',
        'gitlab.com': 'fab fa-gitlab',
        'discord.gg': 'fab fa-discord',
        'bitly.com': 'fab fa-bitly',
        'medium.com': 'fab fa-medium',
        'whatsapp.com': 'fab fa-whatsapp',
        'telegram.org': 'fab fa-telegram',
        'slack.com': 'fab fa-slack',
        'vimeo.com': 'fab fa-vimeo',
        'spotify.com': 'fab fa-spotify',
        'apple.com': 'fab fa-apple',
        'google.com': 'fab fa-google',
        'amazon.com': 'fab fa-amazon',
        'microsoft.com': 'fab fa-microsoft',
        'paypal.com': 'fab fa-paypal'
    };

    const validLinks = links.split(",")
        .map(link => {
            link = link.trim();
            if (!link) return null;
            
            try {
                // Ensure URL has protocol
                if (!/^https?:\/\//i.test(link)) link = 'https://' + link;
                const url = new URL(link);
                const domain = url.hostname.replace(/^www\./, '');
                
                // Check if domain is in our platform icons
                const iconClass = Object.keys(platformIcons).find(key => 
                    domain.includes(key)
                ) ? platformIcons[Object.keys(platformIcons).find(key => domain.includes(key))] : 'fas fa-link';
                
                return {
                    href: url.href,
                    display: domain,
                    icon: iconClass
                };
            } catch (e) {
                return null;
            }
        })
        .filter(link => link !== null);

    if (!validLinks.length) return '';

    return `
        <div class="social-links">
            ${validLinks.map(link => `
                <a href="${escapeHtml(link.href)}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-3 hover:bg-gray-700 rounded-lg transition-colors">
                    <i class="${link.icon} text-lg"></i>
                    <span>${escapeHtml(link.display)}</span>
                </a>
            `).join('')}
        </div>
    `;
}

function showContactDetails(contact) {
    // Validate contact object
    if (!contact || typeof contact !== 'object') {
        console.error('Invalid contact data');
        return;
    }

    // Create header with profile picture and name
    const title = `
        <div class="contact-header">
            ${contact.profilepic ? `<img src="${escapeHtml(contact.profilepic)}" class="profile-picture" alt="${escapeHtml(contact.name || 'Contact')}">` : ''}
            <h2>${escapeHtml(contact.name || 'Contact')}</h2>
        </div>
    `;

    // Create HTML content for the modal
    const htmlContent = `
        ${contact.email ? `<p><strong>Email:</strong> ${escapeHtml(contact.email)}</p>` : ''}
        ${contact.phone ? `<p><strong>Phone:</strong> ${escapeHtml(contact.phone)}</p>` : ''}
        ${contact.address ? `<p><strong>Address:</strong> ${escapeHtml(contact.address)}</p>` : ''}
    `;

    // Determine background style
    const background = (typeof contact.style === 'object' && contact.style?.background) ? 
        contact.style.background : 
        (contact.style || '#162949');

    // Show the modal
    Swal.fire({
        title: title,
        html: htmlContent,
        confirmButtonText: "Save Contact",
        confirmButtonColor: "#4a90e2",
        background: background,
        showCancelButton: true,
        cancelButtonColor: "#ff4444",
        customClass: {
            popup: "swal-wide"
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            await handleContactSave(contact, background);
        }
    });
}

async function handleContactSave(contact, backgroundStyle) {
    try {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const contactName = contact.name || 'Contact';
        
        if (isMobile) {
            // Mobile device handling
            const contactData = {
                name: contactName,
                phone: contact.phone || '',
                email: contact.email || '',
                address: contact.address || ''
            };

            if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                // iOS devices
                window.location.href = `contacts://add-contact?name=${encodeURIComponent(contactData.name)}&phone=${encodeURIComponent(contactData.phone)}&email=${encodeURIComponent(contactData.email)}`;
            } else if (/Android/i.test(navigator.userAgent)) {
                // Android devices
                window.location.href = `intent://contacts/create#Intent;scheme=android-app;package=com.android.contacts;S.name=${encodeURIComponent(contactData.name)};S.phone=${encodeURIComponent(contactData.phone)};S.email=${encodeURIComponent(contactData.email)};end`;
            }
        } else {
            // Desktop devices - create vCard
            await downloadVCard(contact);
        }

        // Show success message
        await Swal.fire({
            title: 'Success!',
            text: isMobile ? 'Opening contacts app...' : 'Contact file downloaded successfully',
            icon: 'success',
            background: backgroundStyle,
            confirmButtonColor: "#4a90e2",
            timer: 2000,
            timerProgressBar: true
        });
    } catch (error) {
        console.error('Error saving contact:', error);
        // Fallback to vCard download if other methods fail
        await downloadVCard(contact);
        
        await Swal.fire({
            title: 'Contact Card Downloaded',
            text: 'Please import the downloaded file to your contacts app',
            icon: 'info',
            background: backgroundStyle,
            confirmButtonColor: "#4a90e2"
        });
    }
}

function downloadVCard(contact) {
    return new Promise((resolve) => {
        const contactName = contact.name || 'Contact';
        const contactCard = `BEGIN:VCARD
VERSION:3.0
FN:${contactName}
TEL:${contact.phone || ''}
EMAIL:${contact.email || ''}
ADR:${contact.address || ''}
END:VCARD`;

        const blob = new Blob([contactCard], { type: 'text/vcard' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${contactName}.vcf`;
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            resolve();
        }, 100);
    });
}
// XSS protection
function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') return unsafe;
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Error display
function showError(message) {
    const container = document.querySelector(".card-container") || document.body;
    container.innerHTML = `
        <div class="error-message">
            <h3 class="error-title">${escapeHtml(message)}</h3>
            <p class="error-subtext">Please check the URL or try again later.</p>
        </div>
    `;
    
    // Remove loading states
    document.body.classList.remove('loading');
    const existingLoader = document.querySelector('.loader');
    if (existingLoader) existingLoader.remove();
}

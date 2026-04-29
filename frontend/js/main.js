// Interactive Background Canvas Animation
const canvas = document.getElementById('interactive-bg');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0, mouseY = 0;
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.color = `rgba(212, 175, 55, ${Math.random() * 0.3 + 0.1})`;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
                const angle = Math.atan2(dy, dx);
                const force = (100 - distance) / 100;
                this.x -= Math.cos(angle) * force * 2;
                this.y -= Math.sin(angle) * force * 2;
            }
            
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }
    
    function initParticles() {
        particles = [];
        for (let i = 0; i < 100; i++) {
            particles.push(new Particle());
        }
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });
    
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    resizeCanvas();
    initParticles();
    animateParticles();
}

// Location Data
const locations = [
    {
        city: "Bangalore",
        venue: "Indiranagar",
        address: "12th Main, Indiranagar, Bangalore",
        timing: "12 PM – 1:30 AM",
        features: ["Rooftop Garden", "Craft Brews", "Live Music"],
        image: "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
        city: "Noida",
        venue: "Sector 104",
        address: "Sector 104, Noida Expressway",
        timing: "12 PM – 12:30 AM",
        features: ["Sky Lounge", "DJ Nights", "Global Cuisine"],
        image: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
        city: "Gurgaon",
        venue: "Cyber Hub",
        address: "Cyber City, DLF Phase 2, Gurgaon",
        timing: "11 AM – 1 AM",
        features: ["Corporate Events", "Cocktail Bar", "Alfresco Dining"],
        image: "https://images.pexels.com/photos/1267325/pexels-photo-1267325.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
        city: "Kolkata",
        venue: "Park Street",
        address: "Park Street Area, Kolkata",
        timing: "12 PM – 11:45 PM",
        features: ["Heritage View", "Live Ghazals", "Bengali Fusion"],
        image: "https://images.pexels.com/photos/2664216/pexels-photo-2664216.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
        city: "Mumbai",
        venue: "Juhu",
        address: "Juhu Tara Road, Mumbai",
        timing: "12 PM – 1 AM",
        features: ["Sea View", "Sunset Soirees", "Famous DJs"],
        image: "https://images.pexels.com/photos/3270203/pexels-photo-3270203.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
        city: "Hyderabad",
        venue: "Banjara Hills",
        address: "Road No. 12, Banjara Hills, Hyderabad",
        timing: "12 PM – 12 AM",
        features: ["Nawabi Ambiance", "Biryani Pairing", "Starlight Dinners"],
        image: "https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=800"
    }
];

// Gallery Data - Cozy Corner Removed
const galleryImages = [
    { category: "food", url: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=800", title: "Signature Dishes" },
    { category: "food", url: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800", title: "Gourmet Platters" },
    { category: "food", url: "https://images.pexels.com/photos/1059933/pexels-photo-1059933.jpeg?auto=compress&cs=tinysrgb&w=800", title: "Exotic Cocktails" },
    { category: "ambiance", url: "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=800", title: "Rooftop Dining" },
    { category: "ambiance", url: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800", title: "Elegant Ambiance" },
    { category: "events", url: "https://images.pexels.com/photos/3270203/pexels-photo-3270203.jpeg?auto=compress&cs=tinysrgb&w=800", title: "Live Events" },
    { category: "events", url: "https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=800", title: "Party Nights" },
    { category: "ambiance", url: "https://images.pexels.com/photos/1267325/pexels-photo-1267325.jpeg?auto=compress&cs=tinysrgb&w=800", title: "Romantic Setting" },
    { category: "food", url: "https://images.pexels.com/photos/2664216/pexels-photo-2664216.jpeg?auto=compress&cs=tinysrgb&w=800", title: "Chef Specials" },
    { category: "ambiance", url: "https://images.pexels.com/photos/1571450/pexels-photo-1571450.jpeg?auto=compress&cs=tinysrgb&w=800", title: "Luxury Seating" },
    { category: "events", url: "https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=800", title: "Celebrations" }
];

// Render Locations
function renderLocations() {
    const grid = document.getElementById('locationsGrid');
    if (!grid) return;
    
    grid.innerHTML = locations.map(loc => `
        <div class="location-card">
            <div class="location-image" style="background-image: linear-gradient(0deg, rgba(0,0,0,0.6), transparent), url('${loc.image}')">
                <div class="location-badge">${loc.city}</div>
            </div>
            <div class="location-content">
                <h3>Spice Route Haven – ${loc.venue}</h3>
                <div class="location-meta">
                    <div><i class="fas fa-map-pin"></i> ${loc.address}</div>
                    <div><i class="far fa-clock"></i> ${loc.timing}</div>
                </div>
                <div>
                    ${loc.features.map(f => `<span class="feature-tag">${f}</span>`).join('')}
                </div>
                <button onclick="scrollToBooking('${loc.city}')" class="btn-outline" style="margin-top:15px;">Book Now →</button>
            </div>
        </div>
    `).join('');
}

// Render Gallery
function renderGallery(filter = 'all') {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;
    
    const filtered = filter === 'all' ? galleryImages : galleryImages.filter(img => img.category === filter);
    
    grid.innerHTML = filtered.map(img => `
        <div class="gallery-item">
            <img src="${img.url}" alt="${img.title}" loading="lazy">
            <div class="gallery-overlay">
                <h4>${img.title}</h4>
            </div>
        </div>
    `).join('');
}

// Gallery Filters
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderGallery(btn.dataset.filter);
    });
});

// Scroll to booking section
function scrollToBooking(city) {
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => {
            const locationSelect = document.getElementById('location');
            if (locationSelect && city) {
                locationSelect.value = city;
            }
        }, 500);
    }
}

// Set minimum date for booking
const dateInput = document.getElementById('date');
if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
}

// Booking Form Submission
document.getElementById('bookingForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const bookingData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        location: document.getElementById('location').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        guests: parseInt(document.getElementById('guests').value),
        specialRequests: document.getElementById('specialRequests').value
    };
    
    const messageBox = document.getElementById('bookingMessage');
    
    if (bookingData.name && bookingData.email && bookingData.phone && bookingData.location && bookingData.date && bookingData.time && bookingData.guests) {
        messageBox.className = 'message-box success';
        messageBox.innerHTML = `✅ Booking confirmed! Reference: SRH${Math.floor(Math.random() * 10000)}. We'll send confirmation to ${bookingData.email}`;
        document.getElementById('bookingForm').reset();
        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 5000);
    } else {
        messageBox.className = 'message-box error';
        messageBox.innerHTML = '❌ Please fill in all required fields.';
    }
});

// Contact Form Submission
document.getElementById('contactForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const contactData = {
        name: document.getElementById('contactName').value,
        email: document.getElementById('contactEmail').value,
        phone: document.getElementById('contactPhone').value,
        location: document.getElementById('contactLocation').value,
        message: document.getElementById('contactMessage').value
    };
    
    const messageBox = document.getElementById('contactMessageBox');
    
    if (contactData.name && contactData.email && contactData.phone && contactData.location && contactData.message) {
        messageBox.className = 'message-box success';
        messageBox.innerHTML = '✅ Message sent successfully! We\'ll get back to you within 24 hours.';
        document.getElementById('contactForm').reset();
        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 5000);
    } else {
        messageBox.className = 'message-box error';
        messageBox.innerHTML = '❌ Please fill in all fields.';
    }
});

// Mobile Menu Toggle
document.querySelector('.nav-toggle')?.addEventListener('click', () => {
    document.querySelector('.nav-menu').classList.toggle('active');
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            document.querySelector('.nav-menu')?.classList.remove('active');
        }
    });
});

// Active nav link on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Initialize all
renderLocations();
renderGallery();

// Add global function for scrollToBooking
window.scrollToBooking = scrollToBooking;
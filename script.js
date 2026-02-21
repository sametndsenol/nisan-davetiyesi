// Müzik kontrolü için değişkenler
let musicPlaying = false;
let audio;
let musicBtn;
let musicIcon;

// Sayfa yüklendiğinde çalışacaklar
document.addEventListener('DOMContentLoaded', () => {
    audio = document.getElementById('bgMusic');
    musicBtn = document.getElementById('musicToggle');
    if (musicBtn) {
        musicIcon = musicBtn.querySelector('i');
    }
    
    // Mobil tarayıcılar için dinamik yükseklik ayarı
    const setVh = () => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVh();
    window.addEventListener('resize', setVh);
});

function openInvitation() {
    const overlay = document.getElementById('intro-overlay');
    const mainContent = document.getElementById('main-content');
    
    // Zarf açılış animasyonunu tetikle
    overlay.classList.add('opened');
    
    // Müzik butonunu görünür yap ve HEMEN çalmayı dene (Tarayıcı engeline takılmamak için tıklama anında başlamalı)
    if (musicBtn) {
        musicBtn.classList.remove('hidden');
        playMusic(); 
    }
    
    // Açılış animasyonundan sonra içeriği göster
    setTimeout(() => {
        overlay.classList.add('hidden');
        mainContent.classList.add('visible');
        
        // Animasyonları başlat
        setTimeout(initScrollAnimations, 100);
        
        // Parçacık (particle) efektini başlat
        createParticles();
        
        window.scrollTo(0, 0);
    }, 1200); 
}

// Müzik Oynat / Durdur
function toggleMusic() {
    if (!audio) return;
    
    if (musicPlaying) {
        audio.pause();
        musicIcon.classList.remove('fa-volume-up');
        musicIcon.classList.add('fa-volume-mute');
        musicBtn.classList.remove('playing');
        musicPlaying = false;
    } else {
        playMusic();
    }
}

// Müzik Başlatma Fonksiyonu
function playMusic() {
    if (!audio) return;
    
    audio.play().then(() => {
        musicIcon.classList.remove('fa-volume-mute');
        musicIcon.classList.add('fa-volume-up');
        musicBtn.classList.add('playing');
        musicPlaying = true;
    }).catch(error => {
        console.log("Müzik başlatılamadı:", error);
    });
}

// Büyülü Altın Parçacık (Particle) Üretici
function createParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;
    
    const particleCount = 25; // Ekranda aynı anda olacak maksimum parçacık
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Rastgele özellikler oluşturma
        const size = Math.random() * 3 + 1; // 1px ile 4px arası boyut
        const posX = Math.random() * 100; // Yatay eksende rastgele pozisyon (%)
        const delay = Math.random() * 15; // Animasyona başlama gecikmesi (0-15 saniye)
        const duration = Math.random() * 10 + 10; // Yukarı çıkma süresi (10-20 saniye)
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}vw`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        
        container.appendChild(particle);
    }
}

// Kaydırma (Scroll) Edildikçe Beliren Elementler
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.15, // Elementin %15'i göründüğünde
        rootMargin: "0px 0px -50px 0px"
    });

    animatedElements.forEach(el => observer.observe(el));
    
    // Sayfa ilk yüklendiğinde ekranda olanları hemen tetikle
    setTimeout(() => {
        animatedElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                el.classList.add('is-visible');
            }
        });
    }, 100);
}

// Takvime Ekle Butonu İşlevi (ICS dosyası indirme)
function addToCalendar(e) {
    e.preventDefault();
    
    // Örnek etkinlik bilgileri
    const event = {
        title: 'Büşra & Mehmet Nişan Töreni',
        description: 'Bu özel günümüzde sizleri de aramızda görmekten mutluluk duyarız.',
        location: 'Queen\'s Garden Davet Evi & Organizasyon, Bağcılar, İstanbul',
        startDate: '20260503T140000',
        endDate: '20260503T180000'
    };

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${event.startDate}
DTEND:${event.endDate}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'Busra_Mehmet_Nisan.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
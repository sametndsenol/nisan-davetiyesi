// Müzik kontrolü için değişkenler
let musicPlaying = false;
let audio;
let musicBtn;
let musicIcon;
let autoOpenTimeout; // Otomatik açılış zamanlayıcısı
let isOpened = false;

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

    // 10 Saniye boyunca hiçbir işlem yapılmazsa otomatik açılma
    autoOpenTimeout = setTimeout(() => {
        if (!isOpened) {
            autoOpenAndScroll();
        }
    }, 5000); // 10 saniye (10000 ms)
});

// Kullanıcı 10 saniye beklemeden kendisi tıklarsa çalışan normal açılış
function openInvitation() {
    if (isOpened) return;
    isOpened = true;
    
    // Kullanıcı tıkladığı için otomatik açılışı iptal et
    clearTimeout(autoOpenTimeout);
    
    const overlay = document.getElementById('intro-overlay');
    const mainContent = document.getElementById('main-content');
    
    // Zarf açılış animasyonunu tetikle
    overlay.classList.add('opened');
    
    // Müzik butonunu görünür yap ve HEMEN çalmayı dene
    if (musicBtn) {
        musicBtn.classList.remove('hidden');
        playMusic(); 
    }
    
    // Açılış animasyonundan sonra içeriği göster
    setTimeout(() => {
        overlay.classList.add('hidden');
        mainContent.classList.add('visible');
        
        setTimeout(initScrollAnimations, 100);
        createParticles();
        
        // Zarf tamamen açıldıktan 1.5 saniye sonra yavaşça aşağı kaydır (Kullanıcı kendi açsa da)
        setTimeout(() => {
            // Ekranın %80'i kadar aşağı, 4 saniye (4000ms) sürecek yavaş ve sinematik bir kaydırma
            smoothSlowScroll(window.innerHeight * 0.8, 4000);
        }, 1500);
    }, 1200); 
}

// Yavaş ve pürüzsüz kaydırma fonksiyonu
function smoothSlowScroll(targetPosition, duration) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // Easing function (ease-in-out)
        const ease = progress < 0.5 
            ? 2 * progress * progress 
            : -1 + (4 - 2 * progress) * progress;
            
        window.scrollTo(0, startPosition + distance * ease);
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }
    
    requestAnimationFrame(animation);
}

// 10 Saniye dolduğunda çalışan otomatik açılış ve aşağı kaydırma
function autoOpenAndScroll() {
    if (isOpened) return;
    isOpened = true;
    
    const overlay = document.getElementById('intro-overlay');
    const mainContent = document.getElementById('main-content');
    
    overlay.classList.add('opened');
    
    // Müzik çalmayı dener, ancak tarayıcı izinsiz çalmaya izin vermeyebilir.
    // Bu yüzden eğer ekranın herhangi bir yerine tıklanırsa müziği başlatacak bir dinleyici ekliyoruz.
    if (musicBtn) {
        musicBtn.classList.remove('hidden');
        
        playMusic(); 
        
        // Ekrana ilk dokunmada müziği çal (Eğer oto-play engellendiyse)
        document.body.addEventListener('click', function playOnFirstClick() {
            if (!musicPlaying) playMusic();
            document.body.removeEventListener('click', playOnFirstClick);
        });
        document.body.addEventListener('touchstart', function playOnFirstTouch() {
            if (!musicPlaying) playMusic();
            document.body.removeEventListener('touchstart', playOnFirstTouch);
        });
        document.body.addEventListener('scroll', function playOnFirstScroll() {
            if (!musicPlaying) playMusic();
            document.body.removeEventListener('scroll', playOnFirstScroll);
        });
    }
    
    setTimeout(() => {
        overlay.classList.add('hidden');
        mainContent.classList.add('visible');
        
        setTimeout(initScrollAnimations, 100);
        createParticles();
        
        // Zarf tamamen açıldıktan 1.5 saniye sonra yavaşça aşağı kaydır
        setTimeout(() => {
            // Ekranın %80'i kadar aşağı, 4 saniye (4000ms) sürecek yavaş ve sinematik bir kaydırma
            smoothSlowScroll(window.innerHeight * 0.8, 4000);
        }, 1500);
        
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
        
        // Rastgele özellikler oluşturma (Işıltıları daha ortada toplamak için X pozisyonunu ayarladık)
        const size = Math.random() * 3 + 1; // 1px ile 4px arası boyut
        const posX = 15 + Math.random() * 70; // Yatay eksende %15 ile %85 arası pozisyon
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

// Takvime Ekle Butonu İşlevi
function addToCalendar(e) {
    e.preventDefault();
    
    const title = encodeURIComponent('Büşra & Mehmet Nişan Töreni');
    const details = encodeURIComponent('Bu özel günümüzde sizleri de aramızda görmekten mutluluk duyarız.');
    const location = encodeURIComponent("Queen's Garden Davet Evi & Organizasyon, Bağcılar, İstanbul");
    // Türkiye saati UTC+3 olduğu için 14:00 -> 11:00 UTC, 18:00 -> 15:00 UTC
    const dates = '20260503T110000Z/20260503T150000Z';
    
    // Cihazın iPhone/iPad (iOS) olup olmadığını kontrol et
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    if (isIOS) {
        // Apple (iOS) cihazlar için .ics dosyasını direkt takvim uygulamasında açar
        const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:20260503T110000Z\nDTEND:20260503T150000Z\nSUMMARY:Büşra & Mehmet Nişan Töreni\nDESCRIPTION:Bu özel günümüzde sizleri de aramızda görmekten mutluluk duyarız.\nLOCATION:Queen's Garden Davet Evi & Organizasyon, Bağcılar, İstanbul\nEND:VEVENT\nEND:VCALENDAR`;
        window.location.href = "data:text/calendar;charset=utf8," + encodeURIComponent(icsContent);
    } else {
        // Android ve Bilgisayarlar için doğrudan Google Takvim sayfasını (uygulamasını) açar
        const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
        window.open(googleCalendarUrl, '_blank');
    }
}
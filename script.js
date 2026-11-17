// =========================================================
// YEAR
// =========================================================
document.getElementById('year').textContent = new Date().getFullYear();

// =========================================================
// TYPEWRITER — cycles through roles like a Python REPL
// =========================================================
(function typewriter() {
    const el = document.getElementById('typewriter');
    if (!el) return;

    const phrases = [
        'Tecnologia & Desenvolvimento',
        'Estudante ADS — FATEC Americana',
        'Colaborador na ACIA',
        'Comunicação, Mídia & Eventos',
        'Python | Java | Desenvolvimento Web'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const TYPE_SPEED = 55;
    const DELETE_SPEED = 30;
    const PAUSE_AFTER_TYPE = 1600;
    const PAUSE_AFTER_DELETE = 300;

    function tick() {
        const current = phrases[phraseIndex];

        if (!deleting) {
            charIndex++;
            el.textContent = current.slice(0, charIndex);
            if (charIndex === current.length) {
                deleting = true;
                setTimeout(tick, PAUSE_AFTER_TYPE);
                return;
            }
            setTimeout(tick, TYPE_SPEED);
        } else {
            charIndex--;
            el.textContent = current.slice(0, charIndex);
            if (charIndex === 0) {
                deleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                setTimeout(tick, PAUSE_AFTER_DELETE);
                return;
            }
            setTimeout(tick, DELETE_SPEED);
        }
    }

    tick();
})();

// =========================================================
// HEADER — shrink/blur state on scroll (class hook, styling optional)
// =========================================================
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        header.style.borderBottomColor = 'rgba(67,255,122,0.18)';
    } else {
        header.style.borderBottomColor = '';
    }
}, { passive: true });

// =========================================================
// ACTIVE NAV LINK ON SCROLL
// =========================================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function setActiveLink() {
    let currentId = sections[0]?.id;
    const scrollPos = window.scrollY + 140;

    sections.forEach((section) => {
        if (section.offsetTop <= scrollPos) {
            currentId = section.id;
        }
    });

    navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
}
window.addEventListener('scroll', setActiveLink, { passive: true });
setActiveLink();

// =========================================================
// MOBILE MENU
// =========================================================
const burger = document.getElementById('burger');
const navigation = document.getElementById('navigation');

burger.addEventListener('click', () => {
    const isOpen = navigation.classList.toggle('open');
    navigation.style.display = isOpen ? 'flex' : '';
    burger.setAttribute('aria-expanded', String(isOpen));
    burger.classList.toggle('is-active', isOpen);
});

navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        navigation.classList.remove('open');
        navigation.style.display = '';
        burger.setAttribute('aria-expanded', 'false');
    });
});

// =========================================================
// SCROLL REVEAL
// =========================================================
const revealTargets = document.querySelectorAll(
    '.about-grid, .timeline-grid, .skills-grid, .projects-grid, .contact-inner, .skill-card, .project-card, .timeline-col'
);
revealTargets.forEach((el) => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

revealTargets.forEach((el) => observer.observe(el));

// =========================================================
// CONTACT — envia mensagem por e-mail via Formspree
// =========================================================
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

function getFormData() {
    return {
        name: document.getElementById('name').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        email: document.getElementById('email').value.trim(),
        message: document.getElementById('message').value.trim(),
    };
}

function formIsValid({ name, phone, email, message }) {
    return name && phone && email && message;
}

function showSuccessCard({ name, phone, email, message }) {
    status.innerHTML = `
        <div class="success-card">
            <p class="success-title">&gt;&gt;&gt; mensagem enviada com sucesso!</p>
            <p class="success-sub">Paulo Soares entrará em contato em breve.</p>
            <dl>
                <dt>nome</dt><dd>${name}</dd>
                <dt>telefone</dt><dd>${phone}</dd>
                <dt>email</dt><dd>${email}</dd>
                <dt>mensagem</dt><dd>${message}</dd>
            </dl>
        </div>
    `;
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = getFormData();

    if (!formIsValid(data)) {
        status.style.color = 'var(--danger)';
        status.textContent = '>>> preencha todos os campos antes de enviar.';
        return;
    }

    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'enviando...';
    submitBtn.disabled = true;

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            headers: { Accept: 'application/json' },
            body: new FormData(form),
        });

        if (response.ok) {
            showSuccessCard(data);
            form.reset();
        } else {
            status.style.color = 'var(--danger)';
            status.textContent = '>>> algo deu errado. Tente novamente em instantes.';
        }
    } catch (err) {
        status.style.color = 'var(--danger)';
        status.textContent = '>>> falha de conexão. Verifique sua internet e tente de novo.';
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

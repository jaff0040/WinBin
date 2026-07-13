const header = document.querySelector('.header');
const navToggle = document.querySelector('.nav-toggle');
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.navbar a');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
});

navToggle.addEventListener('click', () => {
  const isOpen = navbar.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.forEach(link => link.addEventListener('click', () => {
  navbar.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
document.getElementById('year').textContent = new Date().getFullYear();

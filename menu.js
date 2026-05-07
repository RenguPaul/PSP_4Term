// подсветка активной страницы
const page = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('nav a').forEach(link => {
    if (link.getAttribute('href') === page) link.classList.add('active');
});

// эффект нажатия для кнопок
document.querySelectorAll('button').forEach(btn => {
    btn.onmousedown = () => btn.style.transform = 'scale(0.96)';
    btn.onmouseup = () => btn.style.transform = '';
    btn.onmouseleave = () => btn.style.transform = '';
});

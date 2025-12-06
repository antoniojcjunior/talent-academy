
document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar');
  const toggleButton = document.getElementById('toggleSidebar');

  if (!sidebar || !toggleButton) {
    console.warn('Sidebar ou botão de toggle não encontrados no DOM.');
    return;
  }

  toggleButton.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
  });
});

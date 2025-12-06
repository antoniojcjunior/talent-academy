function injectGlobalModal() {
  // Evita duplicar se já existir
  if (document.getElementById('validationModal')) return;

  const modalHtml = `
    <div class="modal fade" id="validationModal" tabindex="-1" aria-labelledby="validationModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-header">
            <h6 class="modal-title" id="validationModalLabel"></h6>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" id="modalMessage">
            </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-primary" id="confirmYesButton" style="display: none;">Sim</button>
            <button type="button" class="btn btn-secondary" id="confirmNoButton" data-bs-dismiss="modal" style="display: none;">Não</button>
            <button type="button" class="btn btn-primary" id="alertOkButton" data-bs-dismiss="modal">OK</button>
        </div>
        </div>
    </div>
    </div>
    `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

document.addEventListener('DOMContentLoaded', () => {
  injectGlobalModal();
});
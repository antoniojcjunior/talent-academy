
let modalElement;
let modalMessage;
let confirmYesButton;
let confirmNoButton;
let alertOkButton;
let validationModal;

function ensureModalInitialized() {
  if (modalElement && modalMessage && confirmYesButton && confirmNoButton && alertOkButton && validationModal) {
    return true;
  }

  modalElement = document.getElementById('validationModal');
  modalMessage = document.getElementById('modalMessage');
  confirmYesButton = document.getElementById('confirmYesButton');
  confirmNoButton = document.getElementById('confirmNoButton');
  alertOkButton = document.getElementById('alertOkButton');

  if (!modalElement || !modalMessage || !confirmYesButton || !confirmNoButton || !alertOkButton) {
    console.error('Modal de validação não encontrado no DOM.');
    return false;
  }

  validationModal = bootstrap.Modal.getOrCreateInstance(modalElement);
  return true;
}

export function showAlert(message) {
  return new Promise((resolve) => {
    if (!ensureModalInitialized()) {
      alert(message);
      return resolve();
    }

    // Modo ALERT: só o botão OK aparece
    confirmYesButton.style.display = 'none';
    confirmNoButton.style.display = 'none';
    alertOkButton.style.display = 'inline-block';

    modalMessage.innerHTML = message;

    const onOk = () => {
      alertOkButton.removeEventListener('click', onOk);
      resolve();
    };

    alertOkButton.addEventListener('click', onOk);

    validationModal.show();
  });
}

export function showConfirm(message) {
  return new Promise((resolve) => {
    if (!ensureModalInitialized()) {
      const result = window.confirm(message); // fallback
      return resolve(result);
    }

    // Modo CONFIRM: mostra SIM/NÃO, esconde OK
    alertOkButton.style.display = 'none';
    confirmYesButton.style.display = 'inline-block';
    confirmNoButton.style.display = 'inline-block';

    modalMessage.innerHTML = message;

    const onYes = () => {
      cleanup();
      resolve(true);
    };

    const onNo = () => {
      cleanup();
      resolve(false);
    };

    function cleanup() {
      confirmYesButton.removeEventListener('click', onYes);
      confirmNoButton.removeEventListener('click', onNo);
    }

    confirmYesButton.addEventListener('click', onYes);
    confirmNoButton.addEventListener('click', onNo);

    validationModal.show();
  });
}

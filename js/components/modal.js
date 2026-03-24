let modalInstance;

export const initModal = async () => {
  const res = await fetch('../../components/modal.html');
  const html = await res.text();

  document.getElementById('modal-container').innerHTML = html;

  const modalElement = document.getElementById('staticBackdrop');

  if (!modalElement) {
    console.error("Modal not found!");
    return;
  }

  modalInstance = new bootstrap.Modal(modalElement, {
    focus: true
  });

};// initialize the modal by taking instance from modal class in bootstrap

export const openModal = (title, content) => {
  document.getElementById('staticBackdropLabel').textContent = title;

  const body = document.getElementById('modal-body');
  body.innerHTML = content;

  modalInstance.show();

  return document.getElementById('staticBackdrop');
};// open (show) the modal popup by show() funtion

export const closeModal = () => {
  modalInstance?.hide();
};// close modal by hide() function
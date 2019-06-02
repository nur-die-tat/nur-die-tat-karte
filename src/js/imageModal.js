/* globals $ */

export function createImageModalLinks (target) {
  for (let imageModalLink of target.querySelectorAll('.image-modal')) {
    imageModalLink.addEventListener('click', e => {
      $('#imageModal .modal-body img').prop('src', imageModalLink.querySelector('img').src)
      $('#imageModal').modal('show')
      e.preventDefault()
    })
  }
}

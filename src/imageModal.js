export function imageModal (imagesrc) {
    $('#imageModal .modal-body img').prop("src", imagesrc);
    $('#imageModal').modal('show');
}

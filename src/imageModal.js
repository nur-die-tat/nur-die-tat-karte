export function imageModal (imagesrc) {
    let body = $('#imageModal .modal-body');
    body.empty();
    body.append($("<img>").prop("src", imagesrc));
    $('#imageModal').modal('show');
}

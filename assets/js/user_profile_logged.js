
{
    const avatarInput = document.getElementById('avatarInput');
    const avatarPreview = document.getElementById('avatarPreview');

    avatarInput.addEventListener('change', function (event) {
        const selectedFile = event.target.files[0];

        if (selectedFile) {
            avatarPreview.style.display = 'block';
            avatarPreview.src = URL.createObjectURL(selectedFile);
        } else {
            avatarPreview.style.display = 'none';
            avatarPreview.src = '#';
        }
    });
}
{
    $(document).ready(function () {

        console.log('started');
        // Add a submit event listener to the form
        $("#password-form").submit(function (event) {
            
            event.preventDefault(); // Prevent the form from submitting

            // Get the values of password and confirm password fields
            var password = $("#password").val();
            var confirmPassword = $("#confirm-password").val();

            // Compare the values
            if (password !== confirmPassword) {
                // Passwords don't match
                new Noty({
                    theme: 'relax',
                    text: "Passwords don't match",
                    type: 'error',
                    timeout: 1500 // Duration of the notification in milliseconds
                }).show();

                $("#password").val('');
                $("#confirm-password").val('');
            } else {
                // Passwords match, you can now submit the form
                $("#password-form").off("submit").submit();
            }
        });
    });
}




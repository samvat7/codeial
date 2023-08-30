{

    $(document).ready( () => {

        $('#forgot-password-form').on('submit', (e) => {

            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/users/reset-password/sendEmail',
                data: $('form').serialize(),
                success: function (data) {

                    console.log(data);

                    new Noty({
                        theme: 'relax',
                        text: 'Verification Email Sent',
                        type: 'success',
                        timeout: 1500 // Duration of the notification in milliseconds
                    }).show();
                },
                error: function (error) {

                    console.log(error.responseText);
                }
            });
        })
    })
}
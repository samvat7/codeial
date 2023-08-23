{

    $(document).ready(function () {
        // Attach deletePost listeners to all delete buttons
        $('.post-delete-btn').each(function () {
            deletePost($(this));
        });

        $('.comment-delete-btn').each(function () {
            deleteComment($(this));
        });
    });


    let createPost = () => {

        let newPostForm = $('.new-post-form');

        newPostForm.on('keydown', (e) => {

            if (e.keyCode == 13) {

                $.ajax({
                    type: 'post',
                    url: 'http://localhost:8000/posts/create',
                    data: newPostForm.serialize(),
                    success: function (data) {

                        let newPost = newPostDom(data.data.post);

                        $('.post-list').prepend(newPost);

                        deletePost($('.post-delete-btn', newPost));

                        $('.new-post-form textarea').val('');

                        new Noty({
                            theme: 'relax',
                            text: 'Post created successfully!',
                            type: 'success',
                            timeout: 1500 // Duration of the notification in milliseconds
                        }).show();
                    },
                    error: function (error) {

                        console.log(error.responseText);
                    }
                });
            }
        });


        newPostForm.submit((e) => {

            e.preventDefault();

            $.ajax({
                type: 'post',
                url: 'http://localhost:8000/posts/create',
                data: newPostForm.serialize(),
                success: function (data) {

                    let newPost = newPostDom(data.data.post);

                    $('.post-list').prepend(newPost);

                    deletePost($('.post-delete-btn', newPost));

                    $('.new-post-form textarea').val('');

                    new Noty({
                        theme: 'relax',
                        text: 'Posted',
                        type: 'success',
                        timeout: 1500 // Duration of the notification in milliseconds
                    }).show();
                },
                error: function (error) {

                    console.log(error.responseText);
                }
            });
        });
    }

    let createComment = () => {

        $('.post-list').on('submit', '.comment-form', function (e) {

            e.preventDefault();

            let commentForm = $(this);

            $.ajax({
                type: 'post',
                url: 'http://localhost:8000/comments/create',
                data: commentForm.serialize(),
                success: function (data) {

                    let newComment = newCommentDom(data.data.comment);

                    $(`#post-comments-${data.data.comment.post._id}`).append(newComment);

                    deleteComment($('.comment-delete-btn', newComment));

                    $('.textarea').val('');  // Use .textarea within the form

                    new Noty({
                        theme: 'relax',
                        text: 'Commented',
                        type: 'success',
                        timeout: 1500 // Duration of the notification in milliseconds
                    }).show();
                },
                error: function (error) {

                    console.log(error.responseText);
                }
            });
        });
    }


    let newPostDom = function (post) {

        return $(`<div class="user-post" id="post-${post._id}">
        <div class="post-header">
          <p class="username">
    
             ${post.user.name}
          </p>
          
            <a class="post-delete-btn" href="http://localhost:8000/posts/destroy/${post._id}" id="post-delete-${post._id}"
              ><i class="fa-solid fa-trash"></i></a>
           
        </div>
    
        <p class="post-content">
            ${post.content}
        </p>

        <div id="post-comments-${post._id}" class="post-comments">
        </div>
            
              <form action="http://localhost:8000/comments/create" class="comment-form" method="post">
    
                <input type="text" name="content" placeholder="Type here to add comment..." class="textarea" required>
                <input type="hidden" name="post" value="${post._id}">
                <input type="submit" value="Comment">
              </form>
              
    
      </div>`)
    }

    //method to create a comment on a post from DOM

    let newCommentDom = (comment) => {

        return $(`
        <div class="comment" id="comment-${comment._id}">
        <div class="comment-header">
          <p class="comment-username">
            ${comment.user.name}     
                  <a href="http://localhost:8000/comments/destroy/${comment._id}" id="comment-delete-${comment._id}"
                    class="comment-delete-btn"><i class="fa-solid fa-trash"></i></a>
          </p>

          <p class="comment-content">
            ${comment.content}
          </p>

        </div>
      </div>
        `);
    }


    //method to delete a post from DOM

    let deletePost = () => {
        $('.post-list').on('click', '.post-delete-btn', function (e) {
            e.preventDefault();

            let deleteLink = $(this);

            $.ajax({
                type: 'get',
                url: deleteLink.prop('href'),
                success: function (data) {
                    $(`#post-${data.data.post_id}`).remove();

                    new Noty({
                        theme: 'relax',
                        text: 'Post deleted',
                        type: 'success',
                        timeout: 1500 // Duration of the notification in milliseconds
                    }).show();
                },
                error: function (error) {
                    console.log(error.responseText);
                }
            });
        });
    }

    let deleteComment = () => {

        $('.post-list').on('click', '.comment-delete-btn', function (e) {

            e.preventDefault();

            let deleteLink = $(this);

            $.ajax({
                type: 'get',
                url: deleteLink.prop('href'),
                success: function (data) {
                    $(`#comment-${data.data.comment_id}`).remove();

                    new Noty({
                        theme: 'relax',
                        text: 'Comment deleted',
                        type: 'success',
                        timeout: 1500 // Duration of the notification in milliseconds
                    }).show();
                },
                error: function (error) {
                    console.log(error.responseText);
                }
            });
        });
    }



    createPost();
    createComment();
}
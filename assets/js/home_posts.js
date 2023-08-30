{

    $(document).ready(function () {
        // Attach deletePost listeners to all delete buttons
        $('.post-delete-btn').each(function () {
            deletePost($(this));
        });

        $('.comment-delete-btn').each(function () {
            deleteComment($(this));
        });

        $('.post-likes a').each(function () {

            likePost($(this));
        });

        $('.comment-likes a').each( function () {

            likeComment($(this));
        })

        $('.add-friend-btn').each( function () {
            
            addFriend($(this));
        })

        $('.remove-friend-btn').each( function () {
            
            removeFriend($(this));
        })
    });


    let createPost = () => {

        let newPostForm = $('.new-post-form');

        newPostForm.on('keydown', (e) => {

            if (e.keyCode == 13) {

                $.ajax({
                    type: 'post',
                    url: '/posts/create',
                    data: newPostForm.serialize(),
                    success: function (data) {

                        let newPost = newPostDom(data.data.post);

                        $('.post-list').prepend(newPost);

                        deletePost($('.post-delete-btn', newPost));

                        likePost($('.post-like-btn', newPost));

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
                url: '/posts/create',
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
                url: '/comments/create',
                data: commentForm.serialize(),
                success: function (data) {

                    let newComment = newCommentDom(data.data.comment);

                    $(`#post-comments-${data.data.comment.post._id}`).append(newComment);

                    deleteComment($('.comment-delete-btn', newComment));

                    likeComment($('.comment-like-btn', newComment));

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
          
            <a class="post-delete-btn" href="/posts/destroy/${post._id}" id="post-delete-${post._id}"
              ><i class="fa-solid fa-trash"></i></a>
           
        </div>
    
        <p class="post-content">
            ${post.content}
        </p>

        <div id="post-comments-${post._id}" class="post-comments">
        </div>
            
              <form action="/comments/create" class="comment-form" method="post">
    
                <input type="text" name="content" placeholder="Type here to add comment..." class="textarea" required>
                <input type="hidden" name="post" value="${post._id}">
                <input type="submit" value="Comment">
              </form>
        
              <div class="post-footer">

              <div class="post-likes">
      
                <a href="/likes/toggle/?type=Post&id=${post._id}" class="post-like-btn">
                 
      
                    <i class="fa-regular fa-heart"></i>
                    
          </a>
                <span>0</span>
              </div>
      
            </div>
    
      </div>`)
    }

    //method to create a comment on a post from DOM

    let newCommentDom = (comment) => {

        return $(`
        <div class="comment" id="comment-${comment._id}">
        <div class="comment-header">
          <p class="comment-username">
            ${comment.user.name}     
                  <a href="/comments/destroy/${comment._id}" id="comment-delete-${comment._id}"
                    class="comment-delete-btn"><i class="fa-solid fa-trash"></i></a>
          </p>

          <p class="comment-content">
            ${comment.content}
          </p>

        </div>
        <div class="comment-footer">
          <div class="comment-likes">
            <a href="/likes/toggle/?type=Comment&id=${comment._id}" class="comment-like-btn">
              
                <i class="fa-regular fa-heart"></i>

            </a>
            <span>0</span>  
          </div>
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

    let likePost = (post) => {



        $(post).on('click', (e) => {

            e.preventDefault();

            $.ajax({

                type: 'post',
                url: post.prop('href'),
                success: function (data) {

                    if(data.data.deleted){

                        $(`#post-${data.data.likeableID} .post-likes a i`).remove();

                        $(`#post-${data.data.likeableID} .post-likes a`).append($(`<i class="fa-regular fa-heart"></i>`));
                    }else{

                        $(`#post-${data.data.likeableID} .post-likes a i`).remove();

                        $(`#post-${data.data.likeableID} .post-likes a`).append($(`<i class="fa-solid fa-heart"></i>`));
                    }

                    console.log(data);

                    let likeCount = post.siblings('span');

                    likeCount.text(data.data.number_of_likes);

                },
                error: function (err) {

                    console.log(err.responseText);
                }
            })
        });
    }

    let likeComment = (comment) => {

        $(comment).on('click', (e) => {

            e.preventDefault();

            $.ajax({

                type: 'post',
                url: comment.prop('href'),
                success: function (data) {

                    if(data.data.deleted){

                        $(`#comment-${data.data.likeableID} .comment-likes a i`).remove();

                        $(`#comment-${data.data.likeableID} .comment-likes a`).append($(`<i class="fa-regular fa-heart"></i>`));
                    }else{

                        $(`#comment-${data.data.likeableID} .comment-likes a i`).remove();

                        $(`#comment-${data.data.likeableID} .comment-likes a`).append($(`<i class="fa-solid fa-heart"></i>`));
                    }

                    console.log(data);

                    let likeCount = comment.siblings('span');

                    likeCount.text(data.data.number_of_likes);

                },
                error: function (err) {

                    console.log(err.responseText);
                }
            })
        });
    }

let addFriend = (friend) => {

    $(friend).on('click', (e) => {

        e.preventDefault();

        console.log(friend.prop('href'));

        $.ajax({

            type: 'post',
            url: friend.prop('href'),
            success: function (data) {
                
                console.log(data);

                $(friend).find('i').remove();

                new Noty({
                    theme: 'relax',
                    text: data.message,
                    type: 'success',
                    timeout: 1500 // Duration of the notification in milliseconds
                }).show();
            },
            error: function (err) {
                
                console.log('Error in add friend script',err);
            }
        });
    });
}

let removeFriend = (friend) => {

    $(friend).on('click', (e) => {

        e.preventDefault();

        console.log(friend.prop('href'));

        $.ajax({

            type: 'post',
            url: friend.prop('href'),
            success: function (data) {
                
                console.log(data);

                $(friend).find('i').remove();

                new Noty({
                    theme: 'relax',
                    text: data.message,
                    type: 'success',
                    timeout: 1500 // Duration of the notification in milliseconds
                }).show();
            },
            error: function (err) {
                
                console.log('Error in remove friend script',err);
            }
        });
    });
}


    createPost();
    createComment();
}
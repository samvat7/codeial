$(document).ready((function(){console.log("started"),$("#password-form").submit((function(o){o.preventDefault(),$("#password").val()!==$("#confirm-password").val()?(new Noty({theme:"relax",text:"Passwords don't match",type:"error",timeout:1500}).show(),$("#password").val(""),$("#confirm-password").val("")):$("#password-form").off("submit").submit()}))}));
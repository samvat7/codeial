{const e=document.getElementById("avatarInput"),t=document.getElementById("avatarPreview");e.addEventListener("change",(function(e){const n=e.target.files[0];n?(t.style.display="block",t.src=URL.createObjectURL(n)):(t.style.display="none",t.src="#")}))}
function doFirst(){

    let editBtnConfirm = document.getElementById("editBtnConfirm");
    let editBtnCancel = document.getElementById("editBtnCancel");
    let ckEditorContainer = document.querySelector(".ckEditorContainer");

    editBtnConfirm.addEventListener("click", ()=>{
        console.log("click ipen");
        ckEditorContainer.style = "display:block";
    });

    editBtnCancel.addEventListener("click", ()=>{
        ckEditorContainer.style = "display:none";
    });

}

window.addEventListener('load', doFirst);
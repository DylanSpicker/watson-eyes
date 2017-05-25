/* Main.js */
function visualAnalysis(method="text", img, ctx){

    $.ajax({
        url: "visual-analysis/"+method,
        method: "POST",
        data: {img: img},
        success: function(response){ handleVisualResponse(response, method, ctx); }
    });
}

function handleVisualResponse(response, method, ctx) { 
    var image_response = JSON.parse(response).images[0];
    var colors = ["black"];

    // Iterate over the method {text / face / custom}
    if (method == "text") {
        $("#text_response").html("");
        image_response.words.forEach(function(word, i){
            var word_top = word.location.top,
                word_left = word.location.left,
                word_width = word.location.width,
                word_height = word.location.height;

            if (word_height <= 20) {
                font_size = 20;
            } else {
                font_size = word_height;
            }
            ctx.beginPath();
            ctx.lineWidth="1";
            ctx.strokeStyle=colors[i%colors.length - 1];
            ctx.rect(word_left,word_top,word_width,word_height);
            ctx.stroke();
            
            ctx.font = "bolder "+font_size+"px  Monospace";
            ctx.fillStyle = colors[i%colors.length - 1];
            ctx.fillText(word.word.toUpperCase(),word_left+1,word_top-5+font_size);
        });
        $("#text_response").text(image_response.text);
    } else if(method == "face") {
        $("#text_response").html("");
        image_response.faces.forEach(function(face,i){
            var face_top = face.face_location.top,
                face_left = face.face_location.left,
                face_height = face.face_location.height,
                face_width = face.face_location.width,
                color = colors[i%colors.length - 1],
                age_min = face.age.min,
                age_max = face.age.max,
                age_confidence = face.age.score,
                gender = face.gender.gender,
                gender_confidence = face.gender.score;

            ctx.beginPath();
            ctx.lineWidth="1";
            ctx.strokeStyle=color;
            ctx.rect(face_left,face_top,face_width,face_height);
            ctx.stroke();
            $("#text_response").append("<h2>Face "+(i+1)+"</h2>");
            $("#text_response").append("<p><strong>Age: </strong>"+age_min+"-"+age_max+" ("+(age_confidence*100).toFixed(2)+"%)</p>"+
                                        "<p><strong>Gender: </strong>"+gender+" ("+(gender_confidence*100).toFixed(2)+"%)</p>");
            ctx.font = "bolder 30px  Monospace";
            ctx.fillStyle = colors[i%colors.length - 1];
            ctx.fillText(""+(i+1),face_left+1,face_top+15);
        });
    } else {
        $("#text_response").html("<h2>Predicted Classes</h2>");
        image_response.classifiers.forEach(function(classifier,i){
            $("#text_response").append("<h3>"+classifier.name+"</h3>")
            classifier.classes.forEach(function(img_class, j){
                $("#text_response").append("<p>" + img_class.class + "(" + (100*img_class.score).toFixed(2) + "%)</p>");
            });
        });
    }
}
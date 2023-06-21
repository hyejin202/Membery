listComment();

function listComment() {
	const detailId = $("#detailIdText").text().trim(); //상세페이지 번호 가져옴 
	console.log("listComment 함수 실행 : " + detailId);

	$.ajax("/petsitterComment/list?detailId=" + detailId, {
		method: "get",
		success: function(petsitterComments) {
			$("#commentListContainer").empty();
			for (const petsitterComment of petsitterComments) {
				//후기를 모두 조회해서 반복문 돌림 
				const insertedDate = new Date(petsitterComment.inserted); // 작성날짜 
				const formattedDate = insertedDate.toISOString().split('T')[0]; //작성날짜 
				const starCount = petsitterComment.star; //별점 
				console.log(starCount)

				$(document).ready(function() {
					$('.ui.star.rating').rating({
						maxRating: 5
					});
				});
				// 각 후기의 별점이 보이게 하지위한 코드 
				$("#commentListContainer").append(`
				<a class="avatar">
					<img src="${bucketUrl}/pet/${petsitterComment.defaultPetId}/${petsitterComment.photo}">
				</a>
				<div class="content">
					<a class="author">${petsitterComment.memberId}</a>
					<div class="ui star rating" data-rating="${starCount}"></div>
					<div class="metadata">
						<span class="date">${formattedDate}</span>
					</div>
					<div class="text">${petsitterComment.body}</div>
					<div class="actions">
						<a id="commentDeleteBtn${petsitterComment.id}" 
							class="commentDeleteBtn ${petsitterComment.editable ? '' : 'd-none'}" 
							data-bs-toggle="modal" 
							data-bs-target="#deleteCommentModal"
							comment-id="${petsitterComment.id}">
						삭제
						</a>
						<a id="comment-modify-btn${petsitterComment.id}" 
							class="commentModifyBtn ${petsitterComment.editable ? '' : 'd-none'}"
							data-bs-toggle="modal" 
							data-bs-target="#modifyCommentModal" 
							comment-id="${petsitterComment.id}">
						수정
						</a>
					</div>
				</div>
				<br>
				`)


			}
			//삭제 버튼을 누르면 
			$(".commentDeleteBtn").click(function() {
				const commentId = $(this).attr("comment-id"); //속성의 값을 가져옴 
				$("#commentDeleteModalBtn").attr("comment-id", commentId);//모달 버튼 속성에 값을 넣어줌 
			});

			//수정 버튼을 누르면
			$(".commentModifyBtn").click(function() {
				const commentId = $(this).attr("comment-id"); //속성의 값을 가져옴
				$("#commentModifyModalBtn").attr("comment-id", commentId); // 모달 버튼에 속성 붙여줌 

				// 기존의 후기 내용 조회
				$.ajax("/petsitterComment/get/" + commentId, {
					success: function(comment) {
						console.log(comment.star);
						console.log(comment.id);
						console.log(createStarText(comment.star));
						console.log(comment.body);

						$("#commentBodyAreaModify").val(comment.body); //후기 내용 조회해서 넣기 
						$("#starRatingModify").val(comment.star); //별점수 조회해서 input에 넣기 
						var text = createStarText(comment.star);
						$("#commentForAddStar").empty();
						$("#commentForAddStar").append(`<h3 class="ui header center aligned">${text}</h3>`); //별점수에 따른 코멘트 넣기 
						$(".star")
							.rating({
								initialRating: comment.star,
								maxRating: 5,
								onRate: function(star) {
									console.log(createStarText(star)); // 별점 수정 점수를 출력
									var modifyText = createStarText(star);
									$("#commentForAddStar").empty();//코멘트 넣는 곳 비워주고 
									$("#commentForAddStar").append(`<h3 class="ui header center aligned">${modifyText}</h3>`); //선택한 별점에 따른 코멘트 나오도록 함 
									$("#starRatingModify").val(star); //별점을 다시 넣어줌 
								}
							});
					}
				});
			});
		}
	})
}

//추가버튼을 누르면 
function addCommentBtn() {
	$('.ui.star.rating').rating({
		initialRating: 0,
		maxRating: 5,
		onRate: function(star) {
			console.log(star);
			var text = createStarText(star); //별점에 따른 코멘트 꺼내오기 
			console.log(text);
			$("#addCommentStar").empty();//코멘트 넣는 곳 비워주고
			$("#addCommentStar").append(`<h3 class="ui header center aligned">${text}</h3>`); //별점수에 따른 코멘트 넣기
			$("#addStarRating").val(star);
		}
	});
}

// 모달 추가버튼을 누르면
$("#addCommentModalBtn").click(function() {
	const detailId = $("#detailIdText").text().trim();
	const body = $("#commentBodyArea").val();
	const star = $(".starRating").val();
	const data = { detailId, body, star };
	console.log(data);

	$.ajax("/petsitterComment/add", {
		method: "post",
		contentType: "application/json",
		data: JSON.stringify(data),
		complete: function() {
			listComment();
		}
	})
})

//모달 삭제버튼을 누르면
$("#commentDeleteModalBtn").click(function() {
	const commentId = $(this).attr("comment-id");
	console.log(commentId);
	$.ajax("/petsitterComment/delete/" + commentId, {
		method: "delete",
		complete: function() {
			listComment();
		}
	})
})

//모달 수정버튼을 누르면
$("#commentModifyModalBtn").click(function() {
	const id = $(this).attr("comment-id");
	const star = $("#starRatingModify").val();
	const body = $("#commentBodyAreaModify").val();
	const data = { id, star, body };
	console.log("id : " + id);
	console.log("star : " + star);
	console.log("body : " + body);

	$.ajax("/petsitterComment/modify/" + id, {
		method: "put",
		contentType: "application/json",
		data: JSON.stringify(data),
		success: function() {
			listComment();
		}
	})
})

function createStarText(rating) {
	const starTexts = {
		1: "별로예요..",
		2: "그냥 그래요..",
		3: "좋았어요!!",
		4: "추천해요!!!",
		5: "최고였어요!!🩷"
	};
	return starTexts[rating];
}








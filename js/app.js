/* Global Variable */
var db;
var j;

/* BBC Page로 이동 */
function moveBBC(){
	$("#mainpage").hide();
	$("#pagebbc").show();
}

/* ABC Page로 이동 */
function moveABC(){
	$("#mainpage").hide();
	$("#pageabc").show();
}

/* VOA Page로 이동 */
function moveVOA(){
	$("#mainpage").hide();
	$("#pagevoa").show();
}

/* Korea Herald Page로 이동 */
function moveKRHerald(){
	$("#mainpage").hide();
	$("#pagekrherald").show();
}

/* Korea Times Page로 이동 */
function moveKRTimes(){
	$("#mainpage").hide();
	$("#pagekrtimes").show();
}

/* Los Angeles Times Page로 이동 */
function moveLATimes(){
	$("#mainpage").hide();
	$("#pagelatimes").show();
}

/* NPR News Page로 이동 */
function moveNPRNews(){
	$("#mainpage").hide();
	$("#pagenprnews").show();
}

/* Nature News Page로 이동 */
function moveNatureNews(){
	$("#mainpage").hide();
	$("#pagenaturenews").show();
}

/* Home으로 이동 */
function moveHome(){
	$("#mainpage").show();
	$("#set").hide();
	$("#pagebbc").hide();
	$("#pageabc").hide();
	$("#pagevoa").hide();
	$("#pagekrherald").hide();
	$("#pagekrtimes").hide();
	$("#pagelatimes").hide();
	$("#pagenprnews").hide();
	$("#pagenaturenews").hide();
	$("#pagedic").hide();
}

function movePanel(){
	$("#set").show();
	$("#mainpage").hide();
}

/* 단어장 보기 */
function dic(){
	$("#pagedic").show();
	$("#pagebbc").hide();
	$("#pageabc").hide();
	$("#pagevoa").hide();
	$("#pagekrherald").hide();
	//
	$("#pagekrtimes").hide();
	$("#pagelatimes").hide();
	$("#pagenprnews").hide();
	$("#pagenaturenews").hide();
	//
	$("#set").hide();
}

/* TTS */
function ttsTest(tt){

	var msg = new SpeechSynthesisUtterance();
	msg.lang = 'en-US';
 
	msg.text = tt
	speechSynthesis.speak(msg);
 }

/* 단어 검색 */
function searchWord1(ww){ 

	var word = ww;
	var content1 = '';
	console.log("검색 단어 : "+word);

	$.ajax({

		url: "http://yeonjin2joy.dothome.co.kr/dic.php?callback=",
		type: "GET",
		data: { word : word },
		dataType: "jsonp",
		success: function(data){
			
			console.log("Daum 사전 테스트 성공");
			content1 += "<div><h2>"+word+" <a onclick=ttsTest('"+word+"')>";
			content1 += "&nbsp; <img width='30' height='30' src='img/icon/tts.png'></a> </h2>";
			content1 += "<font size='4'>"+unescape(data)+"</font>";
			content1 += "<a href='#close' class='close'>X</a></div>";
			$("#mean").html(content1);
			console.log("단어 검색 성공");
		}
	});
}

$(window).load(function(){

	$("body").css("display", "none");
	$("body").fadeIn(500);

	
	/* Indexed DB를 지원하는지 확인 */
	if(!("indexedDB" in window)) {
		alert("IndexedDB support required for this demo!");
		return;
	}

	/* Opening a database */ 
	var openRequest = window.indexedDB.open("dic",1);

	/* 에러 시 처리 */ 
    openRequest.onerror = function(e) {
		
        console.log("Error opening db");
        console.dir(e);
    };
	
	/* 첫 실행 또는 Database 업그레이드 시 먼저 실행 */ 
    openRequest.onupgradeneeded = function(e) {

        var thisDb = e.target.result;

		var objectStore;

        /* Create object store */
        if(!thisDb.objectStoreNames.contains("dictionary")) {
			
            console.log("I need to make the dictionary objectstore");

			// 값을 구할 때 색인이 되는 키를 하나 지정 
            objectStore = thisDb.createObjectStore("dictionary", { keyPath: "no", autoIncrement: true });

			// 검색을 효율적으로 하기 위한 인덱스를 지정 
            objectStore.createIndex("wordlc", "wordlc", { unique: false });
		}

    };


    /* 성공 시 처리 (맨 처음 화면에 보이게 됨) */
    openRequest.onsuccess = function(e) {
		
		console.log("success");

        db = e.target.result;

		$("#mainpage").show();
		$("#set").hide();
		$("#pagebbc").hide();
		$("#pageabc").hide();
		$("#pagedic").hide();
		$("#pagevoa").hide();
		$("#pagekrherald").hide();
		$("#pagekrtimes").hide();
		$("#pagelatimes").hide();
		$("#pagenaturenews").hide();
		$("#pagenprnews").hide();
	};

	
	/* 단어장 보기 */
	$("#displayWord").on("click",function() {
		 displayNotes();
	});
	

	/* BBC News 불러오기 */
	function displayBBC_Title(option){  

		var news = newsOption(option); 

		var title ='';
		var description = '';
		var pubDate = '';
		var re = new Array();
		var descnt;
		var content = " ";

		$.ajax({

			url: "http://yeonjin2joy.dothome.co.kr/BBC_Feed.php?callback=",
			type: "GET",
			data: { news : news },
			dataType: "jsonp",
			success: function(data){

			title = data[0];
			description = data[1];
			pubDate = data[2];
					
					
			for(var i=0; i<10; i++){

				desLink = description[i].split(" ");
				descnt = desLink.length;
				re[i] = ''; 

				for(j=0; j<descnt; j++){
					re[i] = 
						re[i] + 
						"<a style='text-decoration:none' href='#mean' onclick=save1('"+desLink[j]+"')>"
						+desLink[j]+
						"</a> ";
				}
						
				content += "<div class='card2'>";
				content += "<table width='100%' cellpadding='20' bgcolor='#FFFFE4'>";
				content += "<tr><td><strong>";
				content += "<font face='Georgia' size='6'>" +title[i]+ "</font>";
				content += "</strong></td> </tr>";
				content += "<tr> <td> <font size='5' face='Sans-serif'>" +re[i]+ "</font></td> </tr>";
				content += "<tr> <td>";
				content += "<font size='5' color='#662500' face='Sans-serif'>" +pubDate[i]+ "</font>";
				content += "</td> </tr> </table></div>";
			}

			$("#bbc_title").html(content);
					
			}
		});
	}
	
	/* ABC News 불러오기 */
	function displayABC_Title(option){  
		
		$("#pagebbc").hide();

		var news = newsOption(option); 

		var title ='';
		var description = '';
		var pubDate = '';
		var re = new Array();
		var descnt;
		var content = " ";

		$.ajax({
			
			url: "http://yeonjin2joy.dothome.co.kr/ABC_Feed.php?callback=",
			type: "GET",
			data: { news : news },
			dataType: "jsonp",
			success: function(data){

			title = data[0];
			description = data[1];
			pubDate = data[2];
					
					
			for(var i=0; i<10; i++){

				desLink = description[i].split(" ");
				descnt = desLink.length;
				re[i] = '';
						
				for(j=0; j<descnt; j++){
					re[i] = 
						re[i] + 
						"<a style='text-decoration:none' href='#mean' onclick=save1('"+desLink[j]+"')>"
						+desLink[j]+
						"</a> ";
				}
						
				content += "<div class='card2'>";
				content += "<table width='100%' cellpadding='20' bgcolor='#FFFFE4'>";
				content += "<tr><td><strong>";
				content += "<font face='Georgia' size='6'>" +title[i]+ "</font>";
				content += "</strong></td> </tr>";
				content += "<tr> <td> <font size='5' face='Sans-serif'>" +re[i]+ "</font></td> </tr>";
				content += "<tr> <td>";
				content += "<font size='5' color='#662500' face='Sans-serif'>" +pubDate[i]+ "</font>";
				content += "</td> </tr> </table></div>";
			}

			$("#abc_title").html(content);
					
			}
		});
	}

	/* VOA News 불러오기 */
	function displayVOA_Title(option){  

		var news = newsOption(option); 

		var title ='';
		var description = '';
		var pubDate = '';
		var re = new Array();
		var descnt;
		var content = " ";

		$.ajax({
				
			url: "http://yeonjin2joy.dothome.co.kr/VOA_Feed.php?callback=",
			type: "GET",
			data: { news : news },
			dataType: "jsonp",
			success: function(data){

			title = data[0];
			description = data[1];
			pubDate = data[2];
					
					
			for(var i=0; i<10; i++){

				desLink = description[i].split(" ");
				descnt = desLink.length;
				re[i] = '';
						
				for(j=0; j<descnt; j++){
					re[i] = re[i] + "<a style='text-decoration:none' href='#mean'  id='saveButton' onclick=save1('"+desLink[j]+"')>"+desLink[j]+"</a> ";
				}
						
				content += "<div class='card2'>";
				content += "<table width='100%' cellpadding='20' bgcolor='#FFFFE4'>";
				content += "<tr><td><strong>";
				content += "<font face='Georgia' size='6'>" +title[i]+ "</font>";
				content += "</strong></td> </tr>";
				content += "<tr> <td> <font size='5' face='Sans-serif'>" +re[i]+ "</font></td> </tr>";
				content += "<tr> <td>";
				content += "<font size='5' color='#662500' face='Sans-serif'>" +pubDate[i]+ "</font>";
				content += "</td> </tr> </table></div>";
			}

			$("#voa_title").html(content);
					
			}
		});
	}
	
	/* The Korea Herald News 불러오기 */
	function displayKRHERALD_Title(option){  

		var news = newsOption(option); 

		var title ='';
		var description = '';
		var pubDate = '';
		var re = new Array();
		var descnt;
		var content = " ";

		$.ajax({
				
			url: "http://yeonjin2joy.dothome.co.kr/KRHERALD_Feed.php?callback=",
			type: "GET",
			data: { news : news },
			dataType: "jsonp",
			success: function(data){

			title = data[0];
			description = data[1];
			pubDate = data[2];
					
					
			for(var i=0; i<10; i++){

				desLink = description[i].split(" ");
				descnt = desLink.length;
				re[i] = '';
						
				for(j=0; j<descnt; j++){
					re[i] = re[i] + "<a style='text-decoration:none' href='#mean' id='saveButton' onclick=save1('"+desLink[j]+"')>"+desLink[j]+"</a> ";
				}
						
				content += "<div class='card2'>";
				content += "<table width='100%' cellpadding='20' bgcolor='#FFFFE4'>";
				content += "<tr><td><strong>";
				content += "<font face='Georgia' size='6'>" +title[i]+ "</font>";
				content += "</strong></td> </tr>";
				content += "<tr> <td> <font size='5' face='Sans-serif'>" +re[i]+ "</font></td> </tr>";
				content += "<tr> <td>";
				content += "<font size='5' color='#662500' face='Sans-serif'>" +pubDate[i]+ "</font>";
				content += "</td> </tr> </table></div>";
			}

			$("#krherald_title").html(content);
					
			}
		});
	}

	

	/* The Korea Times News 불러오기 */
	function displayKRTimes_Title(option){  

		var news = newsOption(option); 

		var title ='';
		var description = '';
		var pubDate = '';
		var re = new Array();
		var descnt;
		var content = " ";

		$.ajax({
				
			url: "http://yeonjin2joy.dothome.co.kr/KRTimes_Feed.php?callback=",
			type: "GET",
			data: { news : news },
			dataType: "jsonp",
			success: function(data){

			title = data[0];
			description = data[1];
			pubDate = data[2];
					
					
			for(var i=0; i<10; i++){

				desLink = description[i].split(" ");
				descnt = desLink.length;
				re[i] = '';
						
				for(j=0; j<descnt; j++){
					re[i] = re[i] + "<a style='text-decoration:none' href='#mean' id='saveButton' onclick=save1('"+desLink[j]+"')>"+desLink[j]+"</a> ";
				}
						
				content += "<div class='card2'>";
				content += "<table width='100%' cellpadding='20' bgcolor='#FFFFE4'>";
				content += "<tr><td><strong>";
				content += "<font face='Georgia' size='6'>" +title[i]+ "</font>";
				content += "</strong></td> </tr>";
				content += "<tr> <td> <font size='5' face='Sans-serif'>" +re[i]+ "</font></td> </tr>";
				content += "<tr> <td>";
				content += "<font size='5' color='#662500' face='Sans-serif'>" +pubDate[i]+ "</font>";
				content += "</td> </tr> </table></div>";
			}

			$("#krtimes_title").html(content);
					
			}
		});
	}




	function displayLATimes_Title(option){  

		var news = newsOption(option); 

		var title ='';
		var description = '';
		var pubDate = '';
		var re = new Array();
		var descnt;
		var content = " ";

		$.ajax({

			url: "http://yeonjin2joy.dothome.co.kr/LATimes_Feed.php?callback=",
			type: "GET",
			data: { news : news },
			dataType: "jsonp",
			success: function(data){

			title = data[0];
			description = data[1];
			pubDate = data[2];
					
					
			for(var i=0; i<10; i++){

				desLink = description[i].split(" ");
				descnt = desLink.length;
				re[i] = ''; 

				for(j=0; j<descnt; j++){
					re[i] = 
						re[i] + 
						"<a style='text-decoration:none' href='#mean' onclick=save1('"+desLink[j]+"')>"
						+desLink[j]+
						"</a> ";
				}
						
				content += "<div class='card2'>";
				content += "<table width='100%' cellpadding='20' bgcolor='#FFFFE4'>";
				content += "<tr><td><strong>";
				content += "<font face='Georgia' size='6'>" +title[i]+ "</font>";
				content += "</strong></td> </tr>";
				content += "<tr> <td> <font size='5' face='Sans-serif'>" +re[i]+ "</font></td> </tr>";
				content += "<tr> <td>";
				content += "<font size='5' color='#662500' face='Sans-serif'>" +pubDate[i]+ "</font>";
				content += "</td> </tr> </table></div>";
			}

			$("#latimes_title").html(content);
					
			}
		});
	}


	function displayNPRNews_Title(option){  

		var news = newsOption(option); 

		var title ='';
		var description = '';
		var pubDate = '';
		var re = new Array();
		var descnt;
		var content = " ";

		$.ajax({

			url: "http://yeonjin2joy.dothome.co.kr/NPR_Feed.php?callback=",
			type: "GET",
			data: { news : news },
			dataType: "jsonp",
			success: function(data){

			title = data[0];
			description = data[1];
			pubDate = data[2];
					
					
			for(var i=0; i<10; i++){

				desLink = description[i].split(" ");
				descnt = desLink.length;
				re[i] = ''; 

				for(j=0; j<descnt; j++){
					re[i] = 
						re[i] + 
						"<a style='text-decoration:none' href='#mean' onclick=save1('"+desLink[j]+"')>"
						+desLink[j]+
						"</a> ";
				}
						
				content += "<div class='card2'>";
				content += "<table width='100%' cellpadding='20' bgcolor='#FFFFE4'>";
				content += "<tr><td><strong>";
				content += "<font face='Georgia' size='6'>" +title[i]+ "</font>";
				content += "</strong></td> </tr>";
				content += "<tr> <td> <font size='5' face='Sans-serif'>" +re[i]+ "</font></td> </tr>";
				content += "<tr> <td>";
				content += "<font size='5' color='#662500' face='Sans-serif'>" +pubDate[i]+ "</font>";
				content += "</td> </tr> </table></div>";
			}

			$("#nprnews_title").html(content);
					
			}
		});
	}



	function displayNatureNews_Title(option){  

		var news = newsOption(option); 

		var title ='';
		var description = '';
		var pubDate = '';
		var re = new Array();
		var descnt;
		var content = " ";

		$.ajax({

			url: "http://yeonjin2joy.dothome.co.kr/Nature_Feed.php?callback=",
			type: "GET",
			data: { news : news },
			dataType: "jsonp",
			success: function(data){

			title = data[0];
			description = data[1];
			pubDate = data[2];
					
					
			for(var i=0; i<10; i++){

				desLink = description[i].split(" ");
				descnt = desLink.length;
				re[i] = ''; 

				for(j=0; j<descnt; j++){
					re[i] = 
						re[i] + 
						"<a style='text-decoration:none' href='#mean' onclick=save1('"+desLink[j]+"')>"
						+desLink[j]+
						"</a> ";
				}
						
				content += "<div class='card2'>";
				content += "<table width='100%' cellpadding='20' bgcolor='#FFFFE4'>";
				content += "<tr><td><strong>";
				content += "<font face='Georgia' size='6'>" +title[i]+ "</font>";
				content += "</strong></td> </tr>";
				content += "<tr> <td> <font size='5' face='Sans-serif'>" +re[i]+ "</font></td> </tr>";
				content += "<tr> <td>";
				content += "<font size='5' color='#662500' face='Sans-serif'>" +pubDate[i]+ "</font>";
				content += "</td> </tr> </table></div>";
			}

			$("#naturenews_title").html(content);
					
			}
		});
	}



	/* News ID에 따른 News 구분하기 */
	function newsOption(option){

		var option;
		var getResult;

		if(option=="bbc_button"){
			getResult = document.getElementById("bbc_button").value;
		}
		else if(option=="abc_button"){
			getResult = document.getElementById("abc_button").value;
		}
		else if(option=="voa_button"){
			getResult = document.getElementById("voa_button").value;
		}
		else if(option=="krherald_button"){
			getResult = document.getElementById("krherald_button").value;
		}
		else if(option=="krtimes_button"){
			getResult = document.getElementById("krtimes_button").value;
		}
		else if(option=="latimes_button"){
			getResult = document.getElementById("latimes_button").value;
		}
		else if(option=="nprnews_button"){
			getResult = document.getElementById("nprnews_button").value;
		}
		else if(option=="naturenews_button"){
			getResult = document.getElementById("naturenews_button").value;
		}

	}
	
	/* BBC News를 선택했을 때 동작 */
	$("#bbc_button").on("click", function() { 
		
		$("body").css("display", "none");
		$("body").fadeIn(1000);

		displayNotes(); // 단어장 
		displayBBC_Title(bbc_button);
	});

	/* ABC News를 선택했을 때 동작 */
	$("#abc_button").on("click", function() { 
		
		$("body").css("display", "none");
		$("body").fadeIn(1000);

		displayNotes();
		displayABC_Title(abc_button);
	});

	/* VOA News를 선택했을 때 동작 */
	$("#voa_button").on("click", function() { 
		
		$("body").css("display", "none");
		$("body").fadeIn(1000);

		displayNotes();
		displayVOA_Title(voa_button);
	});

	/* The Korea Herald News를 선택했을 때 동작 */
	$("#krherald_button").on("click", function() { 
		
		$("body").css("display", "none");
		$("body").fadeIn(1000);
		displayNotes();
		displayKRHERALD_Title(krherald_button);
	});

	/* The Korea Times News를 선택했을 때 동작 */
	$("#krtimes_button").on("click", function() { 
		
		$("body").css("display", "none");
		$("body").fadeIn(1000);
		displayNotes();
		displayKRTimes_Title(krtimes_button);
	});

	/* LA Times 를 선택했을 때 동작 */
	$("#latimes_button").on("click", function() { 
		
		$("body").css("display", "none");
		$("body").fadeIn(1000);
		displayNotes();
		displayLATimes_Title(latimes_button);
	});

	/* NPR News 를 선택했을 때 동작 */
	$("#nprnews_button").on("click", function() { 
		
		$("body").css("display", "none");
		$("body").fadeIn(1000);
		displayNotes();
		displayNPRNews_Title(nprnews_button);
	});

	/* Nature News 를 선택했을 때 동작 */
	$("#naturenews_button").on("click", function() { 
		
		$("body").css("display", "none");
		$("body").fadeIn(1000);
		displayNotes();
		displayNatureNews_Title(naturenews_button);
	});
	

	
	/* 단어장에서 단어를 삭제했을 때의 동작 */
	$("#noteList").on("click", "a.delete", function(e) {

        var thisId = $(this).parent().parent().data("key");
		
		// "readwrite" 모드로 transaction을 생성 
		var t = db.transaction(["dictionary"], "readwrite");

		var request = t.objectStore("dictionary").delete(thisId);

		t.oncomplete = function(event) {

			displayNotes();
	
		};
        	return false;
    });

	
});

/* 단어장에 저장된 단어 불러오기 */
function displayNotes(){

		// "readonly" 모드로 transaction을 생성 
		var transaction = db.transaction(["dictionary"], "readonly");
		
		
		var content = "<div class='card2'> <table width='100%'>";
					  

		transaction.oncomplete = function(event) {

				// [단어 리스트] 영역에 content를 추가 
            	$("#noteList").html(content);

        };

		// Object Store인 board_info를 참조 
        var objectStore = transaction.objectStore("dictionary");
		
		// 내림 차순으로 정렬, 최신 글이 위로 올라감 
		objectStore.openCursor(IDBKeyRange.lowerBound(0),'prev').onsuccess = function(event){
			
			var cursor = event.target.result; 
			if(cursor){
				
				content += "<tr data-key=\""+cursor.key+"\">";
				var str = cursor.value.word;
				//var w = str.substr(0,1);
				//var w2 = w.toUpperCase();
				content += "<td width='70%' align='center'> <b>";
				content += "<a style='text-decoration:none' href='#mean' onclick=searchWord1('"+cursor.value.word+"')>";
				content += "<font size='5' face='Sans-serif'>" +cursor.value.word+ "</font>";
				content += "</a> </b>";
				content += "</td>";  
				content += "<td width='20%' align='left'>";
				content += "<a style='text-decoration:none' href='#' class='delete'>";
				content += "<img width='20' height='20' src='img/icon/delete2.jpg'> </a> </td>";
				content +="</tr>";  
						
						cursor.continue();	
			}		
			else{
				content += "</table> </div>";
			}
			
		};
}


/* 단어 저장하기 */
function save1(ww){	

        var word = ww;
        var key = $("#key").val();
        var wordlc = word.toLowerCase();
		
        var t = db.transaction(["dictionary"], "readwrite");
		
        if(key === "") {
            	t.objectStore("dictionary")
                        	    .add({word:word,updated:new Date(),wordlc:wordlc});
        } else {
            	t.objectStore("dictionary")
                            	.put({word:word,updated:new Date(),no:Number(key),wordlc:wordlc});
        }
	
        t.oncomplete = function(event) {
				displayNotes();
				searchWord1(ww);
        };

        return false;

}
















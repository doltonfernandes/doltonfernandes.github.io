function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return JSON.parse(xmlHttp.responseText);
}

function make_data() {
	var arr = httpGet('https://doltonfernandes.github.io/churchsingingfile');
	for(var i of arr) i.views = i.views.split(" ")[0]
	for(var i of arr) if(i.views[i.views.length - 1] == 'K') {
		i.views = i.views.replace('K','');
		i.views *= 1000;
	} else i.views = parseInt(i.views, 10);
	arr.sort(function(a, b) {
		return 2*(a.views < b.views)-1;
	});
	var strr = "";
	var cnt = 0;
	for(var i of arr) {
		cnt ++ ;
		strr += '<tr><td data-label="thumbnail"><img src="' + i.thumbnail + '" class="image1" /></td><td data-label="rank">' + cnt + '</td><td data-label="name">' + i.title + '</td><td data-label="views">' + i.views + '</td><td data-label="link"><a href="' + i.link + '">Click Here</a></td></tr>';
	}
    document.getElementById('tableheader').style.visibility = 'visible';
    document.getElementById('tbd').innerHTML += strr;
    document.getElementById('loader').innerHTML = "";
}

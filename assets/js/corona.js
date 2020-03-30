var obj = [];
var country = 0;
var neww = 0;
var active = 0;
var critical = 0;
var recovered = 0;
var total = 1;

function make_table() {
	document.getElementById("tbd").innerHTML = "";
	var cnt = 0;
	for(var key in obj)
    {
    	cnt ++ ;
    	var tmp_str = '<tr><td>' + cnt +'</td><td>' + obj[key]['country'] + '</td>';
    	for(var key2 in obj[key]['cases'])
    	{
	    	tmp_str += '<td>' + (obj[key]['cases'][key2]==null? 0:obj[key]['cases'][key2]) + '</td>';
    	}
    	tmp_str += '</tr>';
    	document.getElementById('tbd').innerHTML += tmp_str;
    }
}

function sort_country() {
	obj.sort(function(a, b) {
		return (a["country"] > b["country"])^country;
	})
	document.getElementById('country').textContent = 'COUNTRY' + (country ? '↓':'↑');
	country = !country;
	make_table();
}


function sort_new() {
	obj.sort(function(a, b) {
		return (a["cases"]["new"] > b["cases"]["new"])^neww;
	})
	document.getElementById('new').textContent = 'NEW' + (neww ? '↓':'↑');
	neww = !neww;
	make_table();
}

function sort_active() {
	obj.sort(function(a, b) {
		return (a["cases"]["active"] > b["cases"]["active"])^active;
	})
	document.getElementById('active').textContent = 'ACTIVE' + (active ? '↓':'↑');
	active = !active;
	make_table();
}

function sort_critical() {
	obj.sort(function(a, b) {
		return (a["cases"]["critical"] > b["cases"]["critical"])^critical;
	})
	document.getElementById('critical').textContent = 'CRITICAL' + (critical ? '↓':'↑');
	critical = !critical;
	make_table();
}

function sort_recovered() {
	obj.sort(function(a, b) {
		return (a["cases"]["recovered"] > b["cases"]["recovered"])^recovered;
	})
	document.getElementById('recovered').textContent = 'RECOVERED' + (recovered ? '↓':'↑');
	recovered = !recovered;
	make_table();
}

function sort_total() {
	obj.sort(function(a, b) {
		return (a["cases"]["total"] > b["cases"]["total"])^total;
	})
	document.getElementById('total').textContent = 'TOTAL' + (total ? '↓':'↑');
	total = !total;
	make_table();
}

function make_data() {

	var data = null;

	var xhr = new XMLHttpRequest();
	xhr.withCredentials = true;

	xhr.addEventListener("readystatechange", function () {
		if (this.readyState === this.DONE) {
		    var tmp = JSON.parse(this.responseText)["response"];
			for (var key in tmp) {
			    obj.push(tmp[key]);
			}
    		document.getElementById('thr').innerHTML += '<th><h1>Sr No.</h1></th><th onclick="sort_country()"><h1 id="country">COUNTRY↓</h1></th>';
		    for(var key in obj[0]["cases"])
		    {
	    		document.getElementById('thr').innerHTML += '<th onclick="sort_' + key +  '()"><h1 id="' + key + '">' + key.toUpperCase() + '↓</h1></th>';
		    }
		    sort_total();
		    make_table();
		}
	});

	xhr.open("GET", "https://covid-193.p.rapidapi.com/statistics");
	xhr.setRequestHeader("x-rapidapi-host", "covid-193.p.rapidapi.com");
	xhr.setRequestHeader("x-rapidapi-key", "604a6ae58cmsh1d0fd5d11558425p1ef0f9jsn66c6876e2c56");

	xhr.send(data);
}

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
		return 2*((a["country"] > b["country"])^country)-1;
	});
	document.getElementById('country').textContent = 'COUNTRY' + (country ? '↓':'↑');
	country = !country;
	make_table();
}


function sort_new() {
	obj.sort(function(a, b) {
		return 2*((a["cases"]["new"] > b["cases"]["new"])^neww)-1;
	});
	document.getElementById('new').textContent = 'NEW' + (neww ? '↓':'↑');
	neww = !neww;
	make_table();
}

function sort_active() {
	obj.sort(function(a, b) {
		return 2*((a["cases"]["active"] > b["cases"]["active"])^active)-1;
	});
	document.getElementById('active').textContent = 'ACTIVE' + (active ? '↓':'↑');
	active = !active;
	make_table();
}

function sort_critical() {
	obj.sort(function(a, b) {
		return 2*((a["cases"]["critical"] > b["cases"]["critical"])^critical)-1;
	});
	document.getElementById('critical').textContent = 'CRITICAL' + (critical ? '↓':'↑');
	critical = !critical;
	make_table();
}

function sort_recovered() {
	obj.sort(function(a, b) {
		return 2*((a["cases"]["recovered"] > b["cases"]["recovered"])^recovered)-1;
	});
	document.getElementById('recovered').textContent = 'RECOVERED' + (recovered ? '↓':'↑');
	recovered = !recovered;
	make_table();
}

function sort_total() {
	obj.sort(function(a, b) {
		return 2*((a["cases"]["total"] > b["cases"]["total"])^total)-1;
	});
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
		    document.getElementById('loader').innerHTML = '';
		    document.getElementById('button_cont').innerHTML = '<a class="example_a" onclick="india()" target="_blank" rel="nofollow noopener">India Stats</a>';
		    make_table();
		}
	});

	xhr.open("GET", "https://covid-193.p.rapidapi.com/statistics");
	xhr.setRequestHeader("x-rapidapi-host", "covid-193.p.rapidapi.com");
	xhr.setRequestHeader("x-rapidapi-key", "604a6ae58cmsh1d0fd5d11558425p1ef0f9jsn66c6876e2c56");

	xhr.send(data);
}

function india() {
    document.getElementById('button_cont').innerHTML = '';
	document.getElementById("thr").innerHTML = "";
	document.getElementById("tbd").innerHTML = "";
    document.getElementById('loader').innerHTML = '<div class="loader"></div>';
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "https://api.covid19india.org/state_district_wise.json", false );
    xmlHttp.send( null );
	var tmp = JSON.parse(xmlHttp.responseText);
	obj = [];
	for(var key in tmp)
	{
		if(key == "Unknown")
		{
			continue;
		}
		for(var key2 in tmp[key]["districtData"])
		{
			if(key2 == "Unknown" && key =="Goa")
			{
				obj.push({District:"South Goa",State:key,Confirmed:tmp[key]["districtData"][key2]["confirmed"]});
				continue;
			}
			if(key2 == "Unknown")
			{
				continue;
			}
			obj.push({District:key2,State:key,Confirmed:tmp[key]["districtData"][key2]["confirmed"]});
		}
	}
	document.getElementById('thr').innerHTML += '<th><h1>Sr No.</h1></th>';
	document.getElementById('thr').innerHTML += '<th onclick="sort_District()"><h1 id="District">District↓</h1></th>';
	document.getElementById('thr').innerHTML += '<th onclick="sort_State()"><h1 id="State">State↓</h1></th>';
	document.getElementById('thr').innerHTML += '<th onclick="sort_Confirmed()"><h1 id="Confirmed">Confirmed↓</h1></th>';
	sort_Confirmed();
    document.getElementById('loader').innerHTML = '';
	make_table2();
}

function make_table2() {
	document.getElementById("tbd").innerHTML = "";
	var cnt = 0;
	for(var key in obj)
    {
    	cnt ++ ;
    	var tmp_str = '<tr><td>' + cnt +'</td>';
    	for(var key2 in obj[key])
    	{
	    	tmp_str += '<td>' + (obj[key][key2]==null? 0:obj[key][key2]) + '</td>';
    	}
    	tmp_str += '</tr>';
    	document.getElementById('tbd').innerHTML += tmp_str;
    }
}

var State = 0;
var District = 0;
var Confirmed = 1;

function sort_State() {
	obj.sort(function(a, b) {
		return 2*((a["State"] > b["State"])^State)-1;
	});
	document.getElementById('State').textContent = 'State' + (State ? '↓':'↑');
	State = !State;
	make_table2();
}

function sort_District() {
	obj.sort(function(a, b) {
		return 2*((a["District"] > b["District"])^District)-1;
	});
	document.getElementById('District').textContent = 'District' + (District ? '↓':'↑');
	District = !District;
	make_table2();
}

function sort_Confirmed() {
	obj.sort(function(a, b) {
		return 2*((a["Confirmed"] > b["Confirmed"])^Confirmed)-1;
	});
	document.getElementById('Confirmed').textContent = 'Confirmed' + (Confirmed ? '↓':'↑');
	Confirmed = !Confirmed;
	make_table2();
}
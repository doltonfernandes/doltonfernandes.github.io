var obj = [];
var country = 0;
var neww = 0;
var deaths = 0;
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
    	var tmp_str = '<tr><td>' + cnt +'</td><td>' + obj[key]['country'] + '</td><td>' + obj[key]['deaths']['total'] + '</td>';
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

function sort_deaths() {
	obj.sort(function(a, b) {
		return 2*((parseInt(a["deaths"]["total"], 10) > parseInt(b["deaths"]["total"], 10))^deaths)-1;
	});
	document.getElementById('deaths').textContent = 'DEATHS' + (deaths ? '↓':'↑');
	deaths = !deaths;
	make_table();
}

function sort_new() {
	obj.sort(function(a, b) {
		return 2*((parseInt(a["cases"]["new"], 10) > parseInt(b["cases"]["new"], 10))^neww)-1;
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
				if(tmp[key]["cases"]["new"] == null)
				{
					tmp[key]["cases"]["new"] = "+0";
				}
			    obj.push(tmp[key]);
			}
    		document.getElementById('thr').innerHTML += '<th><h1>Sr No.</h1></th><th onclick="sort_country()"><h1 id="country">COUNTRY↓</h1></th><th onclick="sort_deaths()"><h1 id="deaths">DEATHS↓</h1></th>';
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
	document.getElementById("thr").innerHTML = "";
	document.getElementById("tbd").innerHTML = "";
	document.getElementById('button_cont').innerHTML = '';
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
	document.getElementById('thr').innerHTML += '<th onclick="sort_District()"><h1 id="District">DISTRICT↓</h1></th>';
	document.getElementById('thr').innerHTML += '<th onclick="sort_State()"><h1 id="State">STATE↓</h1></th>';
	document.getElementById('thr').innerHTML += '<th onclick="sort_Confirmed()"><h1 id="Confirmed">CONFIRMED↓</h1></th>';
	sort_Confirmed();
    document.getElementById('loader').innerHTML = '';
	document.getElementById('button_cont').innerHTML = '<a class="example_a" onclick="state()" target="_blank" rel="nofollow noopener">Statewise Stats</a>';
	make_table2();
}

var State = 0;
var District = 0;
var Confirmed = 1;

function state() {
    document.getElementById('button_cont').innerHTML = '';
	document.getElementById("thr").innerHTML = "";
	document.getElementById("tbd").innerHTML = "";
    document.getElementById('loader').innerHTML = '<div class="loader"></div>';
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "https://api.covid19india.org/data.json", false );
    xmlHttp.send( null );
	var tmp = JSON.parse(xmlHttp.responseText)["statewise"];
	obj = [];
	for(var key in tmp)
	{
		var lol = tmp[key];
		delete lol["delta"];
		delete lol["lastupdatedtime"];
		delete lol["deltaconfirmed"];
		delete lol["deltadeaths"];
		delete lol["deltarecovered"];
		delete lol["statecode"];
		var statelol = lol["state"];
		delete lol["state"];
		var lol = {lol,"state":statelol};
		obj.push(lol);
	}
    document.getElementById('loader').innerHTML = '';
	document.getElementById('thr').innerHTML += '<th><h1>Sr No.</h1></th>';
	document.getElementById('thr').innerHTML += '<th onclick="sort_State1()"><h1 id="State">STATE↓</h1></th>';
	for(var key in obj[0]["lol"])
	{
		document.getElementById('thr').innerHTML += '<th onclick="sort_' + key + '1()"><h1 id="' + key + '">' + key.toUpperCase() + '↓</h1></th>';
	}
	State = 0
	active = 0
	Confirmed = 0
	deaths = 0
	recovered = 0
	make_table3();
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

function make_table3() {
	document.getElementById("tbd").innerHTML = "";
	var cnt = 0;
	for(var key in obj)
    {
    	cnt ++ ;
    	var tmp_str = '<tr><td>' + cnt +'</td><td>' + obj[key]["state"] + '</td>';
    	for(var key2 in obj[key]["lol"])
    	{
	    	tmp_str += '<td>' + (obj[key]["lol"][key2]==null? 0:obj[key]["lol"][key2]) + '</td>';
    	}
    	tmp_str += '</tr>';
    	document.getElementById('tbd').innerHTML += tmp_str;
    }
}

function sort_State() {
	obj.sort(function(a, b) {
		return 2*((a["State"] > b["State"])^State)-1;
	});
	document.getElementById('State').textContent = 'STATE' + (State ? '↓':'↑');
	State = !State;
	make_table2();
}

function sort_District() {
	obj.sort(function(a, b) {
		return 2*((a["District"] > b["District"])^District)-1;
	});
	document.getElementById('District').textContent = 'DISTRICT' + (District ? '↓':'↑');
	District = !District;
	make_table2();
}

function sort_Confirmed() {
	obj.sort(function(a, b) {
		return 2*((a["Confirmed"] > b["Confirmed"])^Confirmed)-1;
	});
	document.getElementById('Confirmed').textContent = 'CONFIRMED' + (Confirmed ? '↓':'↑');
	Confirmed = !Confirmed;
	make_table2();
}

function sort_State1() {
	obj.sort(function(a, b) {
		return 2*((a["state"] > b["state"])^State)-1;
	});
	document.getElementById('State').textContent = 'STATE' + (State ? '↓':'↑');
	State = !State;
	make_table3();
}

function sort_deaths1() {
	obj.sort(function(a, b) {
		return 2*((parseInt(a["lol"]["deaths"],10) > parseInt(b["lol"]["deaths"],10))^deaths)-1;
	});
	document.getElementById('deaths').textContent = 'DEATHS' + (deaths ? '↓':'↑');
	deaths = !deaths;
	make_table3();
}

function sort_active1() {
	obj.sort(function(a, b) {
		return 2*((parseInt(a["lol"]["active"],10) > parseInt(b["lol"]["active"],10))^active)-1;
	});
	document.getElementById('active').textContent = 'ACTIVE' + (active ? '↓':'↑');
	active = !active;
	make_table3();
}

function sort_recovered1() {
	obj.sort(function(a, b) {
		return 2*((parseInt(a["lol"]["recovered"],10) > parseInt(b["lol"]["recovered"],10))^recovered)-1;
	});
	document.getElementById('recovered').textContent = 'RECOVERED' + (recovered ? '↓':'↑');
	recovered = !recovered;
	make_table3();
}

function sort_confirmed1() {
	obj.sort(function(a, b) {
		return 2*((parseInt(a["lol"]["confirmed"],10) > parseInt(b["lol"]["confirmed"],10))^Confirmed)-1;
	});
	document.getElementById('confirmed').textContent = 'CONFIRMED' + (Confirmed ? '↓':'↑');
	Confirmed = !Confirmed;
	make_table3();
}
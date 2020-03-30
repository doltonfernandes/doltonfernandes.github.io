var i = 0 , j = 0;
var txt1 = 'Hi! Im Dolton Fernandes';
var txt2 = 'Welcome To My Personal Website';
function typeWriter() {
	if (i < txt1.length) {
		document.getElementById("heading1").innerHTML += txt1.charAt(i);
		i++;
		setTimeout(typeWriter, 100);
	}
	else
	{
		if (j < txt2.length) {
			document.getElementById("heading2").innerHTML += txt2.charAt(j);
			j++;
			setTimeout(typeWriter, 100);
		}
	}
}
function mail() {
	console.log(document.getElementById('name').value);
	console.log(document.getElementById('email').value);
	console.log(document.getElementById('message').value);
	alert("Mail Sent");
	return false
}
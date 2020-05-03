let dataset, masterData, svg
let salesScale, categoryColorScale
let simulation, nodes
let categoryLegend, salaryLegend
var lastIndex, activeIndex = 0,prevScroll = 'up'
var platform = new Set()
var genre = new Set()
var platformRank = new Map()
var platformMax = 0
var genres, maxi
var categoriesXY = {}
var automation = []

var rangeSlider = document.getElementById("rs-range-line");
var rangeBullet = document.getElementById("rs-bullet");
var title = document.getElementById("tit");
var automationButton = document.getElementById("automation");
var automationButtonText = document.getElementById("automationText");
var genrePlatformButton = document.getElementById("button2");

rangeSlider.addEventListener("input", showSliderValue, false);
automationButton.addEventListener("click", automate, false);

//gets value from slider
function showSliderValue() {
	activeIndex = 0
	simulation.stop()
	rangeBullet.innerHTML = rangeSlider.value;
	rangeBullet.innerHTML2 = rangeSlider.value;
	var bulletPosition = ((rangeSlider.value - rangeSlider.min) /(rangeSlider.max - rangeSlider.min));
	rangeBullet.style.left = (bulletPosition * 578) + "px";
	dataset = masterData.filter(function (e) {
		return e.Year == rangeSlider.value 
	});
	d3.select("#vis").html("")
	d3.select("#tooltip").html("")
	d3.select("#legend").html("")
	platform = new Set()
	genre = new Set()
	platformRank = new Map()
	platformMax = 0
	categoriesXY = {}
	document.getElementById('nodata').style.visibility = (!dataset.length ? "visible":"hidden");
	setTimeout(mainFunc(), 100)
}

// groups genre for chart 1
function makeGroups() {
	var x = 400, y = 0
	for (var i = 0, len = genres.length; i < len; i++) {
		categoriesXY[genres[i]] = [ y , x ]
		y += 125
		if( i + 1 == Math.ceil(len/2) ) {
			y = 0
			x += 400
		}
	}
}

// Circular Plot
// function makeGroups() {
// 	for (var i = 0, len = genres.length; i < len; i++) {
// 		categoriesXY[genres[i]] = [ 350 + 250 * Math.sin(i*((2 * 3.14)/len)) , 500 + 250 * Math.cos(i*((2 * 3.14)/len)) ]
// 	}
// }

// Start Automation
function automate() {
	if(automationButtonText.textContent.split(" ")[0] != "Start") {
		cancelAutomation()
		return
	}
	automationButtonText.textContent = "Stop Automation"
	for(var i=1980;i<2021;i++) {
		automation.push(setTimeout(function(x) {

		rangeSlider.value = x
		var event = new Event('input', {
		    bubbles: true,
		    cancelable: true,
		});

		rangeSlider.dispatchEvent(event);
			},(i-1980)*4000,i))
	}
}

// Stop Automation
function cancelAutomation() {
	for(var i in automation) clearTimeout(i)
	automation = []
	automationButtonText.textContent = "Start Automation"
}

//platfrom wise rank for chart 2
function getPlatformRank() {
	for (var i = 0, len = dataset.length; i < len; i++) {
		platform.add(dataset[i].Platform)
		genre.add(dataset[i][(genrePlatformButton.value == 'true'? 'Category':'Platform')])
	}
	platform = Array.from(platform)
	genres = Array.from(genre)
	maxi = 0
	for (var i = 0, len = platform.length; i < len; i++) {
		var cnt = 0
		for (var j = 0, len2 = dataset.length; j < len2; j++)
			if(platform[i] == dataset[j].Platform) cnt ++
		if(cnt > maxi) maxi = cnt
	}
	for (var i = 0, len = platform.length; i < len; i++) {
		platformRank.set(platform[i],1)
	}
	for (var i = dataset.length - 1 , len = dataset.length; i >= 0; i--) {
		dataset[i].platformRank = platformRank.get(dataset[i].Platform)
		platformRank.set(dataset[i].Platform,1+platformRank.get(dataset[i].Platform))
	}

}

//utilits del
function getMaxLen(dataset)
{
	var tmp = 0,max=0;
	for(var i =1;i<6;++i)
	{
		max = 0
		var year = 0
		for(var j =1980;j<=2020-i;j++)
		{
			tmp = 0
			for (var k = dataset.length - 1 , len = dataset.length; k > 0; k--) 
			{
				if (dataset[k].Year >=j && dataset[k].Year < j + i)
				{
					tmp = tmp +1;
				}
			}
			if ( tmp>max &&j != 2009)
			{
				year = j
				max = tmp
			}
		}
	}
}

const margin = {left: 170, top: 50, bottom: 50, right: 20}
const width = 1000 - margin.left - margin.right
const height = 900 - margin.top - margin.bottom

// Get Data
d3.csv('./vgsales.csv', function(d){
	return {
		Name: d.Name,
		Year: d.Year,
		Platform: d.Platform,
		Rank: d.Rank,
		Sales: +d.Global_Sales,
		Publisher: d.Publisher,
		Category: d.Genre,
	};
}).then(data => {
	masterData = data;
  	dataset = masterData.filter(function (e) {
		return e.Year == rangeSlider.value
	});
	setTimeout(mainFunc(), 100)
})

const colors = ['#f2ca00', '#f74a4a', '#ff0080', '#00cccc', '#fc7eb9', '#5c5075',  '#15a4bd', '#77bfa4',  '#a4edd9', '#fc9a60', '#0f8ba6', '#edb2dc', '#c3ffa8', '#8f95ff']

//make scale
function createScales(){
	salesScale = d3.scaleLinear(d3.extent(dataset, d => d.Sales), [5, 35])
	categoryColorScale = d3.scaleOrdinal(genres, colors)
	histXScale = d3.scaleBand().range([margin.left+margin.right, margin.left+width+margin.right])
	histXScale.domain(platform.map(function(d) { return d; }))
	histYScale = d3.scaleLinear(d3.extent(dataset, d => d.platformRank), [margin.top + height, margin.top])
}

//Genre legends
function createLegend(x, y){
	let svg = d3.select('#legend')

	svg.append('g')
		.attr('class', 'categoryLegend')
		.attr('transform', `translate(${x},${y})`)

	categoryLegend = d3.legendColor()
		.shape('path', d3.symbol().type(d3.symbolCircle).size(150)())
		.shapePadding(6)
		.scale(categoryColorScale)

	d3.select('.categoryLegend')
		.call(categoryLegend)
}

// initial visualisation
function mainFunc(){
	getPlatformRank()
	makeGroups()
	createScales()

	let svg = d3.select("#vis")
		.append('svg')
		.attr('width', 1000)
		.attr('height', 950)
		.attr('opacity', 1)

	simulation = d3.forceSimulation(dataset)

	simulation.on('tick', () => {
		nodes
			.attr('cx', d => d.x)
			.attr('cy', d => d.y)
	})

	simulation.stop()

	nodes = svg
		.selectAll('ellipse')
		.data(dataset)
		.enter()
		.append('ellipse')
		.attr('fill', d => categoryColorScale(d[genrePlatformButton.value == 'true'? 'Category':'Platform']))
		.attr('rx', 3)
		.attr('ry', 3)
		.attr('opacity', 0.8)

	svg.selectAll('ellipse')
		.on('mouseover', mouseOver)
		.on('mouseout', mouseOut)

	function mouseOver(d, i){

		d3.select(this)
			.transition('mouseover').duration(100)
			.attr('opacity', 1)
			.attr('stroke-width', 2)
			.attr('stroke', 'black')

		d3.select('#tooltip')
			.style('left', (d3.event.pageX + 10)+ 'px')
			.style('top', (d3.event.pageY - 50) + 'px')
			.style('display', 'inline-block')
			.html(`
				<strong>Name:</strong> ${d.Name} 
				<br> <strong>Platform:</strong> ${d.Platform} 
				<br> <strong>Year:</strong> ${d.Year} 
				<br> <strong>Genre:</strong> ${d.Category} 
				<br> <strong>Publisher:</strong> ${d.Publisher} 
				<br> <strong>Sales:</strong> ${d.Sales} M`)
	}

	function mouseOut(d, i){
		d3.select('#tooltip')
			.style('display', 'none')

		d3.select(this)
			.transition('mouseout').duration(100)
			.attr('opacity', 0.8)
			.attr('stroke-width', 0)
	}

	svg.selectAll('rect')
		.data(genres).enter()
		.append('rect')
		.attr('class',"infoText")
		.attr('x',d => categoriesXY[d][0] + 150)
		.attr('y',d => categoriesXY[d][1] - 190)
		.attr('id',d => 'lab1' + d)
		.attr('opacity',"0")
		.attr('width',"120")
		.attr('height',"30")
		.attr('fill',d => categoryColorScale(d))
		.style('stroke-width','3')
		.style('stroke','rgb(0,0,0)')

    svg.selectAll('.infoText2')
        .data(genres).enter()
        .append('text')
        .attr('class', 'infoText2')
        .raise()

    svg.selectAll('.infoText2')
        .text(d => d)
        .attr('x', d => categoriesXY[d][0] + 210)
        .attr('y', d => categoriesXY[d][1] - 170)
		.attr('id',d => 'lab2' + d)
        .attr('font-family', 'Domine')
        .attr('font-size', '12px')
        .attr('font-weight', 700)
        .attr('fill', 'black')
        .attr('text-anchor', 'middle')

	if(prevScroll == 'down')
		histPlot()
	else
		mainPlot()
}

var buttonPar = false

// Add/Remove Labels
function labelToggle(x) {
	buttonPar = !buttonPar
	let svg = d3.select('#vis').select('svg')
	if(x == 'true' && !ishist) {
		svg.selectAll('.infoText').transition().attr('opacity', 1)
		svg.selectAll('.infoText2').transition().attr('opacity', 1)
	} else {
		svg.selectAll('.infoText').transition().attr('opacity', 0)
		svg.selectAll('.infoText2').transition().attr('opacity', 0)			
	}
}

// Refresh all elements
function refreshPage() {
	var event = new Event('input', {
		bubbles: true,
		cancelable: true,
	})

	rangeSlider.dispatchEvent(event)
}

// Remove Previous Graph
function rmPrevGraph(x){
	let svg = d3.select('#vis').select('svg')
	if(!x) {
		svg.selectAll('.infoText').transition().attr('opacity', 0)
		svg.selectAll('.infoText2').transition().attr('opacity', 0)
	} else if(buttonPar) {
		svg.selectAll('.infoText').transition().attr('opacity', 1)
		svg.selectAll('.infoText2').transition().attr('opacity', 1)		
	} else {
		svg.selectAll('.infoText').transition().attr('opacity', 0)
		svg.selectAll('.infoText2').transition().attr('opacity', 0)		
	}
	svg.selectAll('.hist-axis').transition().attr('opacity', 0)
}

var ishist = false

//chart one
function mainPlot(){
	ishist = false
	title.innerHTML = "Video Games Titles Grouped By Genre"
	let svg = d3.select("#vis").select('svg')

	rmPrevGraph(1)

	svg.selectAll('ellipse')
		.transition().duration(300).delay((d, i) => i * 5)
		.attr('rx', d => salesScale(d.Sales) * 1.3)
		.attr('ry', d => salesScale(d.Sales) * 1.3);

	simulation
		.force('charge', d3.forceManyBody().strength([2]))
		.force('forceX', d3.forceX(d => categoriesXY[d[genrePlatformButton.value == 'true'? 'Category':'Platform']][0] + 200))
		.force('forceY', d3.forceY(d => categoriesXY[d[genrePlatformButton.value == 'true'? 'Category':'Platform']][1] - 50))
		.force('collide', d3.forceCollide(d => salesScale(d.Sales) + 4))
		.alphaDecay([0.02])

	simulation.alpha(0.9).restart()

	createLegend(20, 50)
}

//chart 2
function histPlot(){
	ishist = true
	title.innerHTML = "Video Games Sales Platform Wise."
	let svg = d3.select('#vis').select('svg')

	rmPrevGraph(0)

	simulation.stop()

	svg.selectAll('ellipse')
		.transition().duration(600).delay((d, i) => i * 2).ease(d3.easeBack)
		.attr('rx', 20)
		.attr('ry', (maxi > 200? 3:12.06057 - 0.09934657 * maxi + 0.0002664266 * maxi * maxi))
		.attr('cx', function(d) {return histXScale(d.Platform)+histXScale.bandwidth()/2 })
		.attr('cy', d => histYScale(d.platformRank))
		.attr('fill', d => categoryColorScale(d[[genrePlatformButton.value == 'true'? 'Category':'Platform']]))

	let xAxis = d3.axisBottom(histXScale)
	svg.append('g')
		.attr('class', 'hist-axis')
		.attr('transform', `translate(0, ${height + margin.top + 8})`)
		.call(xAxis)

	createLegend(20, 50)
}

// On scroll change visualization
var scrollableElement = document.body; //document.getElementById('scrollableElement');

scrollableElement.addEventListener('wheel', checkScrollDirection);

function checkScrollDirection(event) {
  if (checkScrollDirectionIsUp(event)) {
	  if (prevScroll != 'up')
	  {
		  mainPlot()
		  prevScroll = 'up'
	  }
  } else {
	  if (prevScroll != 'down')
	  {
		  histPlot()
		  prevScroll = 'down'
	  }
  }
}

function checkScrollDirectionIsUp(event) {
  if (event.wheelDelta) {
    return event.wheelDelta > 0;
  }
  return event.deltaY < 0;
}

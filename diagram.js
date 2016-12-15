var tableNames = ["tableName1","tableName2","tableName3","tableName4"];
var table1 = ["red","yellow","blue"];
var table2 = ["blue","green","purple","black","violet","yellow"];
var table3 = ["cyan","pink","green"];
var table4 = ["salmon","red","green"];
 
var checkboxes = {
	tableName1 : table1,
	tableName2 : table2,
	tableName3 : table3,
	tableName4 : table4
};
 
var currentlyChecked=[]; //boxes currently checked
 
var spacingPixels = 6; //How far away the lines are from each other
var startingLinePixel = 5; //How far away the initial line is away from the table
 
 
function domMaker(){
	for(var i=0; i<tableNames.length; i++){
		var checkbox = document.createElement("input");
		var label = document.createElement("label");
		checkbox.type='checkbox';
		checkbox.value=tableNames[i];
		label.textContent=tableNames[i];
		label.setAttribute('for',tableNames[i]);
		checkbox.addEventListener('change', function () {
        if (this.checked) {
        	var currentTable = document.getElementById(this.value);
        	currentTable.style.display = "block";
        	currentTable.style.visibility = "visible";
        	currentTable.parentNode.style.display="block";
        	currentTable.parentNode.appendChild(currentTable);
        	currentlyChecked.push(this.value);
        } else {
        	document.getElementById(this.value).style.visibility = "hidden";
        	var index = currentlyChecked.indexOf(this.value)
        	currentlyChecked.splice(index,1);
        }
        recalculate(this.value,this.checked);
   	});
		document.body.appendChild(checkbox);
		document.body.appendChild(label);
	}
 
	for(var i=0; i<tableNames.length; i++){
		var surroundingDiv = document.createElement("div");
		surroundingDiv.id = tableNames[i]+"div";
		surroundingDiv.style.display="none";
		var table = document.createElement('table');
		table.id = tableNames[i];
		table.createTHead().insertRow().insertCell().innerHTML='<b>'+ tableNames[i] +'</b>';
		var values = checkboxes[tableNames[i]];
		for(var n=0; n<values.length; n++){
			table.insertRow().insertCell().innerHTML=values[n];
		}
 
		var styles = 'border: 1px solid black; ' 
               + 'display: none; '
               + 'position:relative; '
               + 'width: 200px;' ;
   		table.setAttribute('style', styles);  
 
		document.getElementById('containerDiv').appendChild(surroundingDiv).appendChild(table);
	}
}
 
function recalculate(value,checked){
	//we've got two tables here already
	//i'm adding one
	//how many matchy pixels are there
	if(checked===true){
		//matchy match with the other tables
		for(var i=0; i<currentlyChecked.length-1;i++){
			var sharedValues = checkboxes[value].filter(val => checkboxes[currentlyChecked[i]].includes(val));
			for(var n=0; n<sharedValues.length;n++){
				var index1=checkboxes[value].indexOf(sharedValues[n])+1;
				var index2=checkboxes[currentlyChecked[i]].indexOf(sharedValues[n])+1;
				var cell1 = getCellCoords(document.getElementById(value).rows[index1]);
				var cell2 = getCellCoords(document.getElementById(currentlyChecked[i]).rows[index2]);
				var cell2Value=currentlyChecked[i];
				if(cell1[1]>cell2[1]){
					draw(cell2,cell1,cell2Value,value);
				} else {
					draw(cell1,cell2,value,cell2Value);
				}
			}
		}
	} else {
		var rem = document.querySelectorAll("[name*='"+ value +"']"), i = 0;
		for (; i < rem.length; i++){
    		rem[i].parentNode.removeChild(rem[i]);
    		spacingPixels-=6;
		}
	}
 
}
 
function getCellCoords(obj){
	var rect = obj.getBoundingClientRect();
	var x = rect.left-startingLinePixel;
	var y = (rect.bottom+rect.top)/2;
	return [x,y];
}
 
 
function draw(topCell,bottomCell,topName,bottomName){
	var leftmostTableElementX, tableElementY, lowerTableElementY, tableElementX;
	tableElementX = topCell[0];
	tableElementY = topCell[1];
	lowerTableElementY = bottomCell[1];
	leftmostTableElementX = tableElementX-spacingPixels;
	createLines(leftmostTableElementX, tableElementY, lowerTableElementY, tableElementX,topName,bottomName);
	spacingPixels+=6;
}
 
function createLines(leftmostTableElementX, tableElementY, lowerTableElementY, tableElementX, topName,bottomName) {
	var width = tableElementX-leftmostTableElementX;
	var height = lowerTableElementY-tableElementY;
	var randomColor = Math.floor(Math.random()*16777215).toString(16);
    var mainLine = document.createElement("div");
    var styles = 'border: 2px solid; '
    		  + 'border-color: ' + randomColor + ';'
               + 'width: 0px; '
               + 'height: ' + height + 'px; '
               + 'position: absolute; '
               + 'top: ' + tableElementY + 'px; '
               + 'left: ' + leftmostTableElementX + 'px; ';
    mainLine.setAttribute('style', styles);
    mainLine.setAttribute('name', topName+bottomName);
 
   	var sideLineTop = document.createElement("div");
   	styles = 'border: 2px solid black; '
   	   		+ 'border-color: ' + randomColor + ';'
               + 'width: ' + width + 'px; '
               + 'height: 0px; '
               + 'position: absolute; '
               + 'top: ' + tableElementY + 'px; '
               + 'left: ' + leftmostTableElementX + 'px; ';
    sideLineTop.setAttribute('style', styles);  
    sideLineTop.setAttribute('name', topName+bottomName);
 
 
    var sideLineBottom = document.createElement("div");
   	styles = 'border: 2px solid black; '
   	  	   	+ 'border-color: ' + randomColor + ';'
               + 'width: ' + width + 'px; '
               + 'height: 0px; '
               + 'position: absolute; '
               + 'top: ' + lowerTableElementY + 'px; '
               + 'left: ' + leftmostTableElementX + 'px; ';
    sideLineBottom.setAttribute('style', styles);
    sideLineBottom.setAttribute('name', topName+bottomName);  
 
 
    document.body.appendChild(mainLine);
    document.body.appendChild(sideLineTop);
    document.body.appendChild(sideLineBottom);
}

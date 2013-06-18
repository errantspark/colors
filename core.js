var oldColors = [
  "#000000",
  "#FF0000",
  "#00FF00",
  "#FFFF00",
  "#0000FF",
  "#FF00FF",
  "#00FFFF",
  "#FFFFFF",
  "#888888",
  "#880000",
  "#008800",
  "#888800",
  "#000088",
  "#880088",
  "#008888",
  "#AAAAAA"
  ];
var newColors = [
  "#210210",
  "#f53441",
  "#69e02d",
  "#f7e731",
  "#246fdb",
  "#FF0090",
  "#89c6f5",
  "#ebead9",
  "#788898",
  "#ab3046",
  "#10cc3c",
  "#e06324",
  "#181840",
  "#a584bd",
  "#00B7EB",
  "#bAAA9f"
  ];

var outputEach = function(d,i){console.log("*color"+i+": "+d)}

var frag = document.createDocumentFragment();
var col1 = document.createElement("div");
col1.id = "column"
var col2 = document.createElement("div");
col2.id = "column"
frag.appendChild(col1);
frag.appendChild(col2);
document.body.appendChild(frag);

oldColors.forEach(function(d, i){
    var myDiv = document.createElement("div");
    myDiv.id = "color";
    myDiv.style.background = d;
    col1.appendChild(myDiv);
  }
);

newColors.forEach(function(d, i){
    var myDiv = document.createElement("div");
    myDiv.id = "color";
    myDiv.style.background = d;
    col2.appendChild(myDiv);
  }
);


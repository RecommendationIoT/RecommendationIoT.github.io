//Settings Section
var server="http://localhost:1880";
var tooltips={
        "name":"This is the name of the person that submited the configuration for this row",
        "user":"This is the name of the person that submited the configuration for this row",
        "borough":"This is the location for this configuration.",
        "houseid":"This is the anonymized houseID for this configuration.",
        "year":"This is the year that this configuration was submited.",
        "month":"This is the month that this configuration was submited.",
        "day":"This is the day of the month that this configuration was submited.",
        "hour":"This is the hour in 24 hour format that this configuration was submited.",
        "rating":"This is the rating for this configuration as estimated by our algorithms.",
        "schedule":"This is the scheduled temperature for this configuration.",
        "schedule temp":"This is the scheduled temperature for this configuration.",
        "desiredtemp":"This is the desired temperature for this configuration as defined by the user.",
        "humidity":"This is the humidity level when this configuration was submited.",
        "illness":"This is true if the user was ill when this configuration was submited and false if the user was healthy.",
        "distance":"This is the distance between your situation and this user's situation when he/she submited this configuration."
};


//Functionality
var queryParameters = {};
$(document).ready(function(){
        $("#function-select").change(function(){
                var selValue = $(this).find(":selected").attr("value");
                if(selValue === "user"){
                        $(".input-text").parent().show(500);
                        $(".input-datetime").parent().hide(500);
                }else if(selValue === "datetime"){
                        $(".input-text").parent().hide(500);
                        $(".input-datetime").parent().show(500);
                }else if(selValue === "recommendations"){
                        $(".input-text").parent().show(500);
                        $(".input-datetime").parent().show(500);
                }
        });
    $(".form-submit").click(function(){
                queryParameters = {};
        var inputs = $(this).parent().siblings(".form-input");
                for(i = 0; i<inputs.length; i++){
                        var current = $(inputs[i]).children()[1];
                        if($(current).attr('class') === 'input-text'){
                                queryParameters[$(current).attr('name')]=$(current).val();
                        }else if($(current).attr('class') === 'input-select'){
                                queryParameters[$(current).attr('name')]=$(current).find(":selected").attr("value");
                        }else if($(current).attr('class') === 'input-checkbox'){
                                $(current).find(":checked").each(function(){
                                        if(queryParameters[$(current).attr('name')] == null){
                                                queryParameters[$(current).attr('name')] = [];
                                        }
                                        queryParameters[$(current).attr('name')].push($(this).val());
                                });
                        }else if($(current).attr('class') === 'input-datetime'){
                                queryParameters[$(current).attr('name')]=$(current).val();
                        }
                }

                //pick function
                var urlAddress = "";
                var dataToSend = {};
                if(queryParameters["function"] === 'user'){
                        urlAddress = server+"/userPrefs";
                        dataToSend = {"name":queryParameters.name};
                }else if(queryParameters["function"] === 'datetime'){
                        urlAddress = server+"/dateRates";
                        dataToSend = {"datetime":queryParameters.datetime};
                }else if(queryParameters["function"] === 'recommendations'){
                        urlAddress = server+"/recs";
                        dataToSend = {"name":queryParameters.name,"datetime":queryParameters.datetime};
                }

                //send query
                $('.query-area > .result > .result-text').html("Querying Data from Neo4J...");
                $.ajax({
                  type: "POST",
                  url: urlAddress,
                  data: dataToSend,
                  complete: function(data){
                          //$('.query-area > .result > .result-text').html(data.responseText);
                          $('.query-area > .result > .result-text').html("");
                          //console.log(data);
                          //try{
                                createResultTable(JSON.parse(data.responseText));
                          //}catch(ex){$('.query-area > .result > .result-text').html("Connection Error.");}
                  },
                  dataType: "json"
                });
    });
});

function isFloat(val) {
    var floatRegex = /^-?\d+(?:[.,]\d*?)?$/;
    if (!floatRegex.test(val))
        return false;

    val = parseFloat(val);
    if (isNaN(val))
        return false;
    return true;
}

String.prototype.shuffle = function () {
    var a = this.split(""),
        n = a.length;

    for(var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a.join("");
}

function createResultTable(data){
        console.log(data);
        if(data == null){
                $('.query-area > .result > .result-text').html("Connection Error.");
                return 0;
        }

        var resultTable = document.createElement("table");
        resultTable.classList.add("resulttable");

        if(data.columns.length == 0){
                $('.query-area > .result > .result-text').html("No columns returned.");
                return 0;
        }

        var hIDIndex = -1;

        //create header row
        var headRow = document.createElement("tr");
        headRow.classList.add("resulttable_Headline");
        for(i=0;i<data.columns.length;i++){
                colName = document.createElement("th");
                colName.innerHTML = (data.columns[i]).replace("_"," ");
                if(colName.innerHTML == "HouseID"){
                        hIDIndex = i;
                }
                                tooltip_ico = document.createElement("span");
                                $(tooltip_ico).attr("class","tooltip_ico");
                                if(tooltips[colName.innerHTML.toLowerCase()] != null){
                                        $(tooltip_ico).attr("title",tooltips[colName.innerHTML.toLowerCase()]);
                                        colName.appendChild(tooltip_ico);
                                }
                headRow.appendChild(colName);
        }
        $(resultTable).append(headRow);

        if(data.data.length == 0){
                $('.query-area > .result > .result-text').html("No data found matching the provided parameters.");
                return 0;
        }

        //create data rows
        for(i=0;i<data.data.length;i++){
                var dataRow = document.createElement("tr");
                dataRow.classList.add("resulttable_Dataline");
                for(j=0;j<data.data[i].length;j++){
                        dataCell = document.createElement("th");
                        dataCell.innerHTML = data.data[i][j];
                        if(j == hIDIndex){
                                 dataCell.innerHTML =  dataCell.innerHTML.shuffle();
                        }
                        else if(isFloat(dataCell.innerHTML)){
                                dataCell.innerHTML = dataCell.innerHTML.substring(0,dataCell.innerHTML.indexOf(".")+3);
                        }
                        dataRow.appendChild(dataCell);
                }
                $(resultTable).append(dataRow);
        }

        $('.query-area > .result > .result-text').append(resultTable);
        $("tr:odd").css({"background-color":"rgba(150,200,150,0.2)"});
        return 0;
}
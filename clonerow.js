$(document).ready(function(){
  var data = {
    1: {
      "starthour" : 6, "startminute" : 0, "startampm" : "AM",
      "endhour" : 3, "endminute" : 0, "endampm" : "PM",
      "breaktime" : 0
    }
  };

  $(".total").text(0);

  function convertTo24Hour(hour, ampm) {
    if (ampm === "PM" && hour != 12) {
      return hour + 12;
    } else if (ampm === "AM" && hour == 12) {
      return 0;
    }
    return hour;
  }

  function calculateSum(a) {
    var startHour = convertTo24Hour(parseFloat(data[a]["starthour"]), data[a]["startampm"]);
    var endHour = convertTo24Hour(parseFloat(data[a]["endhour"]), data[a]["endampm"]);
    
    if (endHour < startHour) {
      endHour += 24; // Handle overnight shift
    }
    
    var totalMinutes = ((endHour * 60 + parseFloat(data[a]["endminute"])) 
                        - (startHour * 60 + parseFloat(data[a]["startminute"])) 
                        - (parseFloat(data[a]["breaktime"])));
    var totalHours = totalMinutes / 60;
    
    var location = $("#tableToModify tr")[a];
    $(location).find(".total").text(totalHours.toFixed(2));
  }

  function tableSum() {
    var tbSum = 0;
    $(".total").each(function(){
      tbSum += parseFloat($(this).text());
    });
    $(".totalSum").text(tbSum.toFixed(2));
  }

  function realtimeupdate() {
    $(".starthour, .startminute, .startampm, .endhour, .endminute, .endampm, .breaktime").change(function(){
      var row = $(this).closest("tr").index();
      var fieldClass = $(this).attr('class');
      var selectedVal = $(this).find("option:selected").val();
      var fieldName = fieldClass.replace(/\d/g, '');
      
      data[row][fieldName] = selectedVal;
      calculateSum(row);
      tableSum();
    });
  }

  realtimeupdate();

  $("button").click(function () {
    var rowCount = $("#tableToModify tr").length;

    // Get the last row and clone it
    var lastRow = $("#tableToModify tr:last").clone();
    
    // Increment the day number for the new row
    lastRow.find("td:first").text(rowCount);

    // Get values from the last row's inputs and set them in the new row
    lastRow.find(".starthour").val($("#tableToModify tr:last").find(".starthour").val());
    lastRow.find(".startminute").val($("#tableToModify tr:last").find(".startminute").val());
    lastRow.find(".startampm").val($("#tableToModify tr:last").find(".startampm").val());
    lastRow.find(".endhour").val($("#tableToModify tr:last").find(".endhour").val());
    lastRow.find(".endminute").val($("#tableToModify tr:last").find(".endminute").val());
    lastRow.find(".endampm").val($("#tableToModify tr:last").find(".endampm").val());
    lastRow.find(".breaktime").val($("#tableToModify tr:last").find(".breaktime").val());

    // Reset the total hours for the new row
    lastRow.find(".total").text(0);

    // Append the new row to the table
    $("#tableToModify").append(lastRow);

    // Initialize new row's data with the copied values
    data[rowCount] = {
      "starthour" : lastRow.find(".starthour").val(),
      "startminute" : lastRow.find(".startminute").val(),
      "startampm" : lastRow.find(".startampm").val(),
      "endhour" : lastRow.find(".endhour").val(),
      "endminute" : lastRow.find(".endminute").val(),
      "endampm" : lastRow.find(".endampm").val(),
      "breaktime" : lastRow.find(".breaktime").val()
    };

    // Reapply event listeners for the new row
    realtimeupdate();

    // Calculate and display total hours for the new row right after cloning
    calculateSum(rowCount);
    tableSum();
  });
});
$(document).ready(function()
{
    $('#codes_Table').DataTable();

} );
$(document).ready(function()
{
//    $('#employees_Table').DataTable();
    $("#employees_Table").DataTable({
        "searching": true
    });
//    $("#employees_Table").DataTable( {
  //      "order": [[ 0, 'asc' ], [ 1, 'asc' ]] //NEED TO FIX
//    } );
} );

$(document).ready(function() {
    $('#example').DataTable();
} );


//Below portion doesn't work yet, however this is what we need
//We need to store the JSON like data below, on MongoDB and then display it using DataTable (code below the data structs)
[
    { "server": "Orion",
      "location": "London",
      "details": [
            "GMT",
            "10.0.0.1"
        ]
    },
    { "server": "Saturn",
      "location": "New York",
      "details": [
            "EST",
            "10.0.1.1"
        ]
    }
]
$('#example').dataTable( {
    "aoColumns": [
        { "mData": "server" },
        { "mData": "location" },
        { "mData": "details.0" },
        { "mData": "details.1" }
    ]
} );
$('#codes_Table').DataTable( {
    dom: 'Bfrtip',
    buttons: [
        'colvis',
        'excel',
        'print'
    ]
} );


function myFunction() {
    var table = document.getElementById('codes_Table');
    var cells = table.getElementsByTagName('td');

    for (var i = 0; i < cells.length; i++) {
        // Take each cell
        var cell = cells[i];
        // do something on onclick event for cell
        cell.onclick = function () {
            // Get the row id where the cell exists
            var rowId = this.parentNode.rowIndex;

            var rowsNotSelected = table.getElementsByTagName('tr');
            for (var row = 0; row < rowsNotSelected.length; row++) {
                rowsNotSelected[row].style.backgroundColor = "";
                rowsNotSelected[row].classList.remove('selected');
            }
            var rowSelected = table.getElementsByTagName('tr')[rowId];
            rowSelected.style.backgroundColor = "grey";
            rowSelected.className += " selected";

            var y = rowSelected.cells[1];
            y.innerHTML = "Used";

            msg = 'You have claimed this code: ' + rowSelected.cells[0].innerHTML;

            alert(msg);
        }
    }

}
function generateCodescolumn(){
    
        var usedcodes = 'used codes';

        var docTable = document.getElementById('display-table');
        var rows = document.querySelectorAll('#display-tabletr');
        //Code Generator
       function codeGenerator(length) {
           var result           = '';
           var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%$&*@!';
           var charactersLength = characters.length;
           for ( var i = 0; i < length; i++ ) {
              result += characters.charAt(Math.floor(Math.random() * charactersLength));
           }
           return result;
    }
        // iterate rows
        for (var i = 1; i < rows.length; i++) {
            // get cell for class "check"
            var checkCell = rows[i].getElementsByClassName("chtable table-layout table-striped table-hover")[0];
            var docTypeCell = rows[i].getElementsByClassName("identifier")[0];
            checkCell.innerHTML = codeGenerator(5);
        }

}

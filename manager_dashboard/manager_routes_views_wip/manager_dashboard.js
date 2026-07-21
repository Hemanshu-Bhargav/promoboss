<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="utf-8">
    <title>Manager Dashboard - PromoBoss</title>

    <!-- Stylesheets -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.20/css/jquery.dataTables.css">
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/buttons/1.6.1/css/buttons.dataTables.min.css">

    <!-- JavaScript Dependencies (Loaded in head so scripts are ready before DOM renders) -->
    <script src="https://code.jquery.com/jquery-3.4.1.js" integrity="sha256-WpOohJOqMqqyKL9FccASB9O0KwACQJpFTUBLTYOVvVU=" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
    <script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.20/js/jquery.dataTables.js"></script>
    <script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/buttons/1.6.1/js/dataTables.buttons.min.js"></script>
    <script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/buttons/1.6.1/js/buttons.colVis.min.js"></script>
    <script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/buttons/1.6.1/js/buttons.html5.min.js"></script>
    <script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/buttons/1.6.1/js/buttons.print.min.js"></script>

    <style>
    .table-layout tr:hover {
        background-color: violet;
    }
    .table-layout {
        text-align: center;
        border: 1px solid black;
        border-collapse: collapse;
        font-family: "Trebuchet MS";
        margin: 0 auto;
    }
    .table-layout td, .table-layout th {
        border: 1px solid white;
        padding: 5px 5px 0;
    }
    .table-layout td {
        text-align: center;
    }
    .selected {
        color: black;
    }
    </style>

    <script>
    $(document).ready(function() {
        // Initialize Codes Table with Buttons extension
        $('#codes_Table').DataTable({
            dom: 'Bfrtip',
            buttons: [
                'colvis',
                'excel',
                'print'
            ]
        });

        // Initialize Employees Table with search and proper ordering
        $('#employees_Table').DataTable({
            "searching": true,
            "order": [[0, 'asc'], [1, 'asc']]
        });

        // Initialize Server Directory Table with corrected JSON configuration matching MongoDB data structure
        var serverData = [
            { 
                "server": "Orion",
                "location": "London",
                "details": [
                    "GMT",
                    "10.0.0.1"
                ]
            },
            { 
                "server": "Saturn",
                "location": "New York",
                "details": [
                    "EST",
                    "10.0.1.1"
                ]
            }
        ];

        $('#example').DataTable({
            "data": serverData,
            "columns": [
                { "data": "server" },
                { "data": "location" },
                { "data": "details.0" },
                { "data": "details.1" }
            ]
        });
    });

    // Code Generator
    function codeGenerator(length) {
        if (!length) length = 10;
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%$&*@!';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    function getTime() {
        var d = new Date();
        return " (" + d.toLocaleTimeString() + ")";
    }

    function myFunction() {
        var table = document.getElementById('codes_Table');
        var cells = table.getElementsByTagName('td');

        for (var i = 0; i < cells.length; i++) {
            var cell = cells[i];
            cell.onclick = function () {
                var rowId = this.parentNode.rowIndex;

                var rowsNotSelected = table.getElementsByTagName('tr');
                for (var row = 0; row < rowsNotSelected.length; row++) {
                    rowsNotSelected[row].style.backgroundColor = "";
                    rowsNotSelected[row].classList.remove('selected');
                }
                var rowSelected = table.getElementsByTagName('tr')[rowId];
                rowSelected.style.backgroundColor = "green";
                rowSelected.className += " selected";

                var CodeUsed = rowSelected.cells[2];
                var msg = 'You have claimed this code: ' + rowSelected.cells[1].innerHTML;
                CodeUsed.innerHTML = "Used" + getTime();
                CodeUsed.style.backgroundColor = "pink";

                alert(msg);
            }
        }
    }
    </script>
</head>
<body class="container my-4">
    <h1 class="navbar navbar-expand-lg navbar-light bg-light">Welcome <%= user.name %></h1>
    <h3>Today's Code Dashboard</h3>
    
    <section class="my-3">
        <a href="/logout" class="btn btn-secondary">Logout</a>
        <a href="/codemanager" class="btn btn-secondary">Enter Code Management Page</a>
        <button type="button" class="btn btn-secondary" onclick="codeGenerator()">Generate New Codes</button>
    </section>

    <!-- Codes Table -->
    <table id="codes_Table" class="table table-striped table-hover" width="100%">
        <thead>
            <tr>
                <th>Employee Number</th>
                <th>Codes</th>
                <th>Used</th>
                <th>Codes Requested</th>
                <th>Date/Time Launched</th>
                <th>Date/Time Used</th>
                <th>Expiry Date</th>
                <th>Store Number</th>
                <th>Associated Store Manager</th>
                <th>Associated Regional Manager</th>
                <th>Buttons</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>07637</td>
                <td>hpS5uuGlf</td>
                <td>Available</td>
                <td></td>
                <td>02/04/19</td>
                <td></td>
                <td>03/04/19</td>
                <td>090</td>
                <td>08201</td>
                <td>09201</td>
                <td><button type="button" class="btn btn-sm btn-primary" onclick="myFunction()">Claim</button></td>
            </tr>
            <tr>
                <td>09928</td>
                <td>qqgrqijet</td>
                <td>Available</td>
                <td></td>
                <td>02/04/19</td>
                <td></td>
                <td>03/04/19</td>
                <td>091</td>
                <td>08201</td>
                <td>09201</td>
                <td><button type="button" class="btn btn-sm btn-primary" onclick="myFunction()">Claim</button></td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <th>Employee Number</th>
                <th>Codes</th>
                <th>Used</th>
                <th>Codes Requested</th>
                <th>Date/Time Launched</th>
                <th>Date/Time Used</th>
                <th>Expiry Date</th>
                <th>Store Number</th>
                <th>Associated Store Manager</th>
                <th>Associated Regional Manager</th>
                <th>Buttons</th>
            </tr>
        </tfoot>
    </table>

    <br><hr><br>

    <!-- Employees Table -->
    <h3 class="mb-3">Employees Directory</h3>
    <table id="employees_Table" class="table table-striped table-hover" width="100%">
        <thead>
            <tr>
                <th>Employee Number</th>
                <th>Employee Name</th>
                <th>Codes Used</th>
                <th>Codes Requested</th>
                <th>Store Number</th>
                <th>Associated Store Manager</th>
                <th>Associated Regional Manager</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>1101</td>
                <td>John Doe</td>
                <td>FALSE</td>
                <td>TRUE</td>
                <td>090</td>
                <td>08201</td>
                <td>09541</td>
            </tr>
            <tr>
                <td>1102</td>
                <td>Jane Doe</td>
                <td>ACDYzYQ5g</td>
                <td>FALSE</td>
                <td>092</td>
                <td>08202</td>
                <td>09201</td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <th>Employee Number</th>
                <th>Employee Name</th>
                <th>Codes Used</th>
                <th>Codes Requested</th>
                <th>Store Number</th>
                <th>Associated Store Manager</th>
                <th>Associated Regional Manager</th>
            </tr>
        </tfoot>
    </table>

    <br><hr><br>

    <!-- Server / Location JSON DataTable -->
    <h3 class="mb-3">Server Location Directory (JSON Data)</h3>
    <table id="example" class="display table table-striped table-bordered" style="width:100%">
        <thead>
            <tr>
                <th>Server</th>
                <th>Location</th>
                <th>Timezone</th>
                <th>IP Address</th>
            </tr>
        </thead>
        <tbody>
            <!-- Populated via DataTables JSON configuration -->
        </tbody>
    </table>
</body>
</html>
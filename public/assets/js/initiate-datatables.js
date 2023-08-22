// Initiate datatables in roles, tables, users page
(function() {
    'use strict';
    
    $('#dataTables-example').DataTable({
        responsive: true,
        pageLength: 10,
        lengthChange: true,
        searching: false,
        ordering: false,
        paging:false
    });
})();
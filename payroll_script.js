// PAYROLL:  
const show_table = () => {
    // Init. a datastructure to store all employee information:
    total_staff = [] 
    // Run until the user exits by pressing "enter" or entering "-1":
    while(true){
        // Get the users name:
        var name = prompt("What is your name? (Enter -1 to view results)") 
        if(name.includes("-1") || name.length <=0 ) 
            break;
        // Get users total hours worked:
        var worked = prompt("How many hours did you work this week?") 
        // Calculate employees pay:
        var money = worked  * 15 
        // If needed, calculate overtime:
        if (worked > 40){ 
            let overtime = worked - 40
            let temp_worked = 40
            money = (overtime * (15 * 1.5) + (15 * temp_worked) )
        } 
        // Create an object containing all of the information about the user
        var employee = {"name": name, "worked" : worked, "money" : money}
        // Place the employee object into array storing all employee information:
        total_staff = [...total_staff, employee]
    }
    // Create HTML output:
    var table = "<table><tr><th>Name</th><th>Hours</th><th>NET</th></tr>"
    labor_cost = 0
    // Add each employee's details to the table:
    for(i = 0; i < total_staff.length; i++){
        table += "<tr><td>"+(i+1)+". "+total_staff[i]["name"]+'</td><td>' + total_staff[i]["worked"]+'</td><td>$ '+ total_staff[i]["money"] + '</td></tr>'
        labor_cost += total_staff[i]["money"]
    }
    // Add total to the table:
    table += "<tr><td><b>Labor Cost</b></td><td></td><td><b>$ " + labor_cost + "</b></td></tr>"
    // Show table to the user:
    document.getElementById("table_container").innerHTML = table
}



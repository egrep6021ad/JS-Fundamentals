// PAYROLL:  
const show_table = () => {
    total_staff = [] // Init. the "books"
    // Run until the user exits by pressing enter or entering -1:
    while(true){
        var name = prompt("What is your name? (Enter -1 to view results)") // Init users name
        if(name.includes("-1") || name.length <=0 ) 
            break;
        var worked = prompt("How many hours did you work this week?") // Init users total hours worked 
        var money = worked  * 15 // Calculate pay
        if (worked > 40){ // If needed, calculate overtime:
            let overtime = worked - 40
            let temp_worked = 40
            money = (overtime * (15 * 1.5) + (15 * temp_worked) )
        } // Create an object containing all of the information about the user
        var employee = {"name": name, "worked" : worked, "money" : money}
        // Place the employee object into the "books"
        total_staff = [...total_staff, employee]
    }
    // Create a table
    var table = "<table><tr><th>Name</th><th>Hours</th><th>NET</th></tr>"
    labor_cost = 0
    // Add each employee's details to the table
    for(i = 0; i < total_staff.length; i++){
        table += "<tr><td>"+(i+1)+". "+total_staff[i]["name"]+'</td><td>' + total_staff[i]["worked"]+'</td><td>$ '+ total_staff[i]["money"] + '</td></tr>'
        labor_cost += total_staff[i]["money"]
    }
    // Append the total ammount spent amongst all of the employees
    table += "<tr><td><b>Labor Cost</b></td><td></td><td><b>$ " + labor_cost + "</b></td></tr>"
    // Show table to the user:
    document.getElementById("table_container").innerHTML = table
}





// GAME: 
// Function: --> Gameboard
var checked = null;  
const show_game = () => {
    const n = prompt("How many tiles would you like (8, 10, or 12")
    checked = n;
    var ordered_images = []; // Init array for images
    for( i = 1; i<=n ; i++){ // While i < n; 
        for(j = 1; j <= 2 ; j++) // Add the images to the array
            ordered_images = [...ordered_images, "<img src='./images/match"+i+""+j+".webp'/>"]
    }
    // Shuffle the images
    ordered_images = shuffle(ordered_images)
    // Append the images to output
    output = ""
    for( i = 0 ; i < ordered_images.length; i++)
        output += ordered_images[i] 
    // Write the images to the UI 
    document.getElementById("show_game").innerHTML = output;
}

// Function: array[unshuffled] -> array[shuffled]
const shuffle = (arg) => {
    for(i = 0; i < arg.length; i++){ // For each element in arr
      j = Math.floor(Math.random() * arg.length); // New random index
      curr = arg[i]  
      arg[i] = arg[j] // Swap current index with random index
      arg[j] = curr
    } 
    console.log(arg.length)
    show_timer()
    return arg;
  }

 // Function: --> UI timer
const show_timer = () => {
    var time = 0; 
    const timer = setInterval(() => {
        time ++
        if(time >= 3){ // When the timer is up, hide the images:
            let arr = document.getElementsByTagName("img")
            for(i = 0 ; i < arr.length ; i++) {
                arr[i].setAttribute("src", "./images/stars.webp") // Hide the images
                arr[i].setAttribute("id", i+1) // Give the images id's [1-n] 
                // Set the click function for each image with its id
                arr[i].setAttribute("onclick", "handle_click("+(i+1)+")") 
            } clearInterval(timer)
        }
        document.getElementById("show_timer").innerHTML = time;
    }, 1000);
}

// click handler
var checked_boxes = new Array(checked+1).fill(false);
const handle_click = async (id) => {
    
   await document.getElementById(id).setAttribute("src","./images/match"+(id-4)+"1.webp")
    if((checked_boxes[id] && checked_boxes[id+1])|| (checked_boxes[id] && checked_boxes[id-1])){
        temp = []
        for( i = 0; i < checked_boxes.length; i++){
            if (checked_boxes[i] == true) temp = [...temp, i]
        }
        hide_image(temp)
    }
    else
        checked_boxes[id] = true
    var count = 0
    for(i = 0 ; i< checked_boxes.length; i++){
        if(checked_boxes[i] == true) count++
        if (count >=2 )
            new Array(checked+1).fill(false);
    }

}

// Function: html <img> "id" --> original image

const hide_image = (arg) => {
    let temp = []
    for( i = 0 ; i < arg.length ; i++){
        let doc = document.getElementById(arg[i])
        temp = [...temp, doc]
    }
   for( i = 0; i < temp.length; i++){
    let id = temp[i].getAttribute("id")
    temp[i].setAttribute("src","./images/match"+id+"1.webp")
    temp[i+1].setAttribute("src","./images/match"+id+"2.webp")
    break;
   }
    const timer = setTimeout(() => {
        doc.setAttribute("class", "hide_image")
    }, 3000);
    //doc.setAttribute("class", "hide_image")
}

  